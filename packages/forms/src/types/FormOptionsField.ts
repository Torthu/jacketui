import { FormField, OptionItem } from ".";

export interface FormOptionsField<T = unknown> extends FormField<T> {
  options: OptionItem<T>[];
}
