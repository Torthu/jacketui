import { FormField, FormOptionsField } from "../types";

interface FormChangeAction<S, T> {
  type: "CHANGE";
  payload: {
    name: keyof S; // FormFieldName
    value: T; // New value
  };
}

/** change
 *  Action handler for a FormChangeAction.
 *  Changes value and sets pristine to false (since value has been modified).
 *
 * @param state {S} A state object to change
 * @param action {FormChangeAction<S, T>} An action object to use to change the state
 * @returns {S} New state object
 *
 * @example Mutate a state object in a reducer
 *   const initialState = { name: createFormField("") };
 *   const mutateNameAction = {type: "CHANGE", payload: {name: "name", value: "JacketUI"}}
 *   const formReducer = (state, action) => {
 *     if(action.type === "CHANGE") {
 *       return {...state, ...change(state, action)}
 *     }
 *   }
 *   console.log(formReducer(initialState, mutateNameAction));
 */
export function change<
  S = Record<string, FormField | FormOptionsField>,
  T = string
>(state: S, action: FormChangeAction<S, T>) {
  if (action.type !== "CHANGE") {
    return;
  }

  const { name, value } = action.payload;
  return {
    ...state,
    [name]: {
      ...state[name],
      value,
      pristine: false,
    },
  };
}
