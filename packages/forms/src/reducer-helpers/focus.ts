import { FormField, FormOptionsField, isFormField } from "../types";

/** change
 *  Sets focus to true.
 *  change mutates the passed state object.
 *
 * @param state {S} A state object to mutate
 * @param fieldName {string} Name of FormField
 * @returns {S} New state object
 *
 * @example Focus a state object in a reducer
 *   const initialState = { name: createFormField("", {focus: false}) };
 *   const mutateNameAction = {type: "FOCUS", payload: {name: "name"}}
 *   const formReducer = (state, action) => {
 *     if(action.type === "FOCUS") {
 *       return focus({...state}, action.payload.name)
 *     }
 *   }
 *   console.log(formReducer(initialState, mutateNameAction));
 */
export function focus<S = Record<string, FormField | FormOptionsField>>(
  state: S,
  fieldName: keyof S
): S {
  const field = state[fieldName];
  if (!isFormField(field)) {
    return state;
  }

  state[fieldName] = { ...state[fieldName], focus: true };

  return state;
}
