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
    case "error":
    case "warning":
      severityFilter = severity;
      break;
    case "all":
    default:
      severityFilter = null;
      break;
  }

  switch (source) {
    case "server":
      validationArray = field.validation.filter((v) => v.source === "server");
      break;
    case "client":
      validationArray = field.validation.filter((v) => v.source === "client");
      break;
    case "all":
    default:
      validationArray = field.validation;
      break;
  }

  if (severityFilter === null) {
    return validationArray;
  }

  return validationArray.filter((field) => field.severity === severityFilter);
};
