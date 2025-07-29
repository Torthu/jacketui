import { describe, it, vi, expect } from "vitest";
import { Store, md5Comparison } from "../src";

type State = { a: string };
type Action = { type: string; payload?: () => void };

describe("Store", () => {
  describe("init", () => {
    it("should instantiate Model", () => {
      const store = new Store<{}, Action>({
        initialState: {},
        actionHandlers: [],
      });

      expect(store).toBeInstanceOf(Store);
    });
  });

  describe("cloneDeep", () => {
    it("should clone object", () => {
      const testObj = { a: "A", b: "B" };
      const clonedObj = Store.cloneDeep(testObj);

      expect(clonedObj).not.toBe(testObj);
    });

    it("should clone array", () => {
      const test = ["A", "B"];
      const cloned = Store.cloneDeep(test);

      expect(cloned).not.toBe(test);
    });

    it("should deep clone array", () => {
      const test = [{ a: "A" }, { b: "B" }];
      const cloned = Store.cloneDeep(test);

      expect(cloned).not.toBe(test);
      expect(cloned[0]).not.toBe(test[0]);
      expect(cloned[1]).not.toBe(test[1]);
    });

    it("should deep clone object", () => {
      const test = { a: { a: "A" }, b: { b: "B" } };
      const cloned = Store.cloneDeep(test);

      expect(cloned).not.toBe(test);
      expect(cloned.a).not.toBe(test.a);
      expect(cloned.b).not.toBe(test.b);
    });
  });

  describe("clonePath", () => {
    it("should clone object", () => {
      const testObj = { a: "A", b: "B" };
      const clonedObj = Store.clonePath(testObj, []);

      expect(clonedObj).not.toBe(testObj);
    });

    it("should clone array", () => {
      const test = ["A", "B"];
      const cloned = Store.clonePath(test, []);

      expect(cloned).not.toBe(test);
    });

    it("should deep clone array", () => {
      const test = [{ a: "A" }, { b: "B" }];
      const cloned = Store.clonePath(test, [0]);

      expect(cloned).not.toBe(test);
      expect(cloned[0]).not.toBe(test[0]);
      expect(cloned[1]).toBe(test[1]);
    });

    it("should deep clone object", () => {
      const test = { a: { a: "A" }, b: { b: "B" } };
      const cloned = Store.clonePath(test, ["b", "b"]);

      expect(cloned).not.toBe(test);
      expect(cloned.a).toBe(test.a);
      expect(cloned.b).not.toBe(test.b);
    });
  });

  describe("dispatch", () => {
    it("should update state", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state: State, action: Action) => {
            return { ...state, a: "B" };
          },
        ],
      });

      model.dispatch({ type: "TEST" });

      expect(model.getState()).toEqual({ a: "B" });
    });

    it("should update state async", () => {
      const model = new Store<{}, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action, commit) => {
            commit({ ...state, a: "B" });
          },
        ],
      });

      model.dispatch({ type: "TEST" });

      expect(model.getState()).toEqual({ a: "B" });
    });

    it("should update state async", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action, commit) => {
            if (action.type === "TEST") {
              setTimeout(() => {
                commit({ ...state, a: "B" });
                action.payload?.();
              }, 10);
            }
          },
        ],
      });

      const testCallback = () => expect(model.getState()).toEqual({ a: "B" });
      model.dispatch({ type: "TEST", payload: testCallback });
    });
  });

  describe("state", () => {
    it("should return state", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [],
      });

      expect(model.getState()).toEqual({ a: "A" });
    });

    it("setState() should trigger onDataChanged", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [],
      });

      const listener = vi.fn();
      model.onDataChanged(listener);

      model.setState({ a: "B" });

      expect(listener).toHaveBeenCalled();
    });
  });

  describe("onDataChanged", () => {
    it("should not be called if state hasnt changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [],
      });

      const listener = vi.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).not.toHaveBeenCalled();
    });

    it("should be called if data changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state: State, action: Action) => {
            return { ...state, a: "B" };
          },
        ],
      });

      const listener = vi.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });
  });

  describe("onPreDataChanged", () => {
    it("should be called", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state: State, action: Action) => {
            return { ...state, a: "B" };
          },
        ],
      });

      const listener = vi.fn();
      model.onPreDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });

    it("should be not be called if state does not change", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [],
      });

      const listener = vi.fn();
      model.onPreDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("md5Comparison", () => {
    it("should not be called if state hasnt changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [],
        compareFunction: md5Comparison,
      });

      const listener = vi.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).not.toHaveBeenCalled();
    });

    it("should be called if data changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state: State, action: Action) => {
            state.a = "B";
            return state;
          },
        ],
        compareFunction: md5Comparison,
      });

      const listener = vi.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });
  });

  describe("selectors", () => {
    it("should return the same value if state hasnt changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [],
      });
      const selector = model.createSelector((state) => state.a);
      const value = selector();
      expect(value).toBe("A");
      model.dispatch({ type: "TEST" });
      expect(selector()).toBe(value);
    });

    it("should return a new value if state has changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [
          (state: State, action: Action) => {
            state.a = "B";
            return state;
          },
        ],
      });

      const selector = model.createSelector((state) => state.a);

      const value = selector();

      expect(value).toBe("A");

      model.dispatch({ type: "TEST" });

      expect(selector()).not.toBe(value);
      expect(selector()).toBe("B");
    });

    it("should return a new value if complex state has changed", () => {
      type ComplexState = {
        a: string;
        b: {
          c: string;
        };
      };

      const model = new Store<ComplexState, Action>({
        initialState: { a: "A", b: { c: "C" } },
        actionHandlers: [
          (state: ComplexState, action: Action) => {
            state.b.c = "D";
            return state;
          },
        ],
      });
      const selector = model.createSelector((state) => state.b.c);
      const value = selector();
      expect(value).toBe("C");
      model.dispatch({ type: "TEST" });
      expect(selector()).not.toBe(value);
      expect(selector()).toBe("D");
    });
  });

  describe("createSlice", () => {
    it("should return a new value if state has changed", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [(state: State, action: Action) => ({ a: "B" })],
      });
      const slice = model.createSlice(
        (state) => state.a,
        (v) => null
      );
      const value = slice.state;
      expect(value).toBe("A");

      model.dispatch({ type: "TEST" });

      expect(slice.state).not.toBe(value);
      expect(slice.state).toBe("B");
    });

    it("should trigger onUpdate when selector return value changes", () => {
      const model = new Store<State, Action>({
        initialState: { a: "A" },
        actionHandlers: [(state: State, action: Action) => ({ a: "B" })],
      });

      const spy = vi.fn();

      const slice = model.createSlice((state) => state.a, spy);

      model.dispatch({ type: "TEST" });
      expect(spy).toBeCalledWith("B");
      expect(spy).toBeCalledTimes(1);
      expect(slice.state).toBe("B");
    });

    it("should not trigger onUpdate when selector return value does not change", () => {
      const model = new Store<{ a: string; b: string }, Action>({
        initialState: { a: "A", b: "B" },
        actionHandlers: [
          (state: State, action: Action) => ({ ...state, b: "B" }),
        ],
      });

      const spy = vi.fn();

      model.createSlice((state) => state.a, spy);
      model.dispatch({ type: "TEST" });

      expect(spy).not.toBeCalled();
    });
  });
});
