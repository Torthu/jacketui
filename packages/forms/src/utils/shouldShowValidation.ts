import { FormField, FormOptionsField } from "../types";
import { fieldHasError } from "./fieldHasError";

/** shouldShowValidation
 *  Standard strategy for when an error should be displayed.
 *  Error should be displayed when a field has had focus (i.e been blurred at least once).
 *
 * @param field {FormField | FormOptionsField}
 * @returns boolean
 */
export const shouldShowValidation = (
  field: FormField | FormOptionsField
): boolean => {
  return (
    (field.touched || field.forceShowValidation === true) &&
    field.forceHideValidation !== true &&
    fieldHasError(field)
  );
};
