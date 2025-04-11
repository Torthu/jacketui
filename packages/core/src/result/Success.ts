export interface Success<T = unknown> {
  ok: true;
  error: undefined;
  value: T;
}

export const isSuccess = (result: unknown): result is Success<unknown> =>
  typeof result === "object" && result !== null && "value" in result;

export const success = <T = unknown>(value: T): Success<T> => ({
  ok: true,
  error: undefined,
  value,
});

export class Success<T> implements Success<T> {
  constructor(value: T) {
    this.ok = true;
    this.error = undefined;
    this.value = value;
  }
}
