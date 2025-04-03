import { FetchOptions } from "./FetchOptions";

export interface InFlight<T> {
  hash: string;
  request: string | URL | Request;
  fetchPromise: Promise<T>;
  controller: AbortController;
  timeoutSignal?: AbortSignal;

  promises: Array<{
    promise: Promise<unknown>;
    reject: (reason?: any) => void;
    resolve: (response: unknown) => void;
    onSuccess?: FetchOptions["onSuccess"];
    onError?: FetchOptions["onError"];
    onAbort?: FetchOptions["onAbort"];
    onTimeout?: FetchOptions["onTimeout"];
    onRetry?: FetchOptions["onRetry"];
  }>;

  error?: any;
  retry: number;
  timeout?: number;
}
