import { Broadcast } from "../src/Broadcast";

describe("Broadcast", () => {
  describe("init", () => {
    it("should instantiate Broadcast", () => {
      const broadcast = new Broadcast();

      expect(broadcast).toBeInstanceOf(Broadcast);
    });

    it("should be able to subscribe to event", () => {
      const broadcast = new Broadcast();
      const callback = broadcast.on("someEventKey", () => {});

      expect(callback).toBeDefined();
    });

    it("should be able to subscribe to event and trigger", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.on("someEventKey", callback);
      broadcast.emit("someEventKey", {});

      expect(callback).toHaveBeenCalled();
    });

    it("should be able to subscribe to event and unsubscribe", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.on("someEventKey", callback);
      broadcast.off("someEventKey", callback);
      broadcast.emit("someEventKey", {});

      expect(callback).not.toHaveBeenCalled();
    });

    it("should be able to subscribe to event and unsubscribe all", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.on("someEventKey", callback);
      broadcast.offAll("someEventKey");
      broadcast.emit("someEventKey", {});

      expect(callback).not.toHaveBeenCalled();
    });

    it("should be able to subscribe to event and trigger only once", () => {
      const broadcast = new Broadcast();
      const callback = jest.fn();
      broadcast.once("triggerOnce", callback);
      broadcast.emit("triggerOnce", {});
      broadcast.emit("triggerOnce", {});

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should be able to have multiple subscribers", () => {
      const broadcast = new Broadcast();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      broadcast.on("someEventKey", callback1);
      broadcast.on("someEventKey", callback2);
      broadcast.emit("someEventKey", {});

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });
});
