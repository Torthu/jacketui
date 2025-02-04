import { FormField, FormOptionsField } from "../types";
import { getFieldValidation } from "./getFieldValidation";

/** fieldHasWarning
 *  Check to see if the FormField's validations include validations with severity errors.
 *
 * @param field {FormField | FormOptionsField}
 * @returns boolean
 */
export const fieldHasWarning = (field: FormField | FormOptionsField): boolean =>
  getFieldValidation(field, { severity: "warning" }).length > 0;
