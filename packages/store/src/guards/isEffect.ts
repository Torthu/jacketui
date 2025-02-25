import { Effect } from "../types";

export const isEffect = (a: unknown): a is Effect<any, any> => {
  if (typeof a !== "function") return false;

  const effect = a as Effect<any, any>;
  return effect.length === 1;
};
