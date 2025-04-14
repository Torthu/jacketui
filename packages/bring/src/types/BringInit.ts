import {
  AbortError,
  BringError,
  ClientError,
  NetworkError,
  ServerError,
  TimeoutError,
} from "../errors";

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export interface BringCallbacks {
  onAbort?: (error: AbortError) => void;
  onNetworkError?: (error: NetworkError) => void;
  onError?: (error: BringError) => void;
  onRetry?: (retryNum: number) => void;
  onSuccess?: (response: Response) => void;
  onTimeout?: (error: TimeoutError) => void;
  onClientError?: (error: ClientError) => void;
  onServerError?: (error: ServerError) => void;
}

export interface RequestInit {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  body?:
    | string
    | ArrayBuffer
    | Blob
    | DataView
    | File
    | FormData
    | TypedArray
    | URLSearchParams
    | ReadableStream;
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached";
  credentials?: "omit" | "same-origin" | "include";
  headers?: Record<string, string> | Headers;
  integrity?: string;
  keepalive?: boolean;
  mode?: "cors" | "no-cors" | "same-origin";
  priority?: "low" | "high" | "auto";
  redirect?: "follow" | "error" | "manual";
  referrer?: string | "" | "about:client";
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  // signal?: AbortSignal; // Handled by bring() or the AbortController passed in
}

export interface RetryBackoff {
  retry?: number;
  timeout?: number;
  shouldRetry?: (response: Response, retryNum: number) => boolean;
  backoff?: (retryNum: number) => number;
  jitter?: () => number;
}

export type BringInit = RequestInit &
  RetryBackoff &
  BringCallbacks & {
    url: string | URL;
    abortController?: AbortController;
  };
