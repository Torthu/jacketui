import React from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

/** Tooltip
 *
 * @returns ReactNode
 */
export default function Tooltip({
  className = "absolute z-10 bottom-full mb-2 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700",
  as = "div",
  ...rest
}: BaseComponentProps) {
  className = ` ${className}`;

  return (
    <BaseComponent role="tooltip" {...rest} className={className} as={as} />
  );
}
