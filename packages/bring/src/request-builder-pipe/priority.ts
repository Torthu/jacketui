import { BringInitDecorator } from "../types/BringDecorator";
import { BringInit } from "../types/BringInit";

/** priority("auto" | "high" | "low"): BringInitDecorator
 *
 * The priority of the request relative to other requests of the same type.
 *
 * Possible values are:
 * - "auto" (default) No user preference for the fetch priority
 * - "high" A high priority fetch request relative to other requests of the same type.
 * - "low" A low priority fetch request relative to other requests of the same type.
 *
 * @param priorityMode "auto" | "high" | "low
 * @returns BringInitDecorator
 */
export const priority = (
  priorityMode: BringInit["priority"] = "auto"
): BringInitDecorator => {
  return (init) => ({ ...init, priority: priorityMode });
};
