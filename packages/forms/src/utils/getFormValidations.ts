import {
  FieldValidationFilterOptions,
  isFormField,
  Validation,
  getFieldValidation,
} from "..";

/** getFormValidations
 *
 * Get all form validations for a given form state.
 * If fieldNames are provided, only those fields will be checked.
 * If no fieldNames are provided, all fields will be checked.
 *
 *
 * @param state
 * @param options {@link FieldValidationFilterOptions} - defaults to { source = "all", severity = "all" }
 * @param fieldNames
 *
 * @returns (Validation & { fieldName: string })[]
 */
export const getFormValidations = <S extends object>(
  state: S,
  { source = "all", severity = "all" }: FieldValidationFilterOptions = {},
  fieldNames?: Array<keyof S>
): (Validation & { fieldName: string })[] => {
  fieldNames = fieldNames ?? (Object.keys(state) as unknown as Array<keyof S>);

  return (fieldNames as unknown as string[])
    .map((key) => {
      const candidate = state[key as keyof S];

      if (isFormField(candidate)) {
        const validations = getFieldValidation(candidate, { source, severity });
        return validations.map((v) => {
          const vf: Validation & { fieldName: string } = {
            ...v,
            fieldName: key,
          };
          return vf;
        });
      }
    }, [])
    .flat(1)
    .filter((v) => !!v);
};
