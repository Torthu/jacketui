import { FormField, Validation } from "../types";

export interface ValidationFunction<S> {
  (state: S, name: keyof S): boolean;
}

export type ValidationTuple<S> = [
  ValidationFunction<S>,
  Validation["message"],
  Validation["severity"]?,
  Validation["description"]?
];

/** validate
 *  Mutates state with validation results
 *
 * @param state
 * @param name
 * @param validationTuples
 * @returns
 */
export function validate<S>(
  state: S,
  name: keyof S,
  ...validationTuples: ValidationTuple<S>[]
): S {
  const val = validationTuples
    .map(([v, message, severity = "error"]) =>
      !v(state, name)
        ? ({
            source: "client",
            severity,
            message,
            description: message,
          } as Validation)
        : null
    )
    .filter((v) => v !== null);

  (state[name] as FormField).validation = val;
  return state;
}

/** notEmpty
 *  String should not be empty.
 *
 * @param state
 * @param name
 * @returns
 */
export function notEmpty<S>(state: S, name: keyof S) {
  return (state[name] as FormField).value !== "";
}

export function maxLength<S>(num: number): ValidationFunction<S> {
  return (state: S, name: keyof S) =>
    (state[name] as FormField<string | Array<unknown>>).value.length <= num;
}

export function minLength<S>(num: number): ValidationFunction<S> {
  return (state: S, name: keyof S) =>
    (state[name] as FormField<string | Array<unknown>>).value.length >= num;
}

export function min<S>(num: number): ValidationFunction<S> {
  return (state: S, name: keyof S) =>
    (state[name] as FormField<number>).value >= num;
}

export function max<S>(num: number): ValidationFunction<S> {
  return (state: S, name: keyof S) =>
    (state[name] as FormField<number>).value <= num;
}
