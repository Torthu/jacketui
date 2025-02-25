import { Store } from "..";
import { BasicAction } from "../types";
import { StoreBroadcastAction } from "../types/StoreBroadcastAction";

/** awaitStoreEvent(store, type)
 *  Wait for a store event to happen.
 *  Available events are: "dispatch", "stateUpdated" and "preStateUpdated".
 *
 * @param {Store} store Store to listen to
 * @param {string} actionType Action type to listen for
 * @returns {Promise<StoreBroadcastAction>}
 *
 * @example
 *   async function test() {
 *     const store = new Store({ initialState, actionHandlers });
 *     const storeAction = await awaitStoreEvent(store, "stateUpdated");
 *     console.log(storeAction);
 *   }
 */
export async function awaitStoreEvent<
  State extends object,
  Action extends BasicAction
>(
  store: Store<State, Action>,
  actionType: StoreBroadcastAction<State, Action>["type"]
): Promise<StoreBroadcastAction<State, Action>> {
  let resolve: (action: StoreBroadcastAction<State, Action>) => void;
  let reject: () => void;

  const promise = new Promise<StoreBroadcastAction<State, Action>>(
    (res, rej) => {
      resolve = res;
      reject = rej;
    }
  );

  const cb = store.on(actionType, (e) => {
    resolve(e.action);
    store.off(actionType, cb);
  });

  return promise;
}
