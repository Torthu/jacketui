import { normalize } from "./path";

/** joinRoutePaths
 * Join paths in order to match subroutes
 *
 *  @param {string} root
 *  @param {string} path
 *  @return {string} joined
 */
export const joinRoutePaths = (...segments: string[]) => {
  const root = segments.shift();

  const joinedRoute = segments.reduce((path, segment) => {
    if (segment[0] === "~") {
      return segment.slice(1);
    }

    if (path.slice(-1) === "*") {
      path = path.slice(0, path.length - 1);
    }

    if (path.slice(-2) === "*?") {
      path = path.slice(0, path.length - 2);
    }

    return path + "/" + segment;
  }, "");

  return normalize(root + joinedRoute);
};
