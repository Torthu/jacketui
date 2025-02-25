import { Reducer } from "../types";

export const isReducer = (a: unknown): a is Reducer<any, any> => {
  if (typeof a !== "function") return false;

  const reducer = a as Reducer<any, any>;
  return reducer.length === 2;
};
