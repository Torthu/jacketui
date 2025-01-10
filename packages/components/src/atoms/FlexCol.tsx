import React from "react";
import { BaseComponent, BaseComponentProps } from "@thune/jacketui-base";

const base = "flex flex-col";

const variants = {
  default: `${base}`,
  main: `${base} box-border md:w-2/5 grow`,
  aside: `${base} box-border md:max-w-2/5 shrink`,
  tight: `${base} gap-2`,
  relaxed: `${base} gap-4`,
  loose: `${base} gap-8`,
};

/** FlexCol
 * Flexbox column
 *
 * @param as {string | ReactComponent} (default: a) what DOM element or React component to render as
 * @param variant {string} (default: default) Variants: default | main | aside
 *
 * @example
 *   <FlexCol variant="main">I'm a flexbox column</FlexCol>
 *
 * @returns ReactNode
 */
export function FlexCol({
  className = "",
  as = "div",
  variant = "default",
  ...rest
}: BaseComponentProps<keyof typeof variants>) {
  const variantClasses = variants[variant] ?? variants["default"];

  className = `${variantClasses} ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
