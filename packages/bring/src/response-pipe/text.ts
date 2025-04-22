import { Result, success } from "@torthu/jacketui-core";
import { BringError } from "../errors";

/** text(result: Result<Response, BringError>)
 *
 * Utility function to await Response.text().
 *
 * @param result Result<Response, BringError>
 * @returns Promise<Result<string, BringError>>
 */
export const text = async (result: Result<Response, BringError>) => {
  if (result.ok) {
    const res = await result.value.text();
    return success(res);
  } else {
    return result;
  }
};
