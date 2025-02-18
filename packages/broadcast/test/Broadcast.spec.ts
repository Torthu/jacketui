import { Broadcast } from "../src/Broadcast";

describe("Broadcast", () => {
  describe("init", () => {
    it("should instantiate Broadcast", () => {
      const broadcast = new Broadcast();

      expect(broadcast).toBeInstanceOf(Broadcast);
    });
  });

  describe("subscribe", () => {
    it("should be able to subscribe to event", () => {
      const broadcast = new Broadcast();
      const callback = broadcast.on("someEventKey", () => {});

      expect(callback).toBeDefined();
    });

    it("should be able to subscribe to event and trigger", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.on("someEventKey", callback);
      broadcast.emit({ type: "someEventKey" });

      expect(callback).toHaveBeenCalled();
    });

    it("should be able to subscribe to event and unsubscribe", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.on("someEventKey", callback);
      broadcast.off("someEventKey", callback);
      broadcast.emit({ type: "someEventKey" });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should be able to subscribe to event and unsubscribe all", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.on("someEventKey", callback);
      broadcast.offAll("someEventKey");
      broadcast.emit({ type: "someEventKey" });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should be able to subscribe to event and trigger only once", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.once("triggerOnce", callback);
      broadcast.emit({ type: "triggerOnce" });
      broadcast.emit({ type: "triggerOnce" });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should be able to have multiple subscribers", () => {
      const broadcast = new Broadcast();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      broadcast.on("someEventKey", callback1);
      broadcast.on("someEventKey", callback2);

      broadcast.emit({ type: "someEventKey" });

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("should be able to have multiple subscribers and unsubscribe one", () => {
      const broadcast = new Broadcast();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      broadcast.on("someEventKey", callback1);
      broadcast.on("someEventKey", callback2);

      broadcast.off("someEventKey", callback1);

      broadcast.emit({ type: "someEventKey" });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("should be able to have multiple subscribers and unsubscribe all", () => {
      const broadcast = new Broadcast();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      broadcast.on("someEventKey", callback1);
      broadcast.on("someEventKey", callback2);

      broadcast.offAll("someEventKey");

      broadcast.emit({ type: "someEventKey" });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it("should be able to have multiple subscribers and trigger only once", () => {
      const broadcast = new Broadcast();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      broadcast.once("triggerOnce", callback1);
      broadcast.once("triggerOnce", callback2);

      broadcast.emit({ type: "triggerOnce" });
      broadcast.emit({ type: "triggerOnce" });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe("event", () => {
    it("event.type should be emitted action.type", () => {
      const broadcast = new Broadcast();

      let event: any;
      let action = { type: "someEventKey", payload: "test" };

      broadcast.on("someEventKey", (e) => (event = e));
      broadcast.emit(action);

      expect(event.type).toBe(action.type);
    });

    it("event should contain timeStamp", () => {
      const broadcast = new Broadcast();

      let event: any;
      let action = { type: "someEventKey", payload: "test" };

      broadcast.on("someEventKey", (e) => (event = e));
      broadcast.emit(action);

      expect(event.timeStamp).toBeLessThanOrEqual(Date.now());
    });

    it("event should contain emitted action", () => {
      const broadcast = new Broadcast();
      let callbackPayload: any;
      let action = { type: "someEventKey", payload: "test" };

      broadcast.on("someEventKey", (e) => (callbackPayload = e.action));
      broadcast.emit({ type: "someEventKey", payload: "test" });

      expect(callbackPayload).toEqual(action);
    });

    it("event.param should contain emitted action", () => {
      const broadcast = new Broadcast();
      let callbackPayload: any;
      let action = { type: "someEventKey", payload: "test" };

      broadcast.on("someEventKey", (e) => (callbackPayload = e.param));
      broadcast.emit({ type: "someEventKey", payload: "test" });

      expect(callbackPayload).toEqual(action);
    });
  });
});
