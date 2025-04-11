import { BringError } from "./BringError";

export class TimeoutError extends BringError {
  tag = "TimeoutError";
}

/** isTimeoutError
 *
 * Checks if error is TimeoutError.
 * A TimeoutError is either an instance of TimeoutError or a BringError with tag "TimeoutError".
 *
 */
export const isTimeoutError = (error: unknown): error is TimeoutError => {
  return (
    error instanceof TimeoutError ||
    (error instanceof BringError && error.tag === "TimeoutError")
  );
};
