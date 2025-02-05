import { FormField, FieldValidationFilterOptions, Validation } from "../types";

/** getFieldValidations
 *  Utility for getting filtered validations.
 *
 * @param field {FormField}
 * @param {FieldValidationFilterOptions}
 * @returns {Validation[]}
 *
 * @example Get all validations
 *   getFieldValidation(field);
 *
 * @example Get all validations from server
 *   getFieldValidation(field, {source: "server"});
 *
 * @example Get all validation errors from client
 *   getFieldValidation(field, {source: "client", severity: "error"});
 *
 */
export const getFieldValidation = <T = any>(
  field: FormField<T>,
  { source = "all", severity = "all" }: FieldValidationFilterOptions
) => {
  let severityFilter;
  let validationArray: Validation[];

  switch (severity) {
    case "all":
      severityFilter = null;
      break;
    default:
      severityFilter = severity;
      break;
  }

  switch (source) {
    case "all":
      validationArray = field.validation;
      break;
    default:
      validationArray = field.validation.filter((v) => v.source === source);
      break;
  }

  if (severityFilter === null) {
    return validationArray;
  }

  return validationArray.filter((field) => field.severity === severityFilter);
};
