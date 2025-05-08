import { FormField, FormOptionsField, isFormField } from "../types";

/** forceHideValidation(state, fieldName | fieldName[])
 *
 *  Sets forceHideValidation to true for a field or fields.
 *
 * @param state {S} A state object to change
 * @param fieldName {string | string[]} Name of FormField(s) to mutate
 * @returns {S} New state object
 */
export function forceHideValidation<
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

    state[key] = { ...state[key], forceHideValidation: true };
  });

  return state;
}
