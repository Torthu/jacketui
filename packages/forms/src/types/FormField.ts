import { Validation } from ".";

export interface FormField<T = string> {
  value: T;
  validation: Validation[];
  touched: boolean; // Field has had focus
  pristine: boolean; // Field has been changed
  focus?: boolean; // Field currently has focus
  forceShowValidation?: boolean;
  forceHideValidation?: boolean;
}
