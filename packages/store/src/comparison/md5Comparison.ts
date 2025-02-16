import { md5 } from "../utils";
import { hashComparison } from "./hashComparison";

/**
 * Simple reference equality comparison
 * @param {State} oldState
 * @param {State} newState
 * @returns {boolean} is equal
 */
export const md5Comparison = hashComparison(md5);
