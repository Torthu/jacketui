import { Broadcast, BroadcastEvent } from "../";

const broadcast = new Broadcast();

const callback = broadcast.on("someEventKey", (e: BroadcastEvent) =>
  console.log(
    "Triggers every time broadcast.emit('someEventKey', data) is called",
    e
  )
);
broadcast.once("triggerOnce", (e: BroadcastEvent) =>
  console.log("Triggered only once", e)
);

broadcast.emit("someEventKey", {});
broadcast.emit("someEventKey", { data: "anything" });

broadcast.emit("triggerOnce", null);

// Will not trigger any callback
broadcast.emit("triggerOnce", null);

// Remove the listener
broadcast.off("someEventKey", callback);

// Will not trigger any callback
broadcast.emit("someEventKey", null);

// Removes all listeners for an event
// Useful if you for instance want to clean up multiple scoped event listeners in a component instance
broadcast.offAll("someEventKey");
