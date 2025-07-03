import { isFormField } from "../types";

export const isFormValid = <S extends object>(
  state: S,
  keys?: Array<keyof S>
): boolean => {
  keys = keys ?? (Object.keys(state) as unknown as Array<keyof S>);

  return (keys as unknown as string[]).reduce((valid, key) => {
    const candidate = state[key as keyof S];

    if (isFormField(candidate)) {
      return valid && candidate.validation.length === 0;
    }

    return valid;
  }, true);
};
