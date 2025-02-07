import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";
import { useRoute } from "../hooks";
import { resolve } from "../helpers/path";
import { joinRoutePaths } from "../helpers";

interface LinkProps extends BaseComponentProps {
  href: string;
}

/** Link
 *  Anchors. Supports relative paths.
 *
 * @param {string} href
 */
export function Link({ href, as = "a", ...rest }: LinkProps) {
  const { routeSegments, currentPath } = useRoute();
  const absHref = resolve(joinRoutePaths(routeSegments[0], currentPath, href));

  return <BaseComponent as={as} href={`#${absHref}`} {...rest} />;
}
