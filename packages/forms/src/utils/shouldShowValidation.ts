import { FormField, FormOptionsField, Validation } from "../types";
import { fieldHasError } from "./fieldHasError";
import { getFieldValidation } from "./getFieldValidation";

/** shouldShowValidation
 *  Standard strategy for when an error should be displayed.
 *  Error should be displayed when a field has had focus (i.e been blurred at least once).
 *
 * @param field {FormField | FormOptionsField}
 * @returns boolean
 */
export const shouldShowValidation = (
  field: FormField<unknown> | FormOptionsField<unknown>,
  severity: Validation["severity"] = "error"
): boolean => {
  return (
    (field.touched || field.forceShowValidation === true) &&
    field.forceHideValidation !== true &&
    getFieldValidation(field, { severity }).length > 0
  );
};
