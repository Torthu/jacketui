export interface BackoffOptions {
  base?: number;
  factor?: number;
  max?: number;
  min?: number;
}

/** backoff(retryNum: number): number
 *
 * Backoff is the time to wait before retrying a request. It is calculated using an exponential backoff algorithm.
 *
 *  The formula is: base * factor^(retryNum - 1)
 *
 * @param retryNum The number of times the request has been retried
 * @param options
 * @param options.base Base backoff time in milliseconds
 * @param options.factor Multiplier for the backoff time
 * @param options.max Maximum backoff time in milliseconds
 * @param options.min Minimum backoff time in milliseconds
 * @returns number
 */
export const exponentialBackoff = (
  retryNum: number,
  { base = 500, factor = 1.5, max = 10000, min = 500 }: BackoffOptions = {}
): number => {
  const calculatedBackoff = base * Math.pow(factor, retryNum - 1);
  return Math.min(Math.max(calculatedBackoff, min), max);
};
