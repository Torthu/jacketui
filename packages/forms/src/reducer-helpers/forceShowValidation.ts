import { FormField, FormOptionsField, isFormField } from "../types";

/** forceShowValidation(state, fieldName | fieldName[])
 *
 *  Sets forceShowValidation to true for a field or fields.
 *
 * @param state {S} A state object to change
 * @param fieldName {string | string[]} Name of FormField(s) to mutate
 * @returns {S} New state object
 */
export function forceShowValidation<
  S = Record<string, FormField<unknown> | FormOptionsField<unknown>>
>(state: S, fieldName: keyof S | Array<keyof S>, value: unknown): S {
  const keys: Array<keyof S> = Array.isArray(fieldName)
    ? fieldName
    : [fieldName];

  keys.forEach((key) => {
    const field = state[key];

    if (!isFormField(field)) {
      return;
    }

    state[key] = { ...state[key], value, forceShowValidation: true };
  });

  return state;
}
