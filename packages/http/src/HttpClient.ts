import { AbortError } from "./errors/AbortError";
import { TimeoutError } from "./errors/TimeoutError";
import { md5 } from "./md5";
import { InFlight } from "./types/InFlight";
import { withResolvers } from "./withResolvers";

export class HttpClient {
  private _inFlight: InFlight<unknown>[] = [];

  public static wasAborted = (error: unknown): error is AbortError => {
    return error instanceof AbortError;
  };

  public static wasTimeout = (error: unknown): error is TimeoutError => {
    return error instanceof TimeoutError;
  };

  constructor() {
    this.fetch = this.fetch.bind(this);
    this.getInFlight = this.getInFlight.bind(this);
    this.abort = this.abort.bind(this);
    this.getRequest = this.getRequest.bind(this);
  }

  /** wasAborted(error);
   *  Checks if an error was caused by an abort.
   *
   * @param {DOMException | Error} error
   * @returns boolean
   */
  private _wasAborted(error: DOMException | Error | string): boolean {
    if (typeof error === "string") {
      return error === "AbortError" || error === "Aborted";
    } else {
      return error?.name === "AbortError" || error?.name === "Aborted";
    }
  }

  /** wasTimeout(error);
   *  Checks if an error was caused by a timeout.
   *
   * @param {DOMException | Error} error
   * @returns boolean
   */
  private _wasTimeout(inFlight: InFlight<unknown>): boolean {
    return inFlight.controller.signal.reason === "Timeout";
  }

  /** fetch(request)
   *  Wraps native fetch. Deduplicates requests. Provides an abort method.
   *
   * @param {string | URL | Request} request
   * @returns Promise
   */
  public fetch(
    request: string | URL | Request,
    {
      onSuccess,
      onAbort,
      onError,
      onRetry,
      onTimeout,
      retry = 0,
      timeout = 0,
    }: {
      onSuccess?: (response: unknown) => void;
      onError?: (reason?: any) => void;
      onAbort?: (reason?: any) => void;
      onRetry?: (retry: number, reason?: any) => void;
      onTimeout?: () => void;
      retry?: number;
      timeout?: number;
    } = {}
  ): Promise<Response> {
    const hash = md5(request);
    let inFlight = this.getInFlight(hash);
    const { promise, resolve, reject } = withResolvers();

    if (!inFlight) {
      const [fetchPromise, controller] = this._doFetch(request, hash, timeout);

      inFlight = {
        hash,
        request,
        fetchPromise,
        controller,
        retry,
        promises: [],
        timeout,
      };

      this._inFlight.push(inFlight);
    }

    inFlight.promises.push({
      promise,
      reject,
      resolve,
      onSuccess,
      onError,
      onAbort,
      onRetry,
      onTimeout,
    });

    return promise as Promise<Response>;
  }

  /** getInFlight(promiseOrHash)
   *  Get an inflight request by promise or request hash.
   *
   *  The InFligh object contains the fetch promise (i.e the HTTP-request promise), the abort controller, and the promises.
   *
   * @example Getting inFlight by promise:
   *   const promise = httpClient.fetch("https://api.example.com");
   *   const inFlight = httpClient.getInFlight(promise);
   *
   * @example Manually aborting a request (essentially the same as calling httpClient.abort(promise)):
   *   const promise = httpClient.fetch("https://api.example.com");
   *   const inFlight = httpClient.getInFlight(promise);
   *   inFlight.controller.abort();
   *
   * @param {Promise<any> | string} promiseOrHash
   * @returns {InFlight | undefined}
   */
  public getInFlight(
    promiseOrHash: Promise<unknown> | string
  ): InFlight<unknown> | undefined {
    if (typeof promiseOrHash === "string") {
      const hash = promiseOrHash as string;
      return this._inFlight.find((f) => f.hash === hash);
    } else {
      const promise = promiseOrHash as Promise<unknown>;

      return this._inFlight.find(
        (f) => !!f.promises.find((p) => p.promise === promise)
      );
    }
  }

  /** abort(promise);
   *  Finds and aborts a fetch request by promise.
   *
   * @param {Promise} promise
   *
   * @example
   *   const promise = httpClient.fetch("https://api.example.com");
   *   httpClient.abort(promise);
   */
  public abort(promise: Promise<any> | string, reason?: any): void {
    this.getInFlight(promise)?.controller.abort(reason);
  }

  /** getRequest(promise);
   *  Get the original string | URL | Request from a promise.
   *
   * @param promise
   * @returns {string | URL | Request | undefined}
   */
  public getRequest(
    promise: Promise<unknown> | string
  ): string | URL | Request | undefined {
    const inFlight = this.getInFlight(promise);
    return inFlight?.request;
  }

  private _doFetch(
    request: string | URL | Request,
    hash: string,
    timeout = 0
  ): [Promise<Response>, AbortController] {
    const controller = new AbortController();
    const fetchPromise = globalThis.fetch(request, {
      signal: controller.signal,
    });
    const fetchTimeout =
      timeout > 0
        ? setTimeout(() => {
            controller.abort("Timeout");
          }, timeout)
        : null;

    fetchPromise
      .then((response) => {
        if (fetchTimeout) {
          clearTimeout(fetchTimeout);
        }
        this._fetchSuccess(response, hash);
      })
      .catch((error) => {
        if (fetchTimeout) {
          clearTimeout(fetchTimeout);
        }
        this._fetchError(error, hash);
      })
      .finally(() => {
        this._fetchFinally(hash);
      });

    return [fetchPromise, controller];
  }

  private _retry(hash: string) {
    const inFlight = this.getInFlight(hash);
    if (inFlight && inFlight.retry > 0) {
      inFlight.promises.forEach((p) => {
        p.onRetry?.(inFlight.retry, inFlight.error);
      });

      inFlight.retry = inFlight.retry - 1;
      const [fetchPromise, controller] = this._doFetch(
        inFlight.request,
        inFlight.hash,
        inFlight.timeout
      );

      inFlight.fetchPromise = fetchPromise;
      inFlight.controller = controller;
    }
  }

  private _fetchFinally(hash: string) {
    const inFlight = this.getInFlight(hash);

    if (inFlight) {
      if (inFlight.retry > 0) {
        this._retry(hash);
      } else {
        const index = this._inFlight.indexOf(inFlight);

        if (index > -1) {
          this._inFlight.splice(index, 1);
        }
      }
    }
  }

  private _fetchError(reason: any, hash: string) {
    const inFlight = this.getInFlight(hash);
    let error: Error;

    if (inFlight) {
      const wasAborted = this._wasAborted(reason);
      const wasTimeout = this._wasTimeout(inFlight);

      if (wasTimeout) {
        error = new TimeoutError(reason);
      } else if (wasAborted) {
        error = new AbortError(reason);
      } else if (typeof reason === "string") {
        error = new Error(reason);
      } else {
        error = reason;
      }

      inFlight.error = error;

      if (wasAborted && !wasTimeout) {
        inFlight.retry = 0;
      }

      if (inFlight.retry <= 0) {
        inFlight.promises.forEach((p) => {
          p.reject(error);
          p.onError?.(error);
          if (wasAborted && !wasTimeout) {
            console.log("CALL ONABORT", !!p.onAbort);
            p.onAbort?.(error);
          }
          if (wasTimeout) {
            p.onTimeout?.();
          }
        });
      }
    }
  }

  private _fetchSuccess(response: Response, hash: string) {
    const inFlight = this.getInFlight(hash);

    if (inFlight) {
      inFlight.retry = 0;
      inFlight.promises.forEach((p) => {
        p.resolve(response);
        p.onSuccess?.(response);
      });
    }
  }
}

const instance = new HttpClient();

export const fetch = instance.fetch;
export const abort = instance.abort;
export const getInFlight = instance.getInFlight;
export const getRequest = instance.getRequest;
export const wasAborted = HttpClient.wasAborted;
export const wasTimeout = HttpClient.wasTimeout;
