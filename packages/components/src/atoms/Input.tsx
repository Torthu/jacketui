import React, { RefObject, useLayoutEffect, useRef, useState } from "react";
import { BaseComponent, BaseComponentProps, As } from "@thune/jacketui-base";

export interface InputProps
  extends BaseComponentProps<keyof typeof variants, As<"input" | "textarea">> {
  value: string | number;
  type: string;
  ref?: RefObject<HTMLInputElement | undefined>;
  placeholder?: string;
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  autoComplete?: "on" | "off";
  spellCheck?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onFocus?: (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const variants = {
  default:
    "text-black dark:text-white hover:bg-opacity-40 dark:focus:text-black dark:active:text-black py-0 px-3 border border-gray-200 bg-white bg-opacity-30 focus:bg-opacity-100 rounded-l-lg text-left dark:border-0 min-w-14 max-w-48",
  minimal:
    "text-black dark:text-white hover:bg-opacity-40 dark:focus:text-black dark:active:text-black py-0 px-1 border border-gray-200 bg-white bg-opacity-30 focus:bg-opacity-100 rounded-l-xl text-center dark:border-0 min-w-14 max-w-48",
};

/** Input
 * Input element wrapper
 *
 * @param as ReactComponent | "input" | "textarea" (default: "input") Which DOM/React component to render as
 * @param inputMode (default: "text") [MDN inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
 *
 * @example
 *   const [val, setVal] = useState("someValue")
 *   <Input value={val} onChange={(e) => setVal(e.target.value)} />
 *
 * @returns ReactNode
 */
export default function Input({
  className = "",
  as = "input",
  variant = "default",
  value,
  ...rest
}: InputProps) {
  const innerClassNames = variants[variant];
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState<string>("0px");

  useLayoutEffect(() => {
    const padding = ["number"].includes(rest.type ?? "") ? 30 : 0;
    setW((hiddenRef.current?.offsetWidth ?? 0) + padding + "px");
  }, [value]);

  return (
    <>
      <div
        aria-hidden
        ref={hiddenRef}
        className={`px-4 absolute h-0 overflow-hidden whitespace-pre `}
      >
        {value}
      </div>
      <BaseComponent
        value={value}
        {...rest}
        style={{ width: w }}
        className={`${innerClassNames} ${className}`}
        as={as}
      />
    </>
  );
}
