import React from "react";
import { BaseComponent, BaseComponentProps, As } from "@thune/jacketui-base";
const base = "px-2 py-0 rounded-full ";

const variants = {
  default: base + "border bg-gray-500 border-gray-400 text-white",
  info: base + "bg-blue-500",
  rrule: "px-1 rounded-full text-gray-500 border border-gray-500",
};

export type PillProps = BaseComponentProps<keyof typeof variants, As>;

/** Button
 *
 * @param as {string | ReactComponent} (default: button) what DOM element or React component to render as
 * @param variant {string} (default: default) Variants: default | submit
 *
 * @example
 *   <Button variant="submit" as="a">I'm a link disguised as a submit button!</Button>
 *
 * @returns ReactNode
 */
export function Pill({
  className = "",
  as = "div",
  variant = "default",
  ...rest
}: PillProps) {
  const variantClasses = variants[variant] ?? variants["default"];

  className = `${variantClasses} ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
