import { memo, useEffect, useState } from "react";
import { getHashPath } from "./routeUtilts";

import { RouterContext } from "./RouteContext";

export interface RouterProps {
  children: React.ReactNode;
  path?: string;
}

/** Router
 *  Simple router implementation using # urls.
 *  The router listens to hashchange events and updates the RouterContext with currentPath.
 *
 * @example
 *  <Router>
 *    <Route path="/">Hello</Route>
 *  </Router>
 */
export const Router = memo(
  ({ children, path = "" }: RouterProps): React.ReactElement => {
    const [currentPath, setCurrentPath] = useState(getHashPath(location));

    useEffect(() => {
      const hashchange = (event: HashChangeEvent): void => {
        if (event.newURL !== event.oldURL) {
          setCurrentPath(getHashPath(window.location));
        }
      };
      window.addEventListener("hashchange", hashchange);
      return () => window.removeEventListener("hashchange", hashchange);
    }, []);

    return (
      <RouterContext.Provider value={{ currentPath, rootPath: path }}>
        {children}
      </RouterContext.Provider>
    );
  }
);
