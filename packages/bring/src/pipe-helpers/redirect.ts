import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** redirect(string): BringInitDecorator
 *
 * Sets the redirect mode of the request.
 *
 * Possible values are:
 * - "follow": Automatically follow redirects. This is the default value.
 * - "error": Abort with an error if a redirect occurs.
 * - "manual": Handle redirects manually.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect
 *
 * @param redirectMode - The redirect mode to use. "follow" | "error" | "manual". Defaults to "follow".
 * @returns BringIntDecorator
 */
export const redirect =
  (redirectMode: BringInit["redirect"] = "follow"): BringInitDecorator =>
  (init) => {
    init.redirect = redirectMode;
    return init;
  };
