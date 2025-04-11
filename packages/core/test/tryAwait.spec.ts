import { describe, it, expect } from "vitest";
import { tryAwait } from "../src/tryAwait";
import { pipe } from "../src/pipe";
import { failure, Result } from "../src/result";

const successPromise = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1);
  });
};

const failPromise = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("rejected");
    }, 1);
  });
};

describe("tryAwait", () => {
  describe("object unstructuring", () => {
    it("success", async () => {
      const { ok, error, value } = await tryAwait(successPromise());
      expect(ok).toBe(true);
      expect(error).toBe(undefined);
      expect(value).toBe("resolved");
    });

    it("error", async () => {
      const { ok, error, value } = await tryAwait(failPromise());
      expect(ok).toBe(false);
      expect(error?.message).toBe("rejected");
      expect(value).toBe(undefined);
    });
  });

  describe("classic promise workflow", () => {
    it("success", async () => {
      const { ok, error, value } = await tryAwait(successPromise()).then(
        (res) => {
          return res;
        }
      );

      expect(ok).toBe(true);
      expect(error).toBe(undefined);
      expect(value).toBe("resolved");
    });

    it("error", async () => {
      const { ok, error, value } = await tryAwait(failPromise()).catch(
        (res) => {
          return res;
        }
      );

      expect(ok).toBe(false);
      expect(error.message).toBe("rejected");
      expect(value).toBe(undefined);
    });

    it("pipe", async () => {
      const enrichError = (result: Result) => {
        if (result.ok) {
          return result;
        }
        return failure(new Error("enriched error"));
      };

      const validateResult = (result: Result) => {
        if (result.ok) {
          return result;
        }
        return result;
      };

      const fetchRes = await tryAwait(failPromise());
      const { ok, error, value } = pipe(validateResult, enrichError)(fetchRes);

      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("enriched error");
    });
  });
});
