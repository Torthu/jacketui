export interface Failure<E = unknown> {
  ok: false;
  value: undefined;
  error: E;
}

export const isFailure = (result: unknown): result is Failure<unknown> =>
  typeof result === "object" && result !== null && "error" in result;

export const failure = <E = unknown>(error: E): Failure<E> =>
  ({
    ok: false,
    error,
    value: undefined,
  } as Failure<E>);

export class Failure<E> implements Failure<E> {
  constructor(error: E) {
    this.ok = false;
    this.error = error;
    this.value = undefined;
  }
}
