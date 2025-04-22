import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** body(body): BringInitDecorator
 *
 * Sets the body of the request.
 *
 * @note This is a low-level helper. For JSON bodies, use `jsonBody` instead or manually JSON.stringify first.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body
 *
 * @param body
 * @returns BringInitDecorator
 */
export const body =
  (body: BringInit["body"]): BringInitDecorator =>
  (init) => ({ ...init, body });
