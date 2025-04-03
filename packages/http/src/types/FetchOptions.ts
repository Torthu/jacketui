import { AbortError, TimeoutError } from "../errors";

export interface FetchOptions {
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error | TimeoutError | AbortError) => void;
  onAbort?: (error: AbortError) => void;
  onRetry?: (retry: number, error: Error | TimeoutError | AbortError) => void;
  onTimeout?: (error: TimeoutError) => void;
  retry?: number;
  timeout?: number;
}
