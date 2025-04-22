import { Result, success } from "@torthu/jacketui-core";
import { BringError } from "../errors";

/** json(result: Result<Response, BringError>)
 *
 * Utility function to await Response.json().
 *
 * @param result Result<Response, BringError>
 * @returns Promise<Result<T, BringError>>
 */
export const json = async <T = unknown>(
  result: Result<Response, BringError>
) => {
  if (result.ok) {
    const json = await result.value.json();
    return success(json as T);
  } else {
    return result;
  }
};
