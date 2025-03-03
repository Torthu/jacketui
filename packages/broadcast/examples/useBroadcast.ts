import { Broadcast } from "../dist";

/**
 *  You can add typing to the singleton instance if you want to,
 *  e.g Broadcast<{type: "MY_BROADCAST_ACTION", payload: string} | {type: "MY_OTHER_BROADCAST_ACTION", payload: SomeComplicatedType}>
 */
let broadcastInstance: Broadcast | null = null;

/** useBroadcast()
 *  Singleton instance of Broadcast, made to look like a react hook, but usable from anywhere.
 *
 * @returns {Broadcast} broadcastInstance
 */
export const useBroadcast = () => {
  if (!broadcastInstance) {
    broadcastInstance = new Broadcast();
  }

  return broadcastInstance;
};
