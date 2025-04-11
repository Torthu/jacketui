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
export const withResolvers = (
  signal?: AbortSignal
): {
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

  const handleAbort = (ev: Event) => {
    reject(new DOMException("Aborted", "AbortError"));
  };

  const cleanup = () => {
    signal?.removeEventListener("abort", handleAbort);
  };

  signal?.addEventListener("abort", handleAbort);

  const res = (response: unknown) => {
    cleanup();
    resolve(response);
  };
  const rej = (reason?: any) => {
    cleanup();
    reject(reason);
  };

  return { promise, resolve: res, reject: rej };
};
