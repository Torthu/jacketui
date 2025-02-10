import Model from "../src/Model";
import { md5 } from "../../Crypto";

describe.only("Model", () => {
  describe("init", () => {
    it("should instantiate Model", () => {
      const model = new Model<any, any>({
        initialState: {},
        actionHandlers: [],
        hashingFunction: md5,
      });

      expect(model).toBeInstanceOf(Model);
    });
  });

  describe("cloneDeep", () => {
    it("should clone object", () => {
      const testObj = { a: "A", b: "B" };
      const clonedObj = Model.cloneDeep(testObj);

      expect(clonedObj).not.toBe(testObj);
    });

    it("should clone array", () => {
      const test = ["A", "B"];
      const cloned = Model.cloneDeep(test);

      expect(cloned).not.toBe(test);
    });

    it("should deep clone array", () => {
      const test = [{ a: "A" }, { b: "B" }];
      const cloned = Model.cloneDeep(test);

      expect(cloned).not.toBe(test);
      expect(cloned[0]).not.toBe(test[0]);
      expect(cloned[1]).not.toBe(test[1]);
    });

    it("should deep clone object", () => {
      const test = { a: { a: "A" }, b: { b: "B" } };
      const cloned = Model.cloneDeep(test);

      expect(cloned).not.toBe(test);
      expect(cloned.a).not.toBe(test.a);
      expect(cloned.b).not.toBe(test.b);
    });
  });

  describe("clonePath", () => {
    it("should clone object", () => {
      const testObj = { a: "A", b: "B" };
      const clonedObj = Model.clonePath(testObj, []);

      expect(clonedObj).not.toBe(testObj);
    });

    it("should clone array", () => {
      const test = ["A", "B"];
      const cloned = Model.clonePath(test, []);

      expect(cloned).not.toBe(test);
    });

    it("should deep clone array", () => {
      const test = [{ a: "A" }, { b: "B" }];
      const cloned = Model.clonePath(test, [0]);

      expect(cloned).not.toBe(test);
      expect(cloned[0]).not.toBe(test[0]);
      expect(cloned[1]).toBe(test[1]);
    });

    it("should deep clone object", () => {
      const test = { a: { a: "A" }, b: { b: "B" } };
      const cloned = Model.clonePath(test, ["b", "b"]);

      expect(cloned).not.toBe(test);
      expect(cloned.a).toBe(test.a);
      expect(cloned.b).not.toBe(test.b);
    });
  });
});
