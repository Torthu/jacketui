import { parse } from "regexparam";

/** createRouteRegex
 *
 * @param {string} route
 * @param {boolean} nested
 * @returns {pattern: RegExp, keys: string[]}
 */
export const createRouteRegex = (
  route: string,
  nested = false
): { pattern: RegExp; keys: string[] } => {
  return parse(route, nested);
};
