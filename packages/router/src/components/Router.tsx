import { useEffect, useMemo, useState } from "react";
import { getHashPath } from "../helpers";
import { RouteContext } from "../contexts";

export interface RouterProps {
  children: React.ReactNode;
  path?: string;
}

/** **Router**
 *
 * Simple router implementation using # urls.
 * The router listens to hashchange events and updates the RouteContext with currentPath.
 *
 * @param {string} path The root path of the router. Defaults to "/".
 *
 * @example
 *  <Router>
 *    <Route path="/">Hello</Route>
 *  </Router>
 */
export const Router = ({
  children,
  path = "",
}: RouterProps): React.ReactElement => {
  const [currentPath, setCurrentPath] = useState(
    getHashPath(globalThis.location ?? "")
  );
  const routeSegments = useMemo(() => [path], [path]);

  useEffect(() => {
    const hashchange = (event: HashChangeEvent): void => {
      if (event.newURL !== event.oldURL) {
        setCurrentPath(getHashPath(globalThis.location));
      }
    };
    globalThis.addEventListener("hashchange", hashchange);
    return () => globalThis.removeEventListener("hashchange", hashchange);
  }, []);

  return (
    <RouteContext.Provider
      value={{
        currentPath,
        rootPath: path,
        routePath: "/",
        routeSegments,
        routeProps: {},
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
