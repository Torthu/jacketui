import { FormField, OptionItem } from ".";

export interface FormOptionsField<T = any> extends FormField<T> {
  options: OptionItem<T>[];
}
