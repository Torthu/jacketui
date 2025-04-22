import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** referrerPolicy(string): BringInitDecorator
 *
 * A string specifying the value of the referrer-policy header to use for the request.
 *
 * Possible values are:
 * - "no-referrer" The Referer header will not be sent.
 * - "no-referrer-when-downgrade" Send the origin, path, and query string in Referer when the protocol security level stays the same or improves
 * - "origin" Send only the origin in the Referer header. For example, a document at https://example.com/page.html will send the referrer https://example.com/.
 * - "origin-when-cross-origin" When performing a same-origin request to the same protocol level (HTTP→HTTP, HTTPS→HTTPS), send the origin, path, and query string. Send only the origin for cross origin requests and requests to less secure destinations (HTTPS→HTTP).
 * - "same-origin" Send the origin, path, and query string for same-origin requests. Don't send the Referer header for cross-origin requests.
 * - "strict-origin" Send only the origin when the protocol security level stays the same (HTTPS→HTTPS). Don't send the Referer header to less secure destinations (HTTPS→HTTP).
 * - "strict-origin-when-cross-origin" (default) Send the origin, path, and query string when performing a same-origin request. For cross-origin requests send the origin (only) when the protocol security level stays same (HTTPS→HTTPS). Don't send the Referer header to less secure destinations (HTTPS→HTTP).
 * - "unsafe-url" Send the origin, path, and query string when performing any request, regardless of security.
 *
 * Default is "strict-origin-when-cross-origin"
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrerpolicy
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
 *
 * @param referrerPolicyMode
 * @returns BringInitDecorator
 */
export const referrerPolicy =
  (
    referrerPolicyMode: BringInit["referrerPolicy"] = "strict-origin-when-cross-origin"
  ): BringInitDecorator =>
  (init) => {
    init.referrerPolicy = referrerPolicyMode;
    return init;
  };
