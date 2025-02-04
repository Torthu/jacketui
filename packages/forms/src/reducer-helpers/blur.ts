import { FormField, FormOptionsField } from "../types";

interface FormBlurAction<S> {
  type: "BLUR";
  payload: {
    name: keyof S; // FormFieldName
  };
}

/** blur
 *  Action handler for a FormBlurAction.
 *  Sets focus to false and touched to true.
 *
 * @param state {S} A state object to change
 * @param action {FormBlurAction<S>} An action object to use to change the state
 * @returns {S} New state object
 *
 * @example Blur a state object in a reducer
 *   const initialState = { name: createFormField("", {focus: false, touched: false}) };
 *   const mutateNameAction = {type: "BLUR", payload: {name: "name"}}
 *   const formReducer = (state, action) => {
 *     if(action.type === "BLUR") {
 *       return {...state, ...blur(state, action)}
 *     }
 *   }
 *   console.log(formReducer(initialState, mutateNameAction));
 */
export function blur<S = Record<string, FormField | FormOptionsField>>(
  state: S,
  action: FormBlurAction<S>
) {
  if (action.type !== "BLUR") {
    return;
  }

  const { name } = action.payload;
  return {
    ...state,
    [name]: {
      ...state[name],
      focus: false,
      touched: true,
    },
  };
}
