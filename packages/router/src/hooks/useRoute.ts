import { useContext } from "react";
import { RouteContext } from "../contexts/RouteContext";

/** **useRoute()**
 *
 * Returns the current route context.
 *
 * Must be used within a <Router>.
 *
 * **RouteContext**
 *
 * The RouteContext is an object with the following properties:
 *  - rootPath: string; // the root path of the router (usually "/")
 *  - currentPath: string; // the current browser history path (e.g /some/route/path)
 *  - routePath: string; // the matched route's path (e.g /some/:route/:path)
 *  - routeProps: unknown; // the matched route props (e.g {route: "route", path: "path"})
 *  - routeSegments: string[]; // array of matched routes (i.e the "route" path from root to here)
 *
 * @returns {RouteContext}
 */
export const useRoute = () => useContext(RouteContext);
