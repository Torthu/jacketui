import { isPromise } from "./isPromise";

export interface AbortablePromise<T = unknown> extends Promise<T> {
  abort: (reason: string, context: Record<string, any>) => void;
}

export const isAbortablePromise = (
  promise: unknown
): promise is AbortablePromise => {
  return (
    isPromise(promise) &&
    typeof (promise as AbortablePromise).abort === "function"
  );
};
