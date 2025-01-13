import { BaseComponentProps } from "@torthu/jacketui-base";
import { ChangeEvent, ReactElement } from "react";
import { OptionItem } from "../../types";
import { Label, Select } from "../atoms";

interface DropdownProps
  extends Omit<
    BaseComponentProps<keyof typeof variants>,
    "value" | "children"
  > {
  value?: OptionItem | string;
  options: OptionItem[];
  id: string;
  label?: string;
  className?: string;
  hideLabel?: boolean;
  onChange: (newValue?: OptionItem) => void;
  minimal?: boolean;
}

const variants = {
  "rounded-r": "",
  "rounded-l": "",
  rounded: "",
  pill: "",
};

/**
 * @FIXME Requires a rewrite to fit with the other components
 * @param props
 * @returns
 */
export default function Dropdown(props: DropdownProps): ReactElement {
  const value =
    typeof props.value === "string"
      ? props.value
      : props.value?.value
      ? `${props.value.value}`
      : undefined;
  const options = props.options;

  const hideLabel = props.hideLabel ?? false;

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const targetValue = e.target.value;
    props.onChange(options.find((option) => option.value === targetValue));
  };

  const title = options.find((item) => item.value === value)?.alt;

  return (
    <>
      {!props.hideLabel && props.label && (
        <Label htmlFor={`${props.id}-input`}>{props.label}</Label>
      )}
      <Select
        aria-label={hideLabel ? props.label : undefined}
        id={props.id}
        value={value}
        variant={props.variant}
        onChange={(e) => onChange(e)}
        className={props.className ?? `${props.minimal ? "p-0" : "p-2"}`}
        title={title}
        options={options}
      />
    </>
  );
}
