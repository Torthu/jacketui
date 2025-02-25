import { AsyncReducer } from "../types";

export function isAsyncReducer(a: unknown): a is AsyncReducer<any, any> {
  if (typeof a !== "function") return false;

  const actionHandler = a as AsyncReducer<any, any>;
  return actionHandler.length === 3;
}
