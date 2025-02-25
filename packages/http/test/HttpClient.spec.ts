import { AbortError } from "../src/errors";
import { abort, HttpClient } from "../src/HttpClient";
import { withResolvers } from "../src/withResolvers";
import {
  describe,
  beforeEach,
  afterEach,
  test,
  it,
  vi,
  expect,
  Mock,
} from "vitest";

describe("HttpClient", () => {
  beforeEach(() => {
    global.fetch = vi.fn(
      (input: string | URL | Request, init?: RequestInit | undefined) => {
        const { promise, resolve, reject } = withResolvers();
        if (input === "immediate") {
          resolve({ json: () => ({ test: 100 }) });
        } else if (input === "withTimeout") {
          setTimeout(() => {
            if (init?.signal?.aborted) {
              reject("Aborted");
            } else {
              resolve({ json: () => ({ test: 100 }) });
            }
          }, 2);
        } else if (input === "withTimeout2") {
          setTimeout(() => {
            if (init?.signal?.aborted) {
              reject("Aborted");
            } else {
              resolve({ json: () => ({ test: 100 }) });
            }
          }, 2);
        } else if (input === "timeoutTest") {
          setTimeout(() => {
            if (init?.signal?.aborted) {
              reject("Aborted");
            } else {
              resolve({ json: () => ({ test: 100 }) });
            }
          }, 10);
          setTimeout(() => {
            if (init?.signal?.aborted) {
              reject("Aborted");
            } else {
              resolve({ json: () => ({ test: 100 }) });
            }
          }, 100);
        } else {
          reject("Not found");
        }
        return promise as Promise<Response>;
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch", async () => {
    const client = new HttpClient();
    const response = await client.fetch("immediate");
    const json = await response.json();
    expect(json).toEqual({ test: 100 });
  });

  it("should abort", async () => {
    const cb = vi.fn();
    const errcb = vi.fn();
    const abortcb = vi.fn();

    const client = new HttpClient();
    let res;
    let err;

    const promise = client.fetch("withTimeout", {
      onSuccess: cb,
      onError: errcb,
      onAbort: abortcb,
    });

    client.abort(promise);

    try {
      res = await promise;
    } catch (e) {
      err = e;
    }

    expect(cb).not.toHaveBeenCalled();
    expect(errcb).toHaveBeenCalled();
    expect(abortcb).toHaveBeenCalled();
    expect(res).toBeUndefined();
    expect(err).toBeInstanceOf(AbortError);
  });

  it("should getInFlight", () => {
    const client = new HttpClient();
    const promise = client.fetch("immediate");
    const inFlight = client.getInFlight(promise);

    expect(inFlight).toBeDefined();
  });

  it("two identical requests should share the same inFlight", () => {
    const client = new HttpClient();
    const promise1 = client.fetch("withTimeout");
    const promise2 = client.fetch("withTimeout");

    const inFlight1 = client.getInFlight(promise1);
    const inFlight2 = client.getInFlight(promise2);

    expect(inFlight1).toBe(inFlight2);
  });

  it("should not share inFlight between different requests", () => {
    const client = new HttpClient();
    const promise1 = client.fetch("withTimeout");
    const promise2 = client.fetch("withTimeout2");

    const inFlight1 = client.getInFlight(promise1);
    const inFlight2 = client.getInFlight(promise2);

    expect(inFlight1).not.toBe(inFlight2);
  });

  it("should retry", async () => {
    const retryCb = vi.fn();
    const retries = 5;
    const cb = vi.fn();
    const errcb = vi.fn();

    const client = new HttpClient();

    let res;
    let err;

    try {
      res = await client.fetch("err", {
        onRetry: retryCb,
        retry: retries,
        onSuccess: cb,
        onError: errcb,
      });
    } catch (error) {
      err = error;
    }

    expect(res).toBeUndefined();
    expect(err).toBeDefined();
    expect(cb).not.toHaveBeenCalled();
    expect(errcb).toHaveBeenCalled();
    expect(retryCb).toHaveBeenCalledTimes(5);
  });

  it("should timeout", async () => {
    const timeout = 1;

    global.fetch = vi.fn(
      (input: string | URL | Request, init?: RequestInit | undefined) => {
        const { promise, resolve, reject } = withResolvers();
        setTimeout(() => {
          if (init?.signal?.aborted) {
            reject("Aborted");
          } else {
            resolve({ json: () => ({ test: 100 }) });
          }
        }, timeout + 1);

        return promise as Promise<Response>;
      }
    );
    const timeoutCB = vi.fn();
    const cb = vi.fn();
    const errCB = vi.fn();
    const abortCB = vi.fn();

    const client = new HttpClient();

    let res;
    let err;

    try {
      res = await client.fetch("timeoutTest", {
        timeout,
        onTimeout: timeoutCB,
        onAbort: abortCB,
        onSuccess: cb,
        onError: errCB,
      });
    } catch (error) {
      err = error;
    }

    expect(timeoutCB).toHaveBeenCalled();
    expect(abortCB).not.toHaveBeenCalled();
    expect(errCB).toHaveBeenCalled();
    expect(cb).not.toHaveBeenCalled();
    expect(res).toBeUndefined();
    expect(err).toBeDefined();

    return;
  });
});
