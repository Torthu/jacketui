import { createContext } from "react";

/**
 * currentPath {string} the current browser history path (e.g /some/route/path)
 * routePath {string} the matched route's path (e.g /some/:route/:path)
 * routeProps {object} the matched route props (e.g {route: "route", path: "path"})
 */
export const CurrentRouteContext = createContext<{
  currentPath: string;
  routePath: string;
  routeProps: unknown;
}>({ currentPath: "", routePath: "", routeProps: {} });
