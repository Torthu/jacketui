import React from "react";
import { BaseComponent, BaseComponentProps } from "@thune/jacketui-base";

/** Paragraph
 * Basic paragraph
 *
 * @returns ReactNode
 */
export function Textarea({
  className = "",
  as = "textarea",
  ...rest
}: BaseComponentProps) {
  className = `box-border block h-lg min-w-lg w-full rounded bg-white text-gray-900 border-gray-900 p-2 dark:bg-slate-700 dark:text-white ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
