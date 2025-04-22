import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** referrer(string): BringInitDecorator
 *
 * A string specifying the value to use for the request's Referer header. One of the following:
 * - A same-origin relative or absolute URL
 * - An empty string, which indicates that no Referer header should be sent
 * - "about:client" (default) set the Referer header to the default value for the context of the request (for example, the URL of the page that made the request).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer
 *
 * @param referrerMode
 * @returns
 */
export const referrer =
  (referrerMode: BringInit["referrer"] = "about:client"): BringInitDecorator =>
  (init) => {
    init.referrer = referrerMode;
    return init;
  };
