import { BringInitDecorator } from "../types/BringDecorator";

/** header(key: string, val: string): BringInitDecorator
 *
 * Sets a header on the request.
 * If the header already exists, it will be overwritten.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
 *
 * @param key The name of the header to set.
 * @param val The value of the header to set.
 * @returns BringDecorator
 */
export const header = (key: string, val: string): BringInitDecorator => {
  return (init) => {
    init.headers ??= new Headers();

    if (init.headers instanceof Headers) {
      !init.headers.has(key)
        ? init.headers.append(key, val)
        : init.headers.set(key, val);
    } else {
      init.headers[key] = val;
    }

    return init;
  };
};
