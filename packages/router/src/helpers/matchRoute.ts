import { createRouteRegex } from "./createRouteRegex";

/** matchRoute
 *
 * @param {string | RegExp} routePath
 * @param {string} path
 * @returns
 */
export const matchRoute = (routePath: string | RegExp, path: string) => {
  const pattern: RegExp =
    typeof routePath === "string"
      ? createRouteRegex(routePath).pattern
      : routePath;
  return pattern.test(path);
};
