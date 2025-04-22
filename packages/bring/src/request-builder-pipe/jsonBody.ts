import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** jsonBody(body: BringInit["body"]): BringInitDecorator
 *
 * Sets the body of the request to a JSON string.
 *
 * @param body Any JSON serializable value
 * @returns BringInitDecorator
 */
export const jsonBody =
  (body: BringInit["body"]): BringInitDecorator =>
  (init) => ({ ...init, body: JSON.stringify(body) });
