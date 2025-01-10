import React from "react";
import { BaseComponent, BaseComponentProps } from "@thune/jacketui-base";

const base =
  "rounded-full border-4 border-l-transparent border-r-transparent border-b-transparent border-t-current animate-[spin_0.5s_linear_infinite]";

const variants = {
  default: base + " w-6 h-6 ",
  sm: base + " w-6 h-6 ",
  md: base + " w-8 h-8 ",
  lg: base + " w-12 h-12 ",
  customSize: base,
};

/** Spinner
 * Spinning loader animation
 *
 * The spinner wraps <BaseComponent /> with a few class names.
 * To change colour use the text-* Tailwind util classes.
 *
 * @example Black spinner
 *   <Spinner className="text-black" />
 *
 * @example White spinner
 *   <Spinner className="text-white" />
 *
 * @note Remember to annotate the loading state for screen readers
 */
export function Spinner({
  className = "",
  as = "div",
  variant = "default",
  ...rest
}: BaseComponentProps<keyof typeof variants>) {
  const innerClassNames = variants[variant];
  return (
    <BaseComponent
      as={as}
      className={`${innerClassNames} ${className}`}
      {...rest}
    />
  );
}
