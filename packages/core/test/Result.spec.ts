import { describe, expect, it } from "vitest";
import { failure, success } from "../src";

describe("Result", () => {
  describe("success", () => {
    it("should return a success result", () => {
      const result = success(1);
      expect(result.ok).toBe(true);
      expect(result.value).toBe(1);
      expect(result.error).toBe(undefined);
    });
  });
  describe("failure", () => {
    it("should return a failure result", () => {
      const result = failure(new Error("error"));
      expect(result.ok).toBe(false);
      expect(result.value).toBe(undefined);
      expect(result.error).toBeInstanceOf(Error);
    });
  });
});
