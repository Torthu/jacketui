import React, { ChangeEvent } from "react";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

interface FileInputProps
  extends Omit<BaseComponentProps<keyof typeof variants>, "as"> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  multiple?: boolean;
}

const base =
  "file:border-0 file:bg-transparent file:active:bg-gray-400 file:hover:bg-gray-600 file:hover:cursor-pointer file:border-r file:border-gray-400 file:text-white file:px-2 file:py-1 file:h-full file:mr-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400";

const variants = {
  default: `${base}`,
  main: `${base} box-border md:w-2/5 grow`,
  aside: `${base} box-border md:max-w-2/5 shrink`,
  tight: `${base} gap-2`,
  relaxed: `${base} gap-4`,
  loose: `${base} gap-8`,
};

/** FileInput
 *
 * @param variant {string} (default: default) Variants: default | main | aside
 * @param onChange {(e) => void} Handles changes
 * @param accept {string} File types the file input accepts
 * @param multiple {boolean} Accept multiple files
 *
 * @example
 *   <FileInput />
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
 *
 * @returns ReactNode
 */
export default function FileInput({
  className = "",
  variant = "default",
  ...rest
}: FileInputProps) {
  const variantClasses = variants[variant] ?? variants["default"];

  className = `${variantClasses} ${className}`;

  return (
    <BaseComponent {...rest} className={className} as="input" type="file" />
  );
}
