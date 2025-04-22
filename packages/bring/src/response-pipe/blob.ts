import { Result, success } from "@torthu/jacketui-core";
import { BringError } from "../errors";

/** blob(result: Result<Response, BringError>)
 *
 * Utility function to await Response.blob().
 *
 * @param result Result<Response, BringError>
 * @returns Promise<Result<Blob, BringError>>
 */
export const blob = async (result: Result<Response, BringError>) => {
  if (result.ok) {
    const res = await result.value.blob();
    return success(res);
  } else {
    return result;
  }
};
