import { JuiError } from ".";

/** errorToJuiError(error: unknown): JuiError
 *
 * Converts a native error to a JuiError.
 * If the error is already a JuiError, it is returned as is.
 *
 * @param {unknown} error
 * @returns {JuiError}
 */
export function errorToJuiError(error: unknown): JuiError {
  if (error instanceof JuiError) {
    return error;
  }

  if (error instanceof AggregateError) {
    return new JuiError(error.message, {
      tag: error.constructor.name,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new JuiError(error.message, {
      cause: error,
      tag: error.constructor.name,
    });
  }

  if (typeof error === "string") {
    return new JuiError(error, {
      context: { type: typeof error, value: error },
      tag: "UnknownError",
    });
  }

  if (
    typeof error === "boolean" ||
    typeof error === "number" ||
    error === null ||
    error === undefined
  ) {
    return new JuiError("Unknown error", {
      context: { type: typeof error, value: error },
      tag: "UnknownError",
    });
  }

  return new JuiError("Unknown error", {
    context: { type: typeof error, value: error?.toString() },
    tag: "UnknownError",
  });
}
