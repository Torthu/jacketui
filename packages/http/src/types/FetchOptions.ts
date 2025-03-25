import { AbortError, TimeoutError } from "../errors";
import { ClientError } from "../errors/ClientError";
import { CorsError } from "../errors/CorsError";
import { ServerError } from "../errors/ServerError";

export interface FetchOptions<T = unknown> {
  onSuccess?: (response: T) => void;
  onRequestError?: (
    error: AbortError | TimeoutError | CorsError | Error
  ) => void;
  onResponseError?: (error: ClientError | ServerError | Error) => void;
  onError?: (
    error:
      | AbortError
      | TimeoutError
      | CorsError
      | ClientError
      | ServerError
      | Error
  ) => void;
  onAbort?: (error: AbortError) => void;
  onRetry?: (retriesRemaining: number, reason?: any) => void;
  onTimeout?: (error: TimeoutError) => void;
  retry?: number;
  timeout?: number;
}
