import { useLayoutEffect } from "react";
import { createRouteRegex, getParameters, replace } from "../helpers";
import { useRoute } from "../hooks";
import { inject } from "regexparam";
import { resolve } from "../helpers/path";

export function Redirect({ path, ...rest }: { path: string } & object) {
  const { currentPath, routePath } = useRoute();

  const joinedPaths = resolve(routePath, path);

  useLayoutEffect(() => {
    const { pattern, keys } = createRouteRegex(routePath);
    const params = getParameters(currentPath, pattern, keys);

    replace(inject(joinedPaths, params));
  }, [joinedPaths, currentPath]);
  return <></>;
}
