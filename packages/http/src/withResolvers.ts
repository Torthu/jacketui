/** withResolvers()
 *  Same as Promise.withResolvers().
 *  Returns an object with {promise, resolve, reject}.
 *
 * @todo Replace when standard is available everywhere.
 *
 * @returns {
 *   promise: Promise<unknown>;
 *   resolve: (response: unknown) => void;
 *   reject: (reason?: any) => void;
 * }
 */
export const withResolvers = (): {
  promise: Promise<unknown>;
  resolve: (response: unknown) => void;
  reject: (reason?: any) => void;
} => {
  let resolve!: (response: unknown) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};
