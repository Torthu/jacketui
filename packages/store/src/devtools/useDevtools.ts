import { useEffect } from "react";
import { connectDevtools } from "./connectDevtools";
import { Store } from "../Store";

/** useDevtools
 *
 * Connects a store to the Redux Devtools extension.
 *
 * Will connect devtools on mount and disconnect on unmount.
 *
 * @note This hook requires the Redux Devtools extension to be installed in your browser: {@link https://github.com/reduxjs/redux-devtools}
 *
 * @example
 *  const MyComponent = () => {
 *    const [state, dispatch, store] = useStore([reducer, effect], initialState);
 *    useDevtools(store, { name: "MyStore" });
 *  }
 *
 * @param store The store to connect
 * @param options The options to pass to the Redux Devtools extension
 */
export const useDevtools = (
  store: Store<any, any>,
  options = { name: "JacketUI-Store" }
) => {
  useEffect(() => {
    const disconnect = connectDevtools(store, options);
    return () => {
      disconnect();
    };
  }, []);
};
