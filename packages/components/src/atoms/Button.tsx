import React from "react";
import { BaseComponent, BaseComponentProps } from "@thune/jacketui-base";

export const variants = {
  default: "",
  submit:
    "rounded bg-blue-600 px-2 py-1 font-medium text-white hover:bg-blue-700",
  message:
    "rounded bg-gray-800 px-2 text-center py-1 font-medium text-gray-100 bg-opacity-60 hover:bg-opacity-80",
  "message-delete":
    "rounded px-2 text-center py-1 font-medium text-gray-100 flex flex-row items-center gap-2 rounded-md bg-red-800 bg-opacity-60 hover:bg-opacity-80",
  icon: "rounded-full bg-gray-600 p-1 text-white hover:bg-gray-400 hover:text-black focus:bg-gray-400 focus:text-black active:bg-gray-300 active:text-black",
  iconBorder:
    "rounded-full bg-transparent border border-gray-400 p-1 text-white hover:bg-gray-400 hover:text-black focus:bg-gray-400 focus:text-black active:bg-gray-300 active:text-black",
  "icon-delete":
    "rounded-full p-1 text-white bg-red-800 bg-opacity-40 hover:bg-opacity-60 active:bg-opacity-100 focus:border-opacity-60",
  disabled:
    "rounded bg-gray-600 px-2 py-1 font-medium text-white hover:bg-gray-700",
  pill: "px-4 py-1 rounded-full border bg-white bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-40 border-gray-400  hover:cursor-pointer",
  info: "flex-0 w-5 h-5 text-xs text-white border border-white opacity-70 hover:opacity-100 hover:text-white hover:opacity-100 rounded-full",
};

export interface ButtonProps
  extends BaseComponentProps<
    keyof typeof variants,
    "button" | React.ComponentType<React.ComponentProps<"button">>
  > {}

/** Button
 *
 * @param as (default: button) what DOM element or React component to render as
 * @param variant {string} (default: default) Variants: default | submit
 *
 * @example
 *   <Button variant="submit" as="a">I'm a link disguised as a submit button!</Button>
 *
 * @returns ReactNode
 */
export function Button({
  className = "",
  as = "button",
  variant = "default",
  ...rest
}: ButtonProps) {
  const variantClasses = variants[variant] ?? variants["default"];

  className = `${variantClasses} ${className}`;

  return <BaseComponent {...rest} className={className} as={as} />;
}
