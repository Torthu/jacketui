import { useRef, useState } from "react";
import Model, { ActionHandler, UpdateFunction } from "./Model";
import { md5 } from "@torthu/jacketui-utils";

export default function useModel<State, Action>(
  actionHandlers: ActionHandler<State, Action>[],
  initialState: State
): [State, UpdateFunction<Action>] {
  const [currentState, setCurrentState] = useState<State>(initialState);
  const modelRef = useRef<Model<State, Action>>();

  if (!modelRef.current) {
    modelRef.current = new Model<State, Action>({
      initialState,
      actionHandlers,
      hashingFunction: md5,
      onStateChanged: (getState) => {
        setCurrentState(getState());
      },
    });
  }

  return [currentState, modelRef?.current?.update as UpdateFunction<Action>];
}
