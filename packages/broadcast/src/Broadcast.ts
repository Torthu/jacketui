import { BroadcastEvent } from "./BroadcastEvent";
import { BroadcastAction } from "./types/BroadcastAction";

export type BroadcastCallbackFunction<A extends BroadcastAction> = (
  e: BroadcastEvent<A>
) => void;

export class Broadcast<A extends BroadcastAction = BroadcastAction> {
  private listeners: Record<A["type"], BroadcastCallbackFunction<A>[]> =
    {} as Record<A["type"], BroadcastCallbackFunction<A>[]>;

  public emit(action: A): BroadcastEvent<A> {
    const event = new BroadcastEvent<A>(action);

    this.notify(action.type, event);
    return event;
  }

  private notify(key: A["type"], event: BroadcastEvent<A>): void {
    if (
      event.immediatePropagationStopped !== true &&
      this.listeners?.[key]?.length > 0
    ) {
      for (const listener of this.listeners[key]) {
        listener(event);
      }
    }

    return;
  }

  // Listen to events hitting this module
  public on(
    key: A["type"],
    callback: BroadcastCallbackFunction<A>
  ): BroadcastCallbackFunction<A> {
    if (typeof key === "string") {
      if (this.listeners[key] === undefined) {
        this.listeners[key] = [];
      }
      this.listeners[key].push(callback);
      return callback;
    } else {
      throw new Error("Broadcast key must be string");
    }
  }

  // Remove all event listeners of type
  public offAll(key: A["type"]): boolean {
    if (typeof key === "string") {
      delete this.listeners[key];
      return true;
    }
    return false;
  }

  // Remote a event listener
  public off(key: A["type"], callback: BroadcastCallbackFunction<A>): boolean {
    if (typeof key === "string") {
      const index = this.listeners[key]?.indexOf(callback);

      if (index > -1) {
        this.listeners[key].splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Listen to an event hitting this module. Triggers only once.
  public once(
    key: A["type"],
    callback: BroadcastCallbackFunction<A>
  ): BroadcastCallbackFunction<A> {
    const cb: BroadcastCallbackFunction<A> = (e) => {
      this.off(key, cb);
      callback(e);
    };
    this.on(key, cb);
    return () => {
      this.off(key, cb);
    };
  }
}
