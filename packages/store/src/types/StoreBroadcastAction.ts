export type OnPreStateChangeAction<State, Action> = {
  type: "preStateChange";
  payload: { fromState: State; toState: State; action: Action };
};

export type OnStateChangedAction<State> = {
  type: "stateChanged";
  payload: { state: State };
};

export type OnDispatchAction<State, Action> = {
  type: "dispatch";
  payload: { state: State; action: Action };
};

export type StoreBroadcastAction<State, Action> =
  | OnPreStateChangeAction<State, Action>
  | OnDispatchAction<State, Action>
  | OnStateChangedAction<State>;
