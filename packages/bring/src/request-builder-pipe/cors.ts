import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** cors(corsMode): BringInitDecorator
 *
 * Sets the CORS mode for the request.
 *
 * The default value is "cors".
 *
 * Possible values are: "cors", "no-cors", "same-origin".
 * - "cors": CORS mode is enabled. This is the default value.
 * - "no-cors": CORS mode is disabled.
 * - "same-origin": CORS mode is enabled only for same-origin requests.
 *
 * An origin is the combination of protocol, host, and port.
 * The path is not included in the origin.
 *
 * For example,
 * - https://example.com is an origin.
 * - https://example.com/path is the same origin.
 * - https://example.com:8080 is a different origin.
 * - https://sub.example.com/path is a different origin.
 * - http://example.com is a different origin.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 *
 * @example
 *   const customGet = (url: string) => pipe(cors("no-cors"), method("GET"), bring)({ url }
 *
 * @param corsMode - The mode to use for the request. "cors", "no-cors", "same-origin" (default: "cors").
 * @returns BringInitDecorator
 */
export const cors =
  (corsMode: BringInit["mode"] = "cors"): BringInitDecorator =>
  (init) => {
    init.mode = corsMode;
    return init;
  };
