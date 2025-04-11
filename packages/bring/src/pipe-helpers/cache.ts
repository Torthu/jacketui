import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** cache(cacheMode): BringInitDecorator
 *
 * Sets the cache mode for the request.
 * Possible values are "default", "no-store", "reload", "no-cache", "force-cache", and "only-if-cached".
 * The default value is "default".
 *
 * @example
 *   const customGet = (url: string) => pipe(cache("no-cache"), method("GET"), bring)({ url })
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 *
 * @param cacheMode - The cache mode to use for the request. "default", "no-store", "reload", "no-cache", "force-cache", and "only-if-cached"
 * @returns BringInitDecorator
 */
export const cache =
  (cacheMode: BringInit["cache"] = "default"): BringInitDecorator =>
  (init) => {
    init.cache = cacheMode;
    return init;
  };
