import { BringError } from "./BringError";

export class NetworkError extends BringError {
  tag = "NetworkError";
}

/** isNetworkError
 *
 * Checks if error is NetworkError.
 * A NetworkError is either an instance of NetworkError or a BringError with status code 0.
 *
 */
export const isNetworkError = (error: unknown): error is NetworkError => {
  if (error instanceof NetworkError) {
    return true;
  }

  return (
    error instanceof BringError &&
    !!error.response &&
    error.response.status === 0
  );
};
