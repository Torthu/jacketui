import { Validation } from ".";

export interface FormField<T = unknown> {
  value: T;
  validation: Validation[];
  touched?: boolean; // Field has had focus
  pristine?: boolean; // Field has been changed
  focus?: boolean; // Field currently has focus
  forceShowValidation?: boolean;
  forceHideValidation?: boolean;
}

/** isFormField
 *  Simplified type guard.
 *  Checks if passed field is an object with a value and a validation prop.
 *  Any FormFieldLike object will pass the guard.
 *
 *  @param {unknown} field
 *  @return {boolean}
 */
export const isFormField = (field: unknown): field is FormField => {
  if (typeof field !== "object") {
    return false;
  }

  const formField = field as FormField;

  return (
    Object.hasOwn(formField, "value") && Object.hasOwn(formField, "validation")
  );
};
