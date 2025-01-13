import React from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

/** Paragraph
 * Basic paragraph
 *
 * @returns ReactNode
 */
export function SubText({
  className = "",
  as = "p",
  ...rest
}: BaseComponentProps) {
  className = `text-sm opacity-80 ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
