import type { Fn } from "../types/Fn";

interface MemoCacheOptions<T extends Fn> {
  limit?: number;
  cacheKeyGen?: (...args: Parameters<T>) => string;
}

const defaultCacheKeyGen = JSON.stringify as (...args: unknown[]) => string;

/** memo(fun, { limit: 100, key: (a, b) => `${a}-${b}` }
 *
 * memoize a function with a limit of cache size
 *
 * @param fun the function to memoize
 * @param options (optional) memo cache options
 * @param options.limit (default: -1) the number of argument permutations to remember, -1 for no limit
 * @param options.cacheKeyGen (default: JSON.stringify) the function to generate cache key
 */
export const memo = <T extends Fn>(
  fun: T,
  { cacheKeyGen = defaultCacheKeyGen, limit = -1 }: MemoCacheOptions<T> = {}
): T & {
  cache: Map<string, ReturnType<T>>;
} => {
  const cache = new Map<string, ReturnType<T>>();

  return Object.assign(
    (...args: Parameters<T>) => {
      const cacheKey = cacheKeyGen(...args);

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      if (limit > 0 && cache.size > limit) {
        for (let i = 0; i < cache.size - limit + 1; i++) {
          const key = cache.keys().next().value;

          if (key) {
            cache.delete(key);
          }
        }
      }

      const result = fun(...args);
      cache.set(cacheKey, result);
      return result;
    },
    {
      cache,
    }
  ) as any;
};
