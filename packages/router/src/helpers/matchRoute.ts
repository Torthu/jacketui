import { createRouteRegex } from "./createRouteRegex";

/** matchRoute(routePath, path)
 *
 * @param {string | RegExp} routePath - The route path to match against. E.g /some/:projectId/:taskId
 * @param {string} path - The current path to match. E.g /some/123/456
 * @returns {boolean} - Returns true if the path matches the route path. Otherwise false.
 *
 * @example
 *   matchRoute("/some/:projectId/:taskId", "/some/123/456") // true
 *   matchRoute("/some/:projectId/:taskId", "/some/123") // false
 *
 */
export const matchRoute = (routePath: string | RegExp, path: string) => {
  const pattern: RegExp =
    typeof routePath === "string"
      ? createRouteRegex(routePath).pattern
      : routePath;
  return pattern.test(path);
};
