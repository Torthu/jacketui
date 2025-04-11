import { errorToJuiError, JuiError } from "../error";
import { Result, success, failure } from "../result";

/** tryAwait<T>(promise: Promise<T>): Promise<Result<T, E>>
 *
 * @note This function is asynchronous. For synchronous functions, use `tryCatch`.
 * @note Not type safe.
 *
 * Wraps a promise in a try/catch block and returns a Result.
 *
 * @param {Promise} promise
 * @returns {Promise<Result<T, E>>}
 *
 * @example
 *   const result = await tryAwait(fetch('https://api.github.com/users/octocat'));
 *   if (result.ok) {
 *     console.log(result.value);
 *   } else {
 *     console.error(result.error);
 *   }
 *
 * @example
 *   const { ok, error, value } = await tryAwait(fetch('https://api.github.com/users/octocat'));
 *   if (ok) {
 *     console.log(value);
 *   } else {
 *     console.error(error);
 *   }
 */
export async function tryAwait<T = unknown>(
  promise: Promise<T>
): Promise<Result<T, JuiError>> {
  try {
    const data = await promise;
    return success(data);
  } catch (error) {
    const juierror = errorToJuiError(error);
    return failure(juierror);
  }
}
