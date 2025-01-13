import React, { ReactElement } from "react";
import { BaseComponent, BaseComponentProps, As } from "@torthu/jacketui-base";
import { FlexRow, FlexCol } from "@torthu/jacketui-components";
import { Input, InputFormat, Label } from ".";

interface BaseNumberInputProps
  extends BaseComponentProps<any, As<"input" | "textarea">> {
  id?: string;
  label?: string;
  updating?: boolean;
  className?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  pattern?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  step?: string;
  format?: string;
  dark?: boolean;
  minimal?: boolean;
  inline?: boolean;
}

interface IntegerInputNumberProps extends BaseNumberInputProps {
  type: "integer";
  value: number;
  onChange: (newValue: number) => void;
}
interface IntegerInputStringProps extends BaseNumberInputProps {
  type: "stringInteger";
  value: string;
  onChange: (newValue: string) => void;
}
interface DecimalInputNumberProps extends BaseNumberInputProps {
  type: "decimal";
  value: number;
  onChange: (newValue: number) => void;
}
interface DecimalInputStringProps extends BaseNumberInputProps {
  type: "stringDecimal";
  value: string;
  onChange: (newValue: string) => void;
}

export type NumberInputProps =
  | IntegerInputNumberProps
  | IntegerInputStringProps
  | DecimalInputNumberProps
  | DecimalInputStringProps;

const isIntNumberMode = (
  val: NumberInputProps
): val is IntegerInputNumberProps => {
  return val.type === "integer";
};

const isIntStringMode = (
  val: NumberInputProps
): val is IntegerInputStringProps => {
  return val.type === "stringInteger";
};

const isDecNumberMode = (
  val: NumberInputProps
): val is DecimalInputNumberProps => {
  return val.type === "decimal";
};

const isDecStringMode = (
  val: NumberInputProps
): val is DecimalInputStringProps => {
  return val.type === "stringDecimal";
};

export default function NumberInput(props: NumberInputProps): ReactElement {
  let onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  let type: "text" | "number" = "text";
  let inputMode: "numeric" | "decimal" = "numeric";
  let inputValue = "";

  if (isIntNumberMode(props)) {
    onChange = (e) => props.onChange(parseInt(e.target.value, 10));
    type = "number";
    inputMode = "numeric";
    inputValue = `${props.value}`;
  } else if (isIntStringMode(props)) {
    onChange = (e) => props.onChange(e.target.value);
    type = "text";
    inputMode = "numeric";
    inputValue = props.value;
  } else if (isDecNumberMode(props)) {
    onChange = (e) => props.onChange(parseFloat(e.target.value));
    type = "number";
    inputMode = "decimal";
    inputValue = `${props.value}`;
  } else if (isDecStringMode(props)) {
    onChange = (e) => props.onChange(e.target.value);
    type = "text";
    inputMode = "decimal";
    inputValue = props.value;
  } else {
    throw new Error("Invalid type passed to NumberInput");
  }

  const inputProps = {
    ...props,
    value: inputValue,
    type,
    inputMode,
    onChange,
    minimal: props.minimal,
  };

  const formatProps = { children: props.format };

  return (
    <FlexCol>
      {props.label && (
        <Label htmlFor={`${props.id}-input`}>{props.label}</Label>
      )}
      <FlexRow className="items-center">
        <Input
          className={`py-1.5`}
          {...inputProps}
          autoComplete="off"
          spellCheck={false}
        />
        {props.format && <InputFormat {...formatProps} />}
      </FlexRow>
    </FlexCol>
  );
}
