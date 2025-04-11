import { Failure, isFailure, isSuccess, Success } from ".";

export type Result<T = unknown, E = unknown> = Success<T> | Failure<E>;

export const isResult = (
  result: unknown
): result is Result<unknown, unknown> => {
  return isSuccess(result) || isFailure(result);
};
