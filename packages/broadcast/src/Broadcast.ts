import { BroadcastEvent } from "./BroadcastEvent";

export interface BroadcastInterface<T extends string = string> {
  emit: (eventName: T, payload: any) => void;
  on: (
    eventName: T,
    callback: BroadcastCallbackFunction
  ) => BroadcastCallbackFunction;
  off: (eventName: T, callback: BroadcastCallbackFunction) => boolean;
  offAll: (eventName: T) => boolean;
  once: (
    eventName: T,
    callback: BroadcastCallbackFunction
  ) => BroadcastCallbackFunction;
}

export type BroadcastCallbackFunction = (e: BroadcastEvent) => void;

export class Broadcast<T extends string = string>
  implements BroadcastInterface<T>
{
  private listeners: Record<string, BroadcastCallbackFunction[]> = {};
  public emit<T extends string>(key: T, payload: any): BroadcastEvent {
    const event = new BroadcastEvent(key, payload);

    this.notify(key, event);
    return event;
  }

  private notify(key: string, event: BroadcastEvent): void {
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
    key: T,
    callback: BroadcastCallbackFunction
  ): BroadcastCallbackFunction {
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
  public offAll(key: T): boolean {
    if (typeof key === "string") {
      delete this.listeners[key];
      return true;
    }
    return false;
  }

  // Remote a event listener
  public off(key: T, callback: BroadcastCallbackFunction): boolean {
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
    key: T,
    callback: BroadcastCallbackFunction
  ): BroadcastCallbackFunction {
    const cb: BroadcastCallbackFunction = (e) => {
      this.off(key, cb);
      callback(e);
    };
    this.on(key, cb);
    return () => {
      this.off(key, cb);
    };
  }
}
