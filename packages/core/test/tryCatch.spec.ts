import { describe, it, expect } from "vitest";
import { JuiError, tryCatch } from "../src";

const noThrow = () => {
  return "resolved";
};

const doesThrow = () => {
  throw new Error("rejected");
};

describe("tryCatch", () => {
  describe("synchronous", () => {
    it("no throw", () => {
      const { ok, error, value } = tryCatch<string>(noThrow);
      expect(ok).toBe(true);
      expect(error).toBe(undefined);
      expect(value).toBe("resolved");
    });

    it("throws", () => {
      const { ok, error, value } = tryCatch<string>(doesThrow);
      expect(ok).toBe(false);
      expect(error).toBeInstanceOf(JuiError);
      expect(error?.message).toBe("rejected");
      expect(value).toBe(undefined);
    });
  });
});
