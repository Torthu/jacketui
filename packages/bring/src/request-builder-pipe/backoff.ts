import {
  BackoffOptions,
  exponentialBackoff,
} from "../helpers/exponentialBackoff";
import { BringInitDecorator } from "../types/BringDecorator";

/** backoff(options?: BackoffOptions): BringInitDecorator
 *
 * Sets a exponential backoff function for retrying requests.
 *
 * @param options (optional) Backoff options
 * @param options.base Base backoff time in milliseconds
 * @param options.factor Multiplier for the backoff time
 * @param options.max Maximum backoff time in milliseconds
 * @param options.min Minimum backoff time in milliseconds
 * @returns BringInitDecorator
 */
export const backoff = (options?: BackoffOptions): BringInitDecorator => {
  const backoffFun = (retryNum: number) =>
    exponentialBackoff(retryNum, options);
  return (init) => ({ ...init, backoff: backoffFun });
};
