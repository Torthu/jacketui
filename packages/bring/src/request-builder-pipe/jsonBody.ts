import { BringInitDecorator } from "../types/BringDecorator";

/** jsonBody(body: any): BringInitDecorator
 *
 * Sets the body of the request to a JSON string.
 *
 * @param body Any JSON serializable value
 * @returns BringInitDecorator
 */
export const jsonBody =
  (body: any): BringInitDecorator =>
  (init) => ({ ...init, body: JSON.stringify(body) });
