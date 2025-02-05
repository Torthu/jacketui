import { FormField, FormOptionsField, isFormField } from "../types";

/** change
 *  Changes value and sets pristine to false (since value has been modified).
 *  change mutates passed state.
 *
 * @param state {S} A state object to change
 * @param fieldName {string} Name of FormField to mutate
 * @returns {S} New state object
 *
 * @example Mutate a state object in a reducer
 *   const initialState = { name: createFormField("") };
 *   const mutateNameAction = {type: "CHANGE", payload: {name: "name", value: "JacketUI"}}
 *   const formReducer = (state, action) => {
 *     if(action.type === "CHANGE") {
 *       return change({...state}, action.payload.name, action.payload.value)}
 *     }
 *   }
 *   console.log(formReducer(initialState, mutateNameAction));
 */
export function change<
  S = Record<string, FormField<unknown> | FormOptionsField<unknown>>,
  T = string
>(state: S, fieldName: keyof S, value: unknown): S {
  const field = state[fieldName];

  if (!isFormField(field)) {
    return state;
  }

  state[fieldName] = { ...state[fieldName], value, pristine: false };

  return state;
}
