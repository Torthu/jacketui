import { isFormField } from "..";

/** getFormValues
 *
 * Get values for all form fields for a given form state.
 * If fieldNames are provided, only those fields will be checked.
 * If no fieldNames are provided, all fields will be checked.
 *
 * @param state
 * @param fieldNames
 *
 */
export const getFormValues = <S extends Record<string, unknown>>(
  state: S,
  fieldNames?: Array<keyof S>
) => {
  fieldNames = fieldNames ?? (Object.keys(state) as unknown as Array<keyof S>);

  const values = {} as Record<keyof S, unknown>;

  (fieldNames as unknown as string[]).forEach((key) => {
    const field = state[key as keyof S];

    if (isFormField(field)) {
      values[key as keyof S] = field.value;
    }
  }, []);

  return values;
};
