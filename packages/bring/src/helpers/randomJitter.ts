export interface JitterOptions {
  min?: number;
  max?: number;
}

/** jitter(backoff: number): number
 *
 *  Jitter is a random value added to the backoff time to prevent a thundering herd problem (when multiple clients retry at the same time).
 *
 * @param backoff The backoff time in milliseconds
 * @param options
 * @param options.min (default 0) Minimum jitter time in milliseconds
 * @param options.max (default 100) Maximum jitter time in milliseconds
 * @returns number
 */
export const randomJitter = ({
  min = 0,
  max = 100,
}: JitterOptions = {}): number => {
  const jitter = Math.random() * max;
  return jitter < min ? min : jitter;
};
