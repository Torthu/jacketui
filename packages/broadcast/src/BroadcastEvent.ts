import { BroadcastAction } from "./types/BroadcastAction";

/** BroadcastEvent
 *  Super simple Event class modeled after DOM Events and Store Actions.
 */
export class BroadcastEvent<A extends BroadcastAction> {
  /** Event type, i.e on("eventType") => type: "eventType" */
  type: A["type"];

  /** Unix timestamp */
  timeStamp: number;

  /** The emitted action */
  action: A;

  /** Emitted Action, stored in param to keep compatibility with DOM events */
  param: A;

  /** Indicates whether or not event.preventDefault() has been called on the event. */
  public defaultPrevented: boolean = false;

  /** In a bubbling scenario indicates whether it should stop propagating */
  public propagationStopped: boolean = false;

  /** Indicates whether nodes in the same branch of a "bubbling" tree should be notified */
  public immediatePropagationStopped: boolean = false;

  constructor(action: A) {
    this.type = action.type;
    this.action = action;
    this.param = action;
    this.timeStamp = Date.now();
  }

  // Prevent default behaviour for the event, meaning any listener in core
  public preventDefault(): void {
    this.defaultPrevented = true;
    return;
  }

  // Stop all listener callbacks
  public stopImmediatePropagation(): void {
    this.immediatePropagationStopped = true;
    return;
  }

  // Stop event propagation
  public stopPropagation(): void {
    this.propagationStopped = true;
    return;
  }
}
