import { BringError } from "./BringError";

export class AbortError extends BringError {
  tag = "AbortError";
}

/** isAbortError
 *
 * Checks if error is AbortError.
 * An AbortError is either an instance of AbortError or a BringError with tag "AbortError".
 *
 */
export const isAbortError = (error: unknown): error is AbortError => {
  return (
    error instanceof AbortError ||
    (error instanceof BringError && error.tag === "AbortError")
  );
};
