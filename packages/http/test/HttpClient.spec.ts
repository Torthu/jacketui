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

  it("should abort", () => {
    new Promise<void>((done) => {
      const cb = vi.fn();
      const errcb = vi.fn();
      const client = new HttpClient();
      const promise = client.fetch("withTimeout");
      promise.then(cb).catch(errcb);
      client.abort(promise);

      setTimeout(() => {
        expect(cb).not.toHaveBeenCalled();
        expect(errcb).toHaveBeenCalled();
        done();
      }, 3);
    });
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

  it("should retry", () => {
    new Promise<void>((done) => {
      const retryCb = vi.fn();
      const retries = 5;
      const cb = vi.fn();
      const errcb = vi.fn();

      const client = new HttpClient();

      client
        .fetch("err", { onRetry: retryCb, retry: retries })
        .then(cb)
        .catch(errcb);

      setTimeout(() => {
        expect(retryCb).toHaveBeenCalledTimes(5);
        expect(cb).not.toHaveBeenCalled();
        expect(errcb).toHaveBeenCalledTimes(1);
        done();
      }, retries * 2 + 1);
    });
  });

  it.only("should timeout", () => {
    return new Promise<void>((done) => {
      vi.useFakeTimers();
      const timeout = 1;
      let timeoutCalled = false;

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

      client
        .fetch("timeoutTest", {
          timeout,
          onTimeout: timeoutCB,
          onAbort: abortCB,
        })
        .then(cb)
        .catch(errCB);

      vi.advanceTimersByTime(timeout + 2);
      vi.useRealTimers();

      setTimeout(() => {
        expect(timeoutCB).toHaveBeenCalled();
        expect(abortCB).toHaveBeenCalled();
        expect(errCB).toHaveBeenCalled();
        expect(cb).not.toHaveBeenCalled();
        done();
      }, timeout + 2);
    });
  });
});
