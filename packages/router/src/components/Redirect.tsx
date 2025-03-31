import { useEffect } from "react";
import { createRouteRegex, getParameters, replace } from "../helpers";
import { useRoute } from "../hooks";
import { inject } from "regexparam";
import { resolve } from "../helpers/path";

/** **Redirect**
 *
 * Redirect to a different path.
 *
 * @param {string} path The path to redirect to.
 *
 * @example Redirect from a Route to another
 *   <Route path="/old-path">
 *    <Redirect path="/new-path" />
 *  </Route>
 */
export function Redirect({ path }: { path: string } & object) {
  const { currentPath, routePath } = useRoute();

  const joinedPaths =
    path[0] === "~" ? path.slice(1) : resolve(routePath, path);

  useEffect(() => {
    const { pattern, keys } = createRouteRegex(routePath);
    const params = getParameters(currentPath, pattern, keys);
    const timeout = setTimeout(() => replace(inject(joinedPaths, params)), 0);

    return () => clearTimeout(timeout);
  }, [joinedPaths, currentPath]);
  return <></>;
}
