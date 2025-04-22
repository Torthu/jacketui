import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** url(string | URL): BringInitDecorator
 *
 * Sets the URL of the request
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/url
 *
 * @param url - URL to request.
 * @returns BringDecorator
 */
export const url =
  (url: BringInit["url"]): BringInitDecorator =>
  (init) => ({
    ...init,
    url,
  });
