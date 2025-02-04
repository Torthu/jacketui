import { FormField, FormOptionsField } from "../types";

interface FormFocusAction<S> {
  type: "FOCUS";
  payload: {
    name: keyof S; // FormFieldName
  };
}

/** change
 *  Action handler for a FormFocusAction.
 *  Sets focus to true.
 *
 * @example Focus a state object in a reducer
 *   const initialState = { name: createFormField("", {focus: false}) };
 *   const mutateNameAction = {type: "FOCUS", payload: {name: "name"}}
 *   const formReducer = (state, action) => {
 *     if(action.type === "FOCUS") {
 *       return {...state, ...focus(state, action)}
 *     }
 *   }
 *   console.log(formReducer(initialState, mutateNameAction));
 */
export function focus<S = Record<string, FormField | FormOptionsField>>(
  state: S,
  action: FormFocusAction<S>
) {
  if (action.type !== "FOCUS") {
    return;
  }

  const { name } = action.payload;
  return {
    ...state,
    [name]: {
      ...state[name],
      focus: true,
    },
  };
}
