import { FormField, FormOptionsField, isFormField } from "../types";

/** forceShowValidation(state, fieldName | fieldName[])
 *
 *  Sets forceShowValidation to true for a field or fields.
 *
 * if fieldName is not provided, all fields will be mutated.
 *
 * @param state {S} A state object to change
 * @param fieldName {string | string[]} Name of FormField(s) to mutate
 * @returns {S} New state object
 */
export function forceShowValidation<
  S extends {} = Record<string, FormField<unknown> | FormOptionsField<unknown>>
>(state: S, fieldName?: keyof S | Array<keyof S>): S {
  if (!fieldName) {
    fieldName = Object.keys(state) as Array<keyof S>;
  }

  const keys: Array<keyof S> = Array.isArray(fieldName)
    ? fieldName
    : [fieldName];

  keys.forEach((key) => {
    const field = state[key];

    if (!isFormField(field)) {
      return;
    }

    state[key] = { ...state[key], forceShowValidation: true };
  });

  return state;
}
