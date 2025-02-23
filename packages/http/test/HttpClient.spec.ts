import { HttpClient } from "../src/HttpClient";
import { withResolvers } from "../src/withResolvers";

describe("HttpClient", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(
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
          } else if (input === "withLongTimeout") {
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
    jest.restoreAllMocks();
  });

  it("should fetch", async () => {
    const client = new HttpClient();
    const response = await client.fetch("immediate");
    const json = await response.json();
    expect(json).toEqual({ test: 100 });
  });

  it("should abort", (done) => {
    const cb = jest.fn();
    const errcb = jest.fn();
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

  it("should retry", (done) => {
    const retryCb = jest.fn();
    const retries = 5;
    const cb = jest.fn();
    const errcb = jest.fn();

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

  it.only("should timeout", (done) => {
    const retryCb = jest.fn();
    const timeoutCb = jest.fn();
    const retries = 5;
    const timeout = 1;
    const cb = jest.fn();
    const errcb = jest.fn();

    const client = new HttpClient();

    client
      .fetch("withLongTimeout", {
        onRetry: retryCb,
        retry: retries,
        timeout,
        onTimeout: timeoutCb,
      })
      .then(cb)
      .catch(errcb);

    setTimeout(() => {
      expect(errcb).toHaveBeenCalledTimes(1);
      expect(timeoutCb).toHaveBeenCalledTimes(1);
      done();
    }, retries * timeout + 1);
  });
});
