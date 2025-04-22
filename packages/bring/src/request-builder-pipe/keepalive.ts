import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** keepalive(boolean): BringInitDecorator
 *
 * Sets the keepalive mode of the request.
 *
 * If set to true, the request will be kept alive until the browser is closed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/keepalive
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#keepalive
 *
 * @param keepaliveMode
 * @returns
 */
export const keepalive =
  (keepaliveMode: BringInit["keepalive"] = false): BringInitDecorator =>
  (init) => {
    init.keepalive = keepaliveMode;
    return init;
  };
