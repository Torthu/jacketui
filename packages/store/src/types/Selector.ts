export type Selector<
  State extends object,
  Filters extends unknown[],
  ViewState
> = (state: State, ...filters: Filters) => ViewState;
