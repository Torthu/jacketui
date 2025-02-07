import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";
import { Fragment, useMemo } from "react";
import { RouteContext } from "../contexts";
import {
  matchRoute,
  joinRoutePaths,
  createRouteRegex,
  getParameters,
} from "../helpers";
import { useRoute } from "../hooks";

export interface RouteProps extends BaseComponentProps {
  path: string;
  [key: string]: unknown;
}

/** Route
 *  Wrapper for a single route within a Router context.
 *  If Route as={Component} syntax is used, the component will be called with routeProps (e.g /path/:id/:subid => {id: string, subid: string}).
 *  A matched route's routeProps are also available with the useRoute() hook.
 *
 *  @param {string} path The full path to this route
 *
 *  @return {ReactNode | null}
 *
 *  @example
 *   <Router>
 *     <Route path="/:somepathprop" as={({somepathprop}) => <>Hello, {somepathprop}</> />} />
 *   </Router>
 */
export const Route = ({ path, as = Fragment, ...rest }: RouteProps) => {
  const { rootPath, currentPath, routeSegments } = useRoute();

  // outermost route
  const segments = useMemo(
    () => [...routeSegments, path],
    [routeSegments, path]
  );

  const routePath = useMemo(() => joinRoutePaths(...segments), [segments]);

  const { pattern, keys } = useMemo(
    () => createRouteRegex(routePath, false),
    [routePath]
  );

  const routeMatched = useMemo(
    () => matchRoute(pattern, currentPath),
    [pattern, currentPath]
  );

  const routeProps = useMemo(
    () => (routeMatched ? getParameters(currentPath, pattern, keys) : null),
    [pattern, keys, routeMatched]
  );

  const RouteComponent = useMemo(() => {
    if (routeMatched) {
      return (props: BaseComponentProps) => (
        <BaseComponent as={as} {...routeProps} {...props} />
      );
    }
    return null;
  }, [routeMatched, routeProps, as]);

  if (RouteComponent) {
    return (
      <RouteContext.Provider
        value={{
          rootPath,
          routeProps,
          currentPath,
          routePath,
          routeSegments: segments,
        }}
      >
        <RouteComponent {...rest} />
      </RouteContext.Provider>
    );
  }

  return <></>;
};
