import React from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

/** H1
 * Main header - text-2xl font-extralight
 *
 * @param as string | ReactComponent (default: "h1") Which DOM/React component to render as
 *
 * @example
 *   <H1 as="h2">h2 with h1 styling</H1>
 *
 * @returns ReactNode
 */
export function H1({ className = "", as = "h1", ...rest }: BaseComponentProps) {
  className = `text-2xl lg:text-4xl w-full print:text-lg ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
