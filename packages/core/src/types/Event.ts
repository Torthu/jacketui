import { Action } from "./Action";

/** Event
 *
 *  Super simple Event class modeled after DOM Events and Store Actions.
 *  Designed to be compatible with DOM Events and Store Actions.
 *
 *  @note Event is an Action
 *
 */
export interface Event extends Action {
  timestamp: number;

  defaultPrevented: boolean;
  propagationStopped: boolean;
  immediatePropagationStopped: boolean;

  preventDefault(): void;
  stopPropagation(): void;
  stopImmediatePropagation(): void;
}

export const isEvent = (event: unknown): event is Event => {
  return (
    typeof event === "object" &&
    event !== null &&
    "type" in event &&
    "timestamp" in event &&
    "defaultPrevented" in event &&
    "propagationStopped" in event &&
    "immediatePropagationStopped" in event &&
    "preventDefault" in event &&
    "stopPropagation" in event &&
    "stopImmediatePropagation" in event
  );
};
