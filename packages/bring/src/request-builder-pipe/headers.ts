import { BringInitDecorator } from "../types/BringDecorator";

/** headers(Record<string, string> | Headers): BringInitDecorator
 *
 * Sets multiple headers on the request
 * If a header already exists, it will be overwritten.
 * If a header does not exist, it will be appended.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
 *
 * @param headers A record of headers to set or a Headers object.
 * @returns BringDecorator
 */
export const headers = (
  headers: Record<string, string> | Headers
): BringInitDecorator => {
  return (init) => {
    init.headers ??= new Headers();

    if (init.headers instanceof Headers) {
      for (const [key, val] of Object.entries(headers)) {
        !init.headers.has(key)
          ? init.headers.append(key, val)
          : init.headers.set(key, val);
      }
    } else {
      for (const [key, val] of Object.entries(headers)) {
        init.headers[key] = val;
      }
    }

    return init;
  };
};
