// Super simple Event class modeled after DOM Events
export class BroadcastEvent<T extends string = string> {
  // A reference to the currently registered target for the event. This is the object to which the event is currently slated to be sent; it's possible this has been changed along the way through retargeting.

  // Indicates whether or not event.preventDefault() has been called on the event.
  public defaultPrevented: boolean = false;

  public propagationStopped: boolean = false;

  // The time at which the event was created (in milliseconds)
  public timeStamp: number;

  // The name of the event
  public type: T;

  // The event payload
  public param: any = undefined;

  // whether immediate propagations has been stopped
  public immediatePropagationStopped: boolean = false;

  constructor(type: T, param: any) {
    this.type = type;
    this.timeStamp = Date.now();
    this.param = param;
    this.defaultPrevented = false;
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
