import { Result, success } from "@torthu/jacketui-core";
import { BringError } from "../errors";

/** arrayBuffer(result: Result<Response, BringError>)
 *
 * Utility function to await Response.arrayBuffer().
 *
 * @param result Result<Response, BringError>
 * @returns Promise<Result<ArrayBuffer, BringError>>
 */
export const arrayBuffer = async (result: Result<Response, BringError>) => {
  if (result.ok) {
    const res = await result.value.arrayBuffer();
    return success(res);
  } else {
    return result;
  }
};
