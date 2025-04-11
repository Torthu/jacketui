import { BringError } from "./BringError";

export class ServerError extends BringError {
  tag = "ServerError";
}

/** isServerError
 *
 * Checks if error is ServerError.
 * A ServerError is either an instance of ServerError or a BringError with status code >= 500 and < 600.
 *
 */
export const isServerError = (error: unknown): error is ServerError => {
  if (error instanceof ServerError) {
    return true;
  }

  return (
    error instanceof BringError &&
    !!error.response &&
    error.response.status >= 500 &&
    error.response.status < 600
  );
};
