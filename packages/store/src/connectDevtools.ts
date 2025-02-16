import { Store } from "./Store";
import * as ReduxDevTools from "@redux-devtools/extension";

/** connectDevtools
 *  Connects a store to the Redux Devtools extension
 *
 * @param store The store to connect
 * @returns [unsubscribe] A function to disconnect the store
 *
 * @example
 *   const store = new Store({ initialState, actionHandlers });
 *   const unsubscribe = connectDevtools(store);
 *   store.update({ type: "INCREMENT" });
 */
export const connectDevtools = (
  store: Store<unknown, unknown>,
  options: ReduxDevTools.Config = {}
) => {
  const connection = (window as any).__REDUX_DEVTOOLS_EXTENSION__!.connect(
    options
  );

  connection.subscribe((message) => {
    if (message.type === "DISPATCH" && message.state) {
      store.setState(JSON.parse(message.state));
    }
  });

  connection.init(store.getState());

  const preDataChangedListener = store.onPreDataChanged((state, action) => {
    connection.send(action, state);
  });

  const dataChangedListener = store.onDataChanged(() => {
    connection.send(store.getState());
  });

  return () => {
    connection.unsubscribe();
    store.offPreDataChanged(preDataChangedListener);
    store.offDataChanged(dataChangedListener);
  };
};
