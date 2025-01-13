import React from "react";
import { ReactElement } from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

const variants = {
  default: "text-black dark:text-white text-sm font-bold",
  inline: "",
};

interface LabelProps
  extends BaseComponentProps<keyof typeof variants, "label" | "span" | "div"> {
  htmlFor?: string;
}

/**
 * Requires a rewrite to fit with the other components
 * @param props
 * @returns
 */
export function Label({
  as = "label",
  className = "text-sm opacity-70",
  ...rest
}: LabelProps): ReactElement {
  return <BaseComponent className={className} as={as} {...rest} />;
}
