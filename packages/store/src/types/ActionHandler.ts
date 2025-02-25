import { AsyncReducer } from "./AsyncReducer";
import { BasicAction } from "./BasicAction";
import { Effect } from "./Effect";
import { Reducer } from "./Reducer";

export type ActionHandler<State extends object, Action extends BasicAction> =
  | Reducer<State, Action>
  | AsyncReducer<State, Action>
  | Effect<State, Action>;
