import { errorToJuiError, JuiError } from "../error";
import { failure, success, Result } from "../result";

/** tryCatch<T, E>(fun: () => T): Result<T, JuiError>
 *
 * @note This function is synchronous. For asynchronous functions, use `tryAwait`.
 * @note Not type safe.
 *
 * Wraps a function in a try/catch block and returns a Result.
 * If the function throws, the error is returned as a Failure.
 * If the function returns, the value is returned as a Success.
 *
 * @param fun - The function to wrap in a try/catch block.
 * @returns A Result containing the value or error.
 *
 * @example
 *   const result = tryCatch(() => {
 *      throw new Error("Something went wrong");
 *   });
 *   // result is a Failure with the error and tag "Error"
 *
 *  * @example
 *   const {ok, error, value} = tryCatch(someFunction);
 *
 *   if(ok) {
 *     // do something with value
 *   } else {
 *     // do something with error
 *   }
 *
 * @see tryAwait (for asynchronous functions)
 */
export function tryCatch<T = unknown>(fun: () => T): Result<T, JuiError> {
  try {
    const data = fun();
    return success(data);
  } catch (error) {
    return failure(errorToJuiError(error));
  }
}
