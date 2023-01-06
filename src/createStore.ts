import Action from "@/classes/Action";
import Store from "@/interfaces/Store";

export default function createStore(storeOption: {
  state: Record<string, any>;
  actions: Record<string, any>;
}): Store {
  const { state, actions } = storeOption;

  let _isChanged_ = false;

  const store = {};

  const stateMap = Object.keys(state).reduce((map, key: string) => {
    return map.set(key, state[key]);
  }, new Map<string, any>());

  const actionMap = Object.keys(actions).reduce((map, key: string) => {
    const action = actions[key];
    if (typeof action !== "function") return map;

    if (action.constructor.name === "AsyncFunction") {
      return map.set(key, async function () {
        _isChanged_ = false;
        await action.bind(store)(...arguments);

        return _isChanged_;
      });
    }

    return map.set(key, function () {
      _isChanged_ = false;
      action.bind(store)(...arguments);

      return _isChanged_;
    });
  }, new Map<string, Function>());

  const stateKeys = [...stateMap.keys()];
  stateKeys.forEach((key: string) => {
    Object.defineProperty(store, key, {
      get: () => {
        if (!stateMap.has(key)) return undefined;
        return stateMap.get(key);
      },
      set: (value: any) => {
        _isChanged_ = true;
        stateMap.set(key, value);
      },
    });
  });

  const actionKeys = [...actionMap.keys()];
  actionKeys.forEach((key: string) => {
    Object.defineProperty(store, key, {
      get: () => {
        if (!actionMap.has(key)) return undefined;
        return actionMap.get(key);
      },
    });
  });

  Object.defineProperty(store, "$dispatch", {
    get: () => {
      return (action: Action) => {
        if (!actionMap.has(action.type)) return;

        const act = actionMap.get(action.type);
        const isChanged = act ? act(action.payload) : false;

        return isChanged;
      };
    },
  });
  Object.defineProperty(store, "$state", {
    get: () => {
      return Object.fromEntries(stateMap);
    },
  });

  return store as Store;
}
