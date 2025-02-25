import { Store } from "..";
import { BasicAction } from "../types";

/** awaitDispatchActionType(store, type)
 *  Wait for an action of type to be dispatched to the store.
 *
 * @param {Store} store Store to listen to
 * @param {string} actionType Action type to listen for
 * @returns {Promise<Action>}
 *
 * @example
 *   async function test() {
 *     const store = new Store({ initialState, actionHandlers });
 *     const action = await awaitDispatchActionType(store, "TEST");
 *     console.log(action);
 *   }
 */
export async function awaitDispatchActionType<
  State extends object,
  Action extends BasicAction
>(store: Store<State, Action>, actionType: Action["type"]): Promise<Action> {
  let resolve: (action: Action) => void;
  let reject: () => void;

  const promise = new Promise<Action>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const cb = store.on("dispatch", (e) => {
    if (e.action.type === "dispatch") {
      if (e.action.payload.action.type === actionType) {
        resolve(e.action.payload.action);
        store.off("dispatch", cb);
      }
    }
  });

  return promise;
}
