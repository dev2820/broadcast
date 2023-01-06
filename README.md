# Broadcasting
Broadcasting is a State management library available in chrome extensions

Broadcasting helps you write Chrome Extension Application that follow MVVM patterns. 

Broadcasting is a library that allows view and background areas to communicate in a pub/sub structure through Broadcast Channel. two classes exist for communication, Radio and Broadcasting. when Radio subscribes to Broadcasting, Broadcasting informs Radio of the changes. 

## Installation

```bash
npm install broadcasting
```

## How to use

### make store 
create a store that contains status and actions to change status. place the store in the background.

```ts
// background.ts
import { createStore } from "broadcasting";

const store = createStore({
  state: {
    count: 0
  },
  actions: {
    increase() {
      this.count++;
    },
    setCount(newCount: number) {
      this.count = newCount;
    },
  },
});
```

**Note**  you must create a new array or object when you update it because it does not keep track of the array and object updates. like below.

```ts
const store = createStore({
  state: {
    arr: [1,2,3]
  },
  actions: {
    push(num) {
      this.arr = [...this.arr,num]
    }
  },
});
```

### create BroadcastingStation
creates a Broadcasting Station to broadcast changes in the state of the store.

```ts
// background.ts
import { createStore, BroadcastingStation } from "broadcasting";

const store = createStore({...});
const broadcastingStation = new BroadcastingStation("count", copyStore);
```

now, read the `channelAddress` value of broadcastingStation. this value is used to create a Radio for communication.
communicate to the area you want to communicate with Broadcasting Station (such as 'popup') through runtime.postMessage, etc.

```ts
// background.ts
import { createStore, BroadcastingStation } from "broadcasting";

const store = createStore({...});
const broadcastingStation = new BroadcastingStation("count", copyStore);

const handleRuntimeMessage = (message:any,sender:chrome.runtime.MessageSender,sendResponse:(response?: any) => void) => {
  /**
   * Send 'broadcastingStation.channelAddress' through runtime.onMessage.
   */
   if(message === 'CHANNEL') {
    sendResponse(broadcastingStation.channelAddress);
   }
}
chrome.runtime.onMessage.addListener(handleRuntimeMessage)
```

### create Radio
In order to communicate with `BroadcastingStation`, you need to create a `Radio` 


for example, i have `popup.html` as below. my js(or ts) code will be located in popup.ts file.
```html
<!-- popup.html -->
<html>
  <head>
    <link href="/assets/css/theme.css" rel="stylesheet"></link>
  </head>
  <body>
    <script type="module" src="popup"></script>
  </body>
</html>
```

make Radio in `popup.ts` 
```ts
// popup.ts
import { type ChannelAddress, Radio } from "broadcasting";
let radio = null;

async function init() {
  const channelAddress = (await chrome.runtime.sendMessage('CHANNEL')) as ChannelAddress;
  
  /**
   * You need to set sender and receiver for the constructor of Radio, and enter channelAddress here.
   * Note that send and recv should be reversed. recv is BroadcastingStation's receiver address. 
   * Therefore, Radio gives a message to recv and receives a message from send. 
   */
  radio = new Radio(
    {sender:channelAddress.recv,receiver:channelAddress.send},
    (initialState: Record<string, any>) => {
      /**
       * The second parameter allows you to receive the initial value of the store.
       */
       console.log(initialState); // { count: 0 }
    }
  );
  radio.$subscribe((newState: Record<string,any>) => {
    /**
     * You can subscribe to changes in the radio's state through $subscribe.
     */
  });
}

init();
```

### Broadcast action to update status
`radio` can broadcast the Action and forward it to BroadcastingStation
BroadcastingStation will deliver the action to the store.

**Note** The first parameter for an action is the name of the action and must be the same as the name you wrote when you created the store.

```ts
// popup.ts
import { type ChannelAddress, Radio, Action } from "broadcasting";
...
const increaseAction = new Action('increase');
radio.broadcastAction(increaseAction)
```

`increaseAction` changes `count` state from 0 to 1 so listeners you registered through $subscribe will work.

you can use action with params or async/await. for example

```ts
// background.ts
const countStore = createStore({
  state: { count: 0 },
  actions: {
    increase() {
      this.count++;
    },
    doNothing() {
      // nothing to do;
    },
    setCount(newCount: number) {
      this.count = newCount;
    },
    async asyncSetCount(newCount: number) {
      this.count = await new Promise((resolve) => {
        resolve(newCount);
      });
    },
  },
});

// popup.ts
/**
 * !Note! 
 * The value that can be passed to the parameter is limited to the value to which the structured clone applies.
 */
const setAction = new Action('setCount',3);
radio.broadcastAction(setAction);

/**
 * async action also o.k
 */
const asyncSetAction = new Action('asyncSetCount',4);
radio.broadcastAction(asyncSetAction);

/**
 * If there is no change in state, the listener registered as $subscribe will not work.
 */
const doNothingAction = new Action('doNothing',2);
radio.broadcastAction(asyncSetAction);
```

### forceUpdate
Even if there is no change in state, you can force an update

```ts
/**
 * this method rise update, therefore popup's Radio will run listeners
 */
broadcastingStation.forceUpdate();
```


