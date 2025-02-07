import { cloneElement, Fragment, isValidElement, useContext } from "react";
import { RouterContext } from "../contexts";
import { createRouteRegex, joinRoutePaths, matchRoute } from "../helpers";
import { RouteProps } from "./Route";
import { useRoute } from "../hooks";

const flattenChildren = (
  children: React.ReactElement
): React.ReactElement[] => {
  if (Array.isArray(children)) {
    return children
      .flatMap((c: React.ReactElement) => {
        if (c.type === Fragment) {
          return flattenChildren(
            (c as React.ReactElement<{ children: React.ReactElement }>).props
              .children
          );
        } else {
          return flattenChildren(c);
        }
      })
      .filter((c): c is React.ReactElement => c !== undefined);
  } else {
    return [children];
  }
};

/** Switch
 *  Returns first matched Route
 *
 *  @example
 *   <Router>
 *     <Switch>
 *       <Route path="/path">Rendered when hash is #/path</Route>
 *       <Route path="/*?">Rendered when hash is #/anythingelse</Route>
 *     </Switch>
 *   </Route>
 *
 */
export const Switch = ({ children }: { children: React.ReactNode }) => {
  const { currentPath, routeSegments } = useRoute();

  for (const element of flattenChildren(children as React.ReactElement)) {
    const elementProps = element.props as RouteProps;

    const route = joinRoutePaths(...routeSegments, elementProps.path);

    if (
      isValidElement(element) &&
      matchRoute(createRouteRegex(route).pattern, currentPath)
    )
      return cloneElement(element);
  }

  return <></>;
};
