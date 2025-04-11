import { Failure } from "@torthu/jacketui-core";
import { BringError } from "../errors";

const defaultRetryStatuses = [0, 408, 425, 429, 500, 502, 503, 504];

interface RetryOptions {
  retryStatuses?: number[];
}

/** shouldRetry(failure: Failure<BringError>, options?: RetryOptions): boolean
 *
 * Determines if a request should be retried based on the failure and options.
 * By default, it retries on 0, 408, 425, 429, 500, 502, 503, and 504 status codes.
 *
 * Additionally if there is no response (i.e the request failed before a response was received),
 * it will retry.
 *
 * You can override this behavior by passing a custom `retryStatuses` array.
 *
 * @param failure Failure<BringError>
 * @param options RetryOptions
 * @param options.retryStatuses Array of status codes to retry on
 * @returns boolean
 */
export const shouldRetry = (
  failure: Failure<BringError>,
  { retryStatuses = defaultRetryStatuses }: RetryOptions = {}
): boolean => {
  const error = failure.error;

  if (error.response) {
    if (retryStatuses.includes(error.response.status)) {
      return true;
    } else {
      return false;
    }
  }

  return true;
};
