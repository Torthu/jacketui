import { AbortError, TimeoutError } from "../errors";
import { FetchOptions } from "./FetchOptions";

export interface Middleware {
  onRequest?: (
    request: string | URL | Request,
    options: FetchOptions
  ) => [Request, FetchOptions];
  onResponse?: (response: Response) => Response;
  onRequestError?: (error: any) => any;
  onResponseError?: (error: any) => any;
  onTimeout?: (error: TimeoutError) => TimeoutError | void;
  onAbort?: (error: AbortError) => AbortError | void;
  onRetry?: (request: string | URL | Request, options: FetchOptions) => any;
}
