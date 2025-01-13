import React, { ReactElement } from "react";
import { OptionItem } from "../../types";
import { BaseComponentProps } from "@torthu/jacketui-base";

interface SelectProps
  extends Omit<BaseComponentProps<keyof typeof variants, "select">, "value"> {
  id: string;
  options: OptionItem[];
  title?: string;
  value?: OptionItem | string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const base =
  "text-gray-500 dark:text-gray-200 p-2 pr-4 bg-black dark:bg-white dark:bg-opacity-5 dark:hover:bg-opacity-10 bg-opacity-5 cursor-pointer hover:bg-opacity-10";

const variants = {
  default: base,
  pill: base + " rounded-full",
  "rounded-r": base + " rounded-r-lg",
  "rounded-l": base + " rounded-l-lg",
  rounded: base + " rounded-lg",
};

/** Select
 * Dropdown component
 *
 * @example
 *  <Select id="number-select" options={[{label: "One", value: 1, label: "Two", value: 2}]} onChange={console.log} />
 */
export function Select({
  id,
  options,
  value,
  className = "",
  variant = "default",
  ...rest
}: SelectProps): ReactElement {
  className = `${variants[variant]} ${className}`;
  const innerValue =
    typeof value === "string"
      ? value
      : value?.value
      ? `${value.value}`
      : undefined;

  return (
    <>
      <select id={id} value={innerValue} className={className} {...rest}>
        {options.map((option: OptionItem, index) => (
          <option
            key={`${id}-${option.value}`}
            value={option.value}
            title={option.alt}
            data-index={index}
          >
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
