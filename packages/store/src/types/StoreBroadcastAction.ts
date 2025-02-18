export type OnPreDataChangedAction<State, Action> = {
  type: "preDataChanged";
  payload: { state: State; action: Action };
};

export type OnDataChangedAction = {
  type: "dataChanged";
};

export type StoreBroadcastAction<State, Action> =
  | OnPreDataChangedAction<State, Action>
  | OnDataChangedAction;
