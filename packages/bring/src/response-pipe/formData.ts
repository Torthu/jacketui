import { Result, success } from "@torthu/jacketui-core";
import { BringError } from "../errors";

/** formData(result: Result<Response, BringError>)
 *
 * Utility function to await Response.formData().
 *
 * @param result Result<Response, BringError>
 * @returns Promise<Result<FormData, BringError>>
 */
export const formData = async (result: Result<Response, BringError>) => {
  if (result.ok) {
    const res = await result.value.formData();
    return success(res);
  } else {
    return result;
  }
};
