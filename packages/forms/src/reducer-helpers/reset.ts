import {
  FormField,
  FormOptionsField,
  isFormField,
  isFormOptionsField,
} from "../types";

/** reset(state, fieldName | fieldName[])
 *
 *  Resets the field to initial state.
 *
 * @param state {S} A state object to change
 * @param fieldName {string | string[]} Name of FormField(s) to mutate
 * @returns {S} New state object
 */
export function reset<
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

    if (isFormField(field)) {
      state[key] = {
        ...state[key],
        value: field.initialValue,
        touched: false,
        focus: false,
        forceHideValidation: undefined,
        forceShowValidation: undefined,
        pristine: true,
      };
    }

    if (isFormOptionsField(field)) {
      state[key] = {
        ...state[key],
        options: field.initialOptions,
      };
    }
  });

  return state;
}
