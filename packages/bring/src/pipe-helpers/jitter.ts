import { JitterOptions, randomJitter } from "../helpers/randomJitter";
import { BringInitDecorator } from "../types/BringDecorator";

/** jitter(options?: JitterOptions): BringInitDecorator
 *
 * Sets a jitter function for retrying requests.
 * Jitter is a random value added to the backoff time to prevent a thundering herd problem (when multiple clients retry at the same time).
 *
 * @param options (optional) Jitter options
 * @param options.max (default 100) Maximum jitter time in milliseconds
 * @param options.min (default 0) Minimum jitter time in milliseconds
 * @returns BringInitDecorator
 */
export const jitter = (options?: JitterOptions): BringInitDecorator => {
  const jitterFun = () => randomJitter(options);
  return (init) => ({ ...init, backoff: jitterFun });
};
