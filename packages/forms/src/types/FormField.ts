import { Validation } from ".";

export interface FormField<T = string> {
  value: T;
  validation: Validation[];
  touched: boolean;
  focus?: boolean;
  hasHadFocus?: boolean;
  hasBeenBlurred?: boolean;
  forceShowValidation?: boolean;
  forceHideValidation?: boolean;
}
