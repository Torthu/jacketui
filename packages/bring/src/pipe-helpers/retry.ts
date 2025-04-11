import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** retry(number): BringInitDecorator
 *
 * Sets the number of times to retry the request.
 *
 * @param retry The number of times to retry the request.
 * @returns BringInitDecorator
 */
export const retry =
  (retry: BringInit["retry"]): BringInitDecorator =>
  (init) => ({ ...init, retry });
