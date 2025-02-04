import { FormField, FormOptionsField } from "../types";
import { getFieldValidation } from "./getFieldValidation";

/** fieldHasError
 *  Check to see if the FormField's validations include validations with severity errors.
 *
 * @param field {FormField}
 * @returns boolean
 */
export const fieldHasError = (field: FormField | FormOptionsField): boolean =>
  getFieldValidation(field, { severity: "error" }).length > 0;
