export interface AsyncReducer<State, Action> {
  (
    getState: () => State,
    action: Action,
    commit: (newState: State, cloneDeep?: boolean) => void
  ): void | Promise<void>;
}
