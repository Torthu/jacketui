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

    onSuccess?: (response: unknown) => void;
    onError?: (reason?: any) => void;
    onAbort?: (reason?: any) => void;
    onTimeout?: () => void;
    onRetry?: (retry: number, reason?: any) => void;
  }>;

  error?: any;
  retry: number;
  timeout?: number;
}
