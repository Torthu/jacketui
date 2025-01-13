import React from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";
import { FlexRow } from ".";

const base = "gap-2 p-2";

const variants = {
  default: base + " border border-gray-600 rounded-md",
  spread: base + " border border-gray-600 rounded-md justify-between",
  dialog: " pt-4 mt-4 border-t border-gray-600 justify-between",
};

/** Button
 *
 * @param as {string | ReactComponent} (default: button) what DOM element or React component to render as
 * @param variant {string} (default: default) Variants: default | submit
 *
 * @example
 *   <ButtonGroup><Button>Button A</Button><Button>Button B</Button></ButtonGroup>
 *
 * @returns ReactNode
 */
export function ButtonGroup({
  className = "",
  as = FlexRow,
  variant = "default",
  ...rest
}: BaseComponentProps<keyof typeof variants>) {
  const variantClasses = variants[variant] ?? variants["default"];

  className = `${variantClasses} ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
