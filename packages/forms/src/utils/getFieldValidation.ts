import { FormField, FieldValidationFilterOptions, Validation } from "../types";

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
