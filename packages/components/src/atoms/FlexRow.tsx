import React from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

const base = "flex flex-row";

const variants = {
  default: `${base}`,
  wrap: `${base} w-full flex-wrap`,
  wrapReverse: `${base} w-full flex-wrap-reverse`,
  loose: `${base} gap-8`,
  relaxed: `${base} gap-4`,
  tight: `${base} gap-2`,
};

/** FlexRow
 * Flexbox row
 *
 * @param as {string | ReactComponent} (default: a) what DOM element or React component to render as
 * @param variant {string} (default: default) Variants: default
 *
 * @example
 *   <FlexRow variant="default">I'm a flexbox row</FlexRow>
 *
 * @returns ReactNode
 */
export function FlexRow({
  className = "",
  as = "div",
  variant = "default",
  ...rest
}: BaseComponentProps<keyof typeof variants>) {
  const variantClasses = variants[variant] ?? variants["default"];

  className = `${variantClasses} ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
