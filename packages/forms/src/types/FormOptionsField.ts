import { FormField, OptionItem } from ".";

export interface OptionsFormField<T = any> extends FormField<T> {
  options: OptionItem<T>[];
}
