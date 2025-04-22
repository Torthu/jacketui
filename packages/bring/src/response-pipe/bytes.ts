import { Result, success } from "@torthu/jacketui-core";
import { BringError } from "../errors";

/** bytes(result: Result<Response, BringError>)
 *
 * Utility function to await Response.bytes().
 *
 * @param result Result<Response, BringError>
 * @returns Promise<Result<Uint8Array, BringError>>
 */
export const bytes = async (result: Result<Response, BringError>) => {
  if (result.ok) {
    const res = await result.value.bytes();
    return success(res);
  } else {
    return result;
  }
};
