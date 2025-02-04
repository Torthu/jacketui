import { FormField } from "../types";

/** createFormField
 *  Create an initial state FormField
 *
 * @param initialValue
 * @param field {Partial<FormField>} pass any relevant FormField props
 * @returns {FormField}
 *
 * @example
 *   const stringField = createFormField("");
 *
 * @example With existing value and array of server validation errors
 *   const stringField = createFormField(someApiResponse, {validation: serverValidationStrings.map((sv) => {source: "server", severity: "error", message: sv})})
 */
export function createFormField<T = string>(
  initialValue: T,
  field: Partial<FormField<T>> = {}
): FormField<T> {
  return {
    value: initialValue,
    focus: false,
    touched: false,
    pristine: true,
    forceHideValidation: false,
    forceShowValidation: false,
    validation: [],
    ...field,
  };
}
