import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** method(string): BringInitDecorator
 *
 * Sets the HTTP method of the request.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/method
 *
 * @param method - The HTTP method to use for the request.
 * @returns BringDecorator
 */
export const method =
  (method: BringInit["method"] = "GET"): BringInitDecorator =>
  (init) => ({
    ...init,
    method,
  });
