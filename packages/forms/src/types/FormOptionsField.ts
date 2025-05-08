import { FormField, isFormField, OptionItem } from ".";

export interface FormOptionsField<T = unknown> extends FormField<T> {
  options: OptionItem<T>[];
  initialOptions: OptionItem<T>[];
}

export const isFormOptionsField = (
  field: unknown
): field is FormOptionsField => {
  return isFormField(field) && Object.hasOwn(field, "options");
};
