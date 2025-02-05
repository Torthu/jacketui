import { Fragment, memo, useContext, useMemo } from "react";
import { CurrentRouteContext, RouterContext } from ".";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";
import { matchRoute } from "./matchRoute";
import { joinRoutePaths } from "./joinRoutePath";

interface RouteProps extends BaseComponentProps {
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
export const Route = memo(({ path, as = Fragment, ...rest }: RouteProps) => {
  const { currentPath } = useContext(RouterContext);
  const { routePath } = useContext(CurrentRouteContext);

  const joinedPaths = useMemo(
    () => joinRoutePaths(routePath, path),
    [routePath, path]
  );

  const [routeMatched, routeProps = {}, basePath] = useMemo(
    () => matchRoute(joinedPaths, currentPath, { loose: false }),
    [joinedPaths, currentPath]
  );

  if (routeMatched) {
    console.log("matched", {
      routePath,
      path,
      routeProps,
      joinedPaths,
      basePath,
    });
  } else {
    console.log("!matched", {
      routePath,
      path,
      routeProps,
      joinedPaths,
      basePath,
    });
  }

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
      <CurrentRouteContext.Provider
        value={{ routeProps, currentPath, routePath: joinedPaths }}
      >
        <RouteComponent {...rest} />
      </CurrentRouteContext.Provider>
    );
  }

  return null;
});
