import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** credentials(credentialsMode): BringInitDecorator
 *
 * Sets the credentials mode for the request.
 *
 * Credentials are cookies, TLS client certificates, or authentication headers containing a username and password.
 *
 * Possible values are:
 * - "omit": Never send cookies.
 * - "same-origin": Send cookies only if the URL is on the same origin as the calling script. This is the default value.
 * - "include": Always send cookies, even for cross-origin calls.
 *
 * The default value is "same-origin".
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials
 *
 * @example
 *   const customGet = (url: string) => pipe(credentials("include"), method("GET"), bring)({ url })
 *
 * @param credentialsMode
 * @returns
 */
export const credentials =
  (
    credentialsMode: BringInit["credentials"] = "same-origin"
  ): BringInitDecorator =>
  (init) => {
    init.credentials = credentialsMode;
    return init;
  };
