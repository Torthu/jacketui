import { bring } from "./bring";
import { BringInit } from "./types/BringInit";

/** fetch(url: string, init?: Omit<BringInit, "url">): AbortablePromise<Result<Response, BringError>>
 *
 * Wraps bring in a fetch-like API.
 * This is a convenience function for bring.
 *
 * Some caveats:
 * - BringInit expects and AbortController instead of a signal.
 * - The first argument cannot be a Request object.
 *
 * @note This is not a drop-in replacement for the Fetch API.
 *
 * @note bring does not throw errors, but will return a Result.
 *
 * @example
 *   const result = await fetch("https://example.com", { method: "GET" });
 *   if (result.ok) {
 *     const data = await result.value.json();
 *     console.log(data);
 *   } else {
 *     console.error(result.error);
 *   }
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 *
 * @param url string | URL - The URL to fetch.
 * @param init BringInit - extends RequestInit from the Fetch API.
 * @returns AbortablePromise<Result<Response, BringError>> - A promise that resolves to a Result object containing either a Response or a BringError.
 */
export const fetch = (url: string | URL, init?: Omit<BringInit, "url">) => {
  return bring({ url, ...init });
};
