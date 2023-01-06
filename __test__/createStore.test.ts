import { test, expect } from "@jest/globals";
import { createStore, Action } from "@/index";

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

test("read data", () => {
  /**
   * data read
   */
  const count = countStore.count;
  expect(count).toBe(0);
});

test("read $state", () => {
  /**
   * all states can be referenced by $state property
   */
  expect(countStore.$state).toStrictEqual({
    count: 0,
  });
});

test("use actions", () => {
  /**
   * increase count
   */
  const isChanged = countStore.increase();
  expect(countStore.count).toBe(1);
  expect(isChanged).toBe(true);
});

test("if action doesn't change state", () => {
  /**
   * if store's action doesn't change state, then action return false;
   */
  const isChanged = countStore.doNothing();
  expect(isChanged).toBe(false);
});

test("use actions with parameters", () => {
  /**
   * if store's action doesn't change state, then action return false;
   */
  const isChanged = countStore.setCount(0);
  expect(isChanged).toBe(true);
  expect(countStore.count).toBe(0);
});

test("how to use $dispatch", () => {
  /**
   * you can also use actions by using $dispatch
   * $dispatch needs Action as a parameter
   */
  const action = new Action("setCount", 3);
  const isChanged = countStore.$dispatch(action);
  expect(isChanged).toBe(true);
  expect(countStore.count).toBe(3);
});

test("how to use async action", async () => {
  /**
   * you can also use actions with async/await
   */
  const isChanged = await countStore.asyncSetCount(5);
  expect(isChanged).toBe(true);
  expect(countStore.count).toBe(5);
});

test("how to use async action with $dispatch", async () => {
  /**
   * you can also use actions with async/await
   */
  const action = new Action("asyncSetCount", 4);
  const isChanged = await countStore.$dispatch(action);
  expect(isChanged).toBe(true);
  expect(countStore.count).toBe(4);
});
