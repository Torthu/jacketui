import { useRef, useState } from "react";
import { Store, ActionHandler, UpdateFunction } from "./Store";
import { md5 } from "./utils";

/**
 *
 * @param actionHandlers
 * @param initialState
 * @returns [State, UpdateFunction<Action>, Store]
 */
export default function useStore<State, Action>(
  actionHandlers: ActionHandler<State, Action>[],
  initialState: State
): [State, UpdateFunction<Action>, Store<State, Action>] {
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
    modelRef?.current?.dispatch as UpdateFunction<Action>,
    modelRef.current,
  ];
}
