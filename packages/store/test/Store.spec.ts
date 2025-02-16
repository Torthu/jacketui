import { md5Comparison } from "../src/comparison/md5Comparison";
import { Store } from "../src/Store";
import { md5 } from "../src/utils";

describe.only("Model", () => {
  describe("init", () => {
    it("should instantiate Model", () => {
      const model = new Store<any, any>({
        initialState: {},
        actionHandlers: [],
      });

      expect(model).toBeInstanceOf(Store);
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
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action) => {
            return { ...state, a: "B" };
          },
        ],
      });

      model.dispatch({ type: "TEST" });

      expect(model.getState()).toEqual({ a: "B" });
    });

    it("should update state async", (done) => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action, commit) => {
            commit({ ...state, a: "B" });
            done();
          },
        ],
      });

      model.dispatch({ type: "TEST" });

      expect(model.getState()).toEqual({ a: "B" });
    });

    it("should update state async", (done) => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action, commit) => {
            if (action.type === "TEST") {
              setTimeout(() => {
                commit({ ...state, a: "B" });
                action.payload();
                done();
              }, 10);
            }
          },
        ],
      });

      const testCallback = () => expect(model.getState()).toEqual({ a: "B" });
      model.dispatch({ type: "TEST", payload: testCallback });
    });
  });

  describe("onDataChanged", () => {
    it("should not be called if state hasnt changed", () => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [],
      });

      const listener = jest.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).not.toHaveBeenCalled();
    });
    it("should be called if data changed", () => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action) => {
            return { ...state, a: "B" };
          },
        ],
      });

      const listener = jest.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });
  });
  describe("onPreDataChanged", () => {
    it("should be called", () => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action) => {
            return { ...state, a: "B" };
          },
        ],
      });

      const listener = jest.fn();
      model.onPreDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });

    it("should be called even if state does not change", () => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [],
      });

      const listener = jest.fn();
      model.onPreDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });
  });

  describe("md5Comparison", () => {
    it("should not be called if state hasnt changed", () => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [],
        compareFunction: md5Comparison,
      });

      const listener = jest.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).not.toHaveBeenCalled();
    });

    it("should be called if data changed", () => {
      const model = new Store<any, any>({
        initialState: { a: "A" },
        actionHandlers: [
          (state, action) => {
            state.a = "B";
            return state;
          },
        ],
        compareFunction: md5Comparison,
      });

      const listener = jest.fn();
      model.onDataChanged(listener);

      model.dispatch({ type: "TEST" });

      expect(listener).toHaveBeenCalled();
    });
  });
});
