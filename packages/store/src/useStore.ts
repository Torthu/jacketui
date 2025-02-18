import { useRef, useState } from "react";
import { Store } from "./Store";
import { BasicAction, ActionHandler, Dispatch } from "./types";

/** useStore(actionHandlers, initialState)
 *  Hook for using a Store.
 *
 * @param {ActionHandler[]} actionHandlers
 * @param {State} initialState
 * @returns [State, Dispatch<Action>, Store]
 */
export function useStore<State extends object, Action extends BasicAction>(
  actionHandlers: ActionHandler<State, Action>[],
  initialState: State
): [State, Dispatch<Action>, Store<State, Action>] {
  const [currentState, setCurrentState] = useState<State>(initialState);

  const modelRef = useRef<Store<State, Action>>(
    new Store<State, Action>({
      initialState,
      actionHandlers,
      onStateChanged: (getState) => {
        setCurrentState(getState());
      },
    })
  );

  return [
    currentState,
    modelRef?.current?.dispatch as Dispatch<Action>,
    modelRef.current,
  ];
}
