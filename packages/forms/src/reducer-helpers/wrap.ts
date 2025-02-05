import { validate, ValidationFunction, ValidationTuple } from "./validate";
import { blur } from "./blur";
import { focus } from "./focus";
import { change } from "./change";

/** wrap
 *  Partially apply the reducer-utils
 *
 * @param state {S}
 * @returns
 */
export const wrap = <S = unknown>(state: S) => {
  return {
    validate: (name: keyof S, ...validationTuples: ValidationTuple<S>[]) =>
      validate(state, name, ...validationTuples),
    blur: (fieldName: keyof S) => blur(state, fieldName),
    focus: (fieldName: keyof S) => focus(state, fieldName),
    change: (fieldName: keyof S, value: unknown) =>
      change(state, fieldName, value),
  };
};
