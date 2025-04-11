import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** shouldRetry((response: Response, retryNum: number) => boolean)): BringInitDecorator
 *
 * @param shouldRetry ((response: Response, retryNum: number) => boolean)
 * @returns BringInitDecorator
 */
export const shouldRetry =
  (shouldRetry: BringInit["shouldRetry"]): BringInitDecorator =>
  (init) => ({ ...init, shouldRetry });
