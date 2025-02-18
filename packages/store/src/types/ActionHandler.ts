export interface AsyncActionHandler<State, Action> {
  (
    getState: () => State,
    action: Action,
    commit: (newState: State, cloneDeep?: boolean) => void,
    dispatch?: (action: Action) => void
  ): void;
}

export interface SyncActionHandler<State, Action> {
  (state: State, action: Action): State;
}

export type ActionHandler<State, Action> =
  | SyncActionHandler<State, Action>
  | AsyncActionHandler<State, Action>;
