import { createContext } from "react";

/**
 * currentPath {string} the current browser history path (e.g /some/route/path)
 * routePath {string} the matched route's path (e.g /some/:route/:path)
 * routeProps {object} the matched route props (e.g {route: "route", path: "path"})
 * routeSegments {string[]} array of matched routes (i.e the "route" path from root to here)
 */
export const RouteContext = createContext<{
  currentPath: string;
  rootPath: string;
  routePath: string;
  routeProps: unknown;
  routeSegments: string[];
}>({
  rootPath: "",
  currentPath: "",
  routePath: "",
  routeProps: {},
  routeSegments: [],
});
