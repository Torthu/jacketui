import { FormField, FormOptionsField, isFormField } from "../types";

/** blur
 *  Sets focus to false and touched to true.
 *  Blur mutates the passed state object.
 *
 * @param state {S} A state object to mutate
 * @param fieldName {string} Name of FormField
 * @returns {S} state object
 *
 * @example Blur a state object in a reducer
 *   const initialState = { name: createFormField("", {focus: false, touched: false}) };
 *   const mutateNameAction = {type: "BLUR", payload: {name: "name"}}
 *   const formReducer = (state, action) => {
 *     if(action.type === "BLUR") {
 *       return blur({...state}, action.payload.name)
 *     }
 *   }
 *   console.log(formReducer(initialState, mutateNameAction));
 */
export function blur<S = Record<string, FormField | FormOptionsField>>(
  state: S,
  fieldName: keyof S
): S {
  const field = state[fieldName];
  if (!isFormField(field)) {
    return state;
  }

  state[fieldName] = { ...state[fieldName], focus: false, touched: true };

  return state;
}
