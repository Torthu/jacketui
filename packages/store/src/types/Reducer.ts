export interface Reducer<State, Action> {
  (state: State, action: Action): State;
}
