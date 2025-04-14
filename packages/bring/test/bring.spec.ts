import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import fetchMock from "fetch-mock";
import {
  AbortError,
  bring,
  ClientError,
  ServerError,
  TimeoutError,
} from "../src";
import { isResult } from "@torthu/jacketui-core";

describe("bring", () => {
  beforeAll(() => {
    fetchMock.mockGlobal();
  });

  afterEach(() => {
    fetchMock.removeRoutes();
  });

  afterAll(() => {
    fetchMock.unmockGlobal();
  });

  it("should return a Response wrapped in Result", async () => {
    fetchMock.get("http://example.com", 200);

    const response = await bring({ url: "http://example.com" });

    expect(isResult(response)).toBe(true);
    expect(response.ok).toBe(true);
    expect(response.value).toBeInstanceOf(Response);

    fetchMock.removeRoute("http://example.com");
  });

  it("server error should return an Error wrapped in Result", async () => {
    fetchMock.get("http://example.com", 500);

    const response = await bring({
      url: "http://example.com",
      retry: 1,
      timeout: 100,
      onError: () => console.log("error"),
      onRetry: () => console.log("retrying"),
      onTimeout: () => console.log("timeout"),
      onClientError: () => console.log("client error"),
      onServerError: () => console.log("server error"),
      onAbort: () => console.log("aborted"),
      onSuccess: () => console.log("success"),
    });

    console.log(response);

    expect(isResult(response)).toBe(true);
    expect(response.ok).toBe(false);
    expect(response.error).toBeInstanceOf(ServerError);
  });

  it("client error should return an Error wrapped in Result", async () => {
    fetchMock.get("http://example.com", 400);
    const response = await bring({ url: "http://example.com" });
    expect(isResult(response)).toBe(true);
    expect(response.ok).toBe(false);
    expect(response.error).toBeInstanceOf(ClientError);
  });

  it("client error should return an Error wrapped in Result", async () => {
    fetchMock.get("http://example.com", 400);
    const response = await bring({ url: "http://example.com" });
    expect(isResult(response)).toBe(true);
    expect(response.ok).toBe(false);
    expect(response.error).toBeInstanceOf(ClientError);
  });

  it("should timeout", async () => {
    fetchMock.get("http://foo.bar.com", 200, {
      delay: 5000,
    });

    const retryCb = vi.fn();

    const response = await bring({
      url: "http://foo.bar.com",
      timeout: 10,
      onRetry: retryCb,
      retry: 3,
    });

    expect(isResult(response)).toBe(true);
    expect(response.ok).toBe(false);
    expect(response.error).toBeInstanceOf(TimeoutError);
    expect(retryCb).toHaveBeenCalledTimes(3);
  });

  it("should retry", async () => {
    fetchMock.get("http://foo.bar.com", 200, {
      delay: 5000,
    });

    const retryCb = vi.fn();

    const response = await bring({
      url: "http://foo.bar.com",
      timeout: 10,
      onRetry: retryCb,
      retry: 3,
    });

    expect(isResult(response)).toBe(true);
    expect(response.ok).toBe(false);
    expect(response.error).toBeInstanceOf(TimeoutError);
    expect(retryCb).toHaveBeenCalledTimes(3);
  });

  it("should abort", () =>
    new Promise<void>((done) => {
      fetchMock.get("http://foo.bar.com", 200, {
        delay: 5000,
      });

      const abortController = new AbortController();
      let response;

      const promise = bring({
        url: "http://foo.bar.com",
        timeout: 10,
        abortController,
      });

      promise.then((res) => {
        response = res;
        expect(isResult(response)).toBe(true);
        expect(response.ok).toBe(false);
        expect(response.error).toBeInstanceOf(AbortError);
        done();
      });

      abortController.abort();
    }));
});
