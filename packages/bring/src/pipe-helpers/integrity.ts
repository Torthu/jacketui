import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** integrity(integrityMode): BringInitDecorator
 *
 * Sets the integrity mode of the request.
 *
 * The format of this option is <hash-algo>-<hash-source> where:
 * - <hash-algo> is one of the following values: sha256, sha384, or sha512
 * - <hash-source> is the Base64-encoding of the result of hashing the resource with the specified hash algorithm.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#integrity
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity
 *
 * @param integrityMode
 * @returns BringDecorator
 */
export const integrity =
  (integrityMode: BringInit["integrity"] = ""): BringInitDecorator =>
  (init) => {
    init.integrity = integrityMode;
    return init;
  };
