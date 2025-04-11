/** isPromise(value: unknown): value is Promise<unknown>
 *
 * Checks if a value is "promise-like", i.e an object with a .then() and a .catch() method.
 */
export const isPromise = (value: unknown): value is Promise<unknown> => {
  return (
    value instanceof Promise ||
    (typeof value === "object" &&
      value !== null &&
      "then" in value &&
      typeof value.then === "function" &&
      "catch" in value &&
      typeof value.catch === "function")
  );
};
