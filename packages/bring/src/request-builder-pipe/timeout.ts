import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** timeout(number): BringInitDecorator
 *
 * Sets in-flight timeout for request.
 * Used to configure AbortSignal.timeout().
 *
 * If retry is set, timeout will be applied to each retry.
 * Total time for request will be (timeout + jitter + backoff) * retry.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
 *
 * @param timeout The time to wait before aborting the request.
 * @returns BringInitDecorator
 */
export const timeout =
  (timeout: BringInit["timeout"]): BringInitDecorator =>
  (init) => ({ ...init, timeout });
