import { FetchOptions } from "./FetchOptions";

export interface Middleware {
  onRequest?: (request: string | URL | Request) => string | URL | Request;
  onResponse?: (response: Response) => Response;
  onRequestError?: FetchOptions["onRequestError"];
  onResponseError?: FetchOptions["onResponseError"];
}
