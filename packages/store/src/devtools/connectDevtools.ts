import { Store } from "../Store";

const defaultOptions = {
  features: {
    pause: true, // start/pause recording of dispatched actions
    lock: false, // lock/unlock dispatching actions and side effects
    export: false, // export history of actions in a file
    import: false, //"custom", // import history of actions from a file
    jump: true, // jump back and forth (time travelling)

    skip: false, // Cannot skip for we cannot replay.
    reorder: false, // Cannot skip for we cannot replay.

    persist: false, // Avoid trying persistence.
    dispatch: true,
    test: false, // Need custom test.
  },
};

let connections: Record<string, any> = {};

/** connectDevtools
 *
 *  Connects a store to the Redux Devtools extension
 *
 * @note This hook requires the Redux Devtools extension to be installed in your browser: {@link https://github.com/reduxjs/redux-devtools}
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
  store: Store<any, any>,
  options = { name: "JacketUI-Store" }
) => {
  if (!connections[options.name]) {
    let initialState = store.getState();
    let committedState = store.getState();

    const devToolsConnection = (
      window as any
    ).__REDUX_DEVTOOLS_EXTENSION__.connect({
      ...defaultOptions,
      ...options,
    });

    devToolsConnection.init(initialState);

    connections[options.name] = {
      initialState,
      committedState,
      connection: devToolsConnection,
    };
  }

  const connection = connections[options.name];

  const preDataChangedListener = store.onPreDataChanged((state, action) => {
    try {
      connection.connection.send(action, state);
    } catch (e) {
      console.log(e);
    }
  });

  const unsubscribe = connection?.connection?.subscribe?.((message: any) => {
    try {
      if (message.type === "START") {
        connection.connection.init(connection.initialState);
      } else if (message.type === "DISPATCH") {
        switch (message.payload?.type) {
          case "RESET":
            store.setState(connection.initialState);
            break;
          case "ROLLBACK":
            store.setState(JSON.parse(message.state));
            break;
          case "JUMP_TO_ACTION":
            store.setState(JSON.parse(message.state));
            break;
          case "COMMIT":
            connection.committedState = store.getState();
            connection.connection.init(connection.committedState);
            break;
          default:
            console.log(
              "DISPATCH message not handled:",
              message.payload.type,
              message
            );
        }
      } else if (message.type === "ACTION") {
        const messageAction = JSON.parse(message.payload);
        store.dispatch(messageAction);
      } else {
        console.warn("message not handled:", message.type, message);
      }
    } catch (e) {
      console.log(e);
    }
  });

  return () => {
    unsubscribe();
    store.offPreDataChanged(preDataChangedListener);
  };
};
