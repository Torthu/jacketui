import { md5 } from "../utils";
import { hashComparison } from "./hashComparison";

/** md5Comparison(oldState, newState)
 *  Calculates hash of oldState and newState using md5 and compares them for equality
 *
 * @param {State} oldState
 * @param {State} newState
 * @returns {boolean} is equal
 */
export const md5Comparison = hashComparison(md5);
