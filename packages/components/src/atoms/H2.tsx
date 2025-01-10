import React from "react";
import { BaseComponent, BaseComponentProps } from "@thune/jacketui-base";

/** H2
 * subheader - text-xl font-extralight
 *
 * @param as string | ReactComponent (default: "h1") Which DOM/React component to render as
 *
 * @example
 *   <H2 as="h1">h1 with h2 styling</H1>
 *
 * @returns ReactNode
 */
export function H2({ className = "", as = "h2", ...rest }: BaseComponentProps) {
  className = `text-xl font-light dark:font-extralight print:font-normal print:text-md ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
