import { Store } from "../Store";
import { BasicAction } from "./BasicAction";

interface EffectProps<State extends object, Action extends BasicAction> {
  action: Action;
  getState: Store<State, Action>["getState"];
  setState: Store<State, Action>["setState"];
  dispatch: Store<State, Action>["dispatch"];
  on: Store<State, Action>["on"];
  off: Store<State, Action>["off"];
}

export interface Effect<State extends object, Action extends BasicAction> {
  (props: EffectProps<State, Action>): void | Promise<void>;
}
