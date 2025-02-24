import { Broadcast, BroadcastEvent } from "../src";

type Action = { type: "someEventKey" | "triggerOnce"; data?: any };
const broadcast = new Broadcast<Action>();

const callback = broadcast.on("someEventKey", (e) =>
  console.log(
    "Triggers every time broadcast.emit('someEventKey', data) is called",
    e
  )
);
broadcast.once("triggerOnce", (e) => console.log("Triggered only once", e));

broadcast.emit({ type: "someEventKey" });
broadcast.emit({ type: "someEventKey", data: "anything" });

broadcast.emit({ type: "triggerOnce" });

// Will not trigger any callback
broadcast.emit({ type: "triggerOnce" });

// Remove the listener
broadcast.off("someEventKey", callback);

// Will not trigger any callback
broadcast.emit({ type: "someEventKey" });

// Removes all listeners for an event
// Useful if you for instance want to clean up multiple scoped event listeners in a component instance
broadcast.offAll("someEventKey");
