import { FetchOptions } from "./FetchOptions";

export interface InFlight<T> {
  hash: string;
  request: string | URL | Request;
  fetchPromise: Promise<T>;
  controller: AbortController;
  promises: Array<{
    promise: Promise<unknown>;
    reject: (reason?: any) => void;
    resolve: (response: unknown) => void;

    onSuccess?: FetchOptions<T>["onSuccess"];
    onError?: FetchOptions<T>["onError"];
    onAbort?: FetchOptions<T>["onAbort"];
    onTimeout?: FetchOptions<T>["onTimeout"];
    onRetry?: FetchOptions<T>["onRetry"];

    onRequestError?: FetchOptions<T>["onRequestError"];
    onResponseError?: FetchOptions<T>["onResponseError"];
  }>;
  error?: any;
  retry: number;
  timeout?: number;
}
