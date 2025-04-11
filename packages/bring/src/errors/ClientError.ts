import { BringError } from "./BringError";

export class ClientError extends BringError {
  tag = "ClientError";
}

/** isClientError
 *
 * Checks if error is ClientError.
 * A ClientError is either an instance of ClientError or a BringError with a status code between 400 and 499.
 *
 */
export const isClientError = (error: unknown): error is ClientError => {
  if (error instanceof ClientError) {
    return true;
  }

  return (
    error instanceof BringError &&
    !!error.response &&
    error.response.status >= 400 &&
    error.response.status < 500
  );
};
