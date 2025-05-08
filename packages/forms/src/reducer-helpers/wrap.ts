import { validate, ValidationFunction, ValidationTuple } from "./validate";
import { blur } from "./blur";
import { focus } from "./focus";
import { change } from "./change";
import { touch } from "./touch";
import { forceShowValidation } from "./forceShowValidation";
import { forceHideValidation } from "./forceHideValidation";
import { reset } from "./reset";

/** wrap
 *  Partially apply the reducer-utils
 *
 * @param state {S}
 */
export const wrap = <S extends {} = Record<string, unknown>>(state: S) => {
  return {
    validate: (name: keyof S, ...validationTuples: ValidationTuple<S>[]) =>
      validate(state, name, ...validationTuples),
    blur: (fieldName: keyof S) => blur(state, fieldName),
    focus: (fieldName: keyof S) => focus(state, fieldName),
    change: (fieldName: keyof S, value: unknown) =>
      change(state, fieldName, value),
    touch: (fieldName: keyof S) => touch(state, fieldName),
    forceShowValidation: (fieldName: keyof S | Array<keyof S>) =>
      forceShowValidation(state, fieldName),
    forceHideValidation: (fieldName: keyof S | Array<keyof S>) =>
      forceHideValidation(state, fieldName),
    reset: (fieldName: keyof S | Array<keyof S>) => reset(state, fieldName),
    resetAll: () => reset(state),
  };
};
