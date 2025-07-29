import {
  Result,
  success,
  failure,
  AbortablePromise,
  withResolvers,
} from "@torthu/jacketui-core";
import { isClientErrorResponse } from "./types/ClientErrorResponse";
import { BringInit } from "./types/BringInit";
import { isInformationalResponse } from "./types/InformationalResponse";
import { isRedirectResponse } from "./types/RedirectResponse";
import { isServerErrorResponse } from "./types/ServerErrorResponse";
import {
  AbortError,
  ClientError,
  BringError,
  NetworkError,
  ServerError,
  TimeoutError,
} from "./errors";
import { tryFetch } from "./tryFetch";

/** bring({url: string | URL})
 *
 * A wrapper around the fetch API that adds support for timeouts, retries, and aborts.
 * It also adds support for custom error handling and success handling.
 * It returns a promise that resolves to a Result object.
 * The returned promise is extended with an abort method that can be used to abort the fetch request.
 *
 * The Result object contains either a Response object or a BringError.
 *
 * @param init {BringInit | BringError} RequestInit + retries, timeout, onSuccess, onError, onAbort, onRetry, onTimeout, onClientError, onServerError
 * @param init.url The URL to fetch.
 * @param init.abortController (optional) An AbortController object to abort the fetch request. (default: new AbortController())
 * @param init.timeout (optional) The timeout in milliseconds. (default: 0)
 * @param init.retry (optional) The number of times to retry the fetch request. (default: 0)
 * @param init.onSuccess (optional) A callback function that is called when the fetch request is successful.
 * @param init.onError (optional) A callback function that is called when the fetch request fails.
 * @param init.onAbort (optional) A callback function that is called when the fetch request is aborted.
 * @param init.onRetry (optional) A callback function that is called when the fetch request is retried.
 * @param init.onTimeout (optional) A callback function that is called when the fetch request times out.
 * @param init.onClientError (optional) A callback function that is called when the fetch request fails with a client error.
 * @param init.onServerError (optional) A callback function that is called when the fetch request fails with a server error.
 * @param init.body (optional) The body of the fetch request.
 * @param init.headers (optional) The headers of the fetch request.
 * @param init.method (optional) The method of the fetch request.
 * @param init.mode (optional) The mode of the fetch request.
 * @param init.credentials (optional) The credentials of the fetch request.
 * @param init.cache (optional) The cache of the fetch request.
 * @param init.redirect (optional) The redirect of the fetch request.
 * @param init.referrer (optional) The referrer of the fetch request.
 * @param init.referrerPolicy (optional) The referrerPolicy of the fetch request.
 * @param init.integrity (optional) The integrity of the fetch request.
 * @param init.keepalive (optional) The keepalive of the fetch request.
 * @returns AbortablePromise<Result<Response, BringError>>
 */
export const bring = (init: BringInit | BringError) => {
  if (init instanceof BringError) init = init.requestInit;

  const {
    url,
    abortController = new AbortController(),
    timeout = 0,
    retry = 0,
    onSuccess,
    onError,
    onAbort,
    onRetry,
    onTimeout,
    onClientError,
    onServerError,
    onNetworkError,
    ...requestInit
  } = init;

  // Configure promise
  const { promise, resolve } = withResolvers();
  const abortablePromise = promise as AbortablePromise<
    Result<Response, BringError>
  >;
  abortablePromise.abort = abortController.abort;

  // Configure timeout signal
  const timeoutSignal = timeout > 0 ? AbortSignal.timeout(timeout) : undefined;
  const signal = AbortSignal.any(
    [abortController.signal, timeoutSignal].filter((s) => !!s)
  );

  tryFetch(
    url,
    {
      ...requestInit,
      signal,
    },
    init,
    0
  ).then(({ error, value }) => {
    if (error) {
      if (abortController.signal.aborted) {
        const abortError = new AbortError(abortController.signal.reason, {
          context: {
            url: url,
            method: requestInit.method ?? "GET",
            reason: abortController.signal.reason,
          },
          cause: error,
          url,
          requestInit: init,
        });

        onAbort?.(abortError);
        onError?.(abortError);
        return resolve(failure(abortError));
      }

      if (timeoutSignal?.aborted) {
        const timeoutError = new TimeoutError("Timeout", {
          context: {
            reason: timeoutSignal.reason,
            timeout,
          },
          cause: error,
          url,
          requestInit: init,
        });

        onTimeout?.(timeoutError);
        onError?.(timeoutError);
        return resolve(failure(timeoutError));
      }

      if (error instanceof Error) {
        const networkError = new NetworkError(error.message, {
          context: { url, method: requestInit.method ?? "GET" },
          cause: error,
          url,
          requestInit: init,
        });

        onError?.(networkError);
        return resolve(failure(networkError));
      }

      if (typeof error === "string") {
        return resolve(
          failure(new BringError(error, { url, requestInit: init }))
        );
      }

      return resolve(
        failure(new BringError("Unknown error", { url, requestInit: init }))
      );
    } else {
      const response = value;

      if (response.ok) {
        onSuccess?.(response);
        return resolve(success(response));
      } else {
        if (isClientErrorResponse(response)) {
          const clientError = new ClientError(response.statusText, {
            context: {
              status: response.status,
              statusText: response.statusText,
            },
            response,
            requestInit: init,
            url,
          });
          onClientError?.(clientError);
          onError?.(clientError);
          return resolve(failure(clientError));
        }
        if (isServerErrorResponse(response)) {
          const serverError = new ServerError(response.statusText, {
            response,
            requestInit: init,
            url,
            context: {
              status: response.status,
              statusText: response.statusText,
            },
          });
          onServerError?.(serverError);
          onError?.(serverError);
          return resolve(failure(serverError));
        }

        const unknownError = new BringError("Fetch failed", {
          context: {
            url,
            status: response.status,
            statusText: response.statusText,
          },
          url: url,
          requestInit: init,
          response,
        });

        onError?.(unknownError);
        return resolve(failure(unknownError));
      }
    }
  });

  return abortablePromise;
};
