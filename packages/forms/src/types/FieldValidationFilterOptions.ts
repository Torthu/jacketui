import { Validation } from "./Validation";

export interface FieldValidationFilterOptions {
  source?: Validation["source"] | "all";
  severity?: Validation["severity"] | "all";
}
