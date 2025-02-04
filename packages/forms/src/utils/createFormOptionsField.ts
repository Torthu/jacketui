import { FormOptionsField, OptionItem } from "../types";
import { createFormField } from "./createFormField";

/** createFormOptionsField
 *  Same as createFormField with an extra options param.
 *  @see createFormField
 *
 * @param initialValue
 * @param options {OptionItem[]}
 * @param field {Partial<FormOptionsField>}
 * @returns {FormOptionsField}
 */
export function createFormOptionsField<T extends string>(
  initialValue: T,
  options: OptionItem<T>[],
  field: Partial<FormOptionsField<T>> = {}
): FormOptionsField<T> {
  return {
    options,
    ...createFormField(initialValue, field),
  };
}
