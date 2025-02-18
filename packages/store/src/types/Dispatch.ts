import { BasicAction } from "./BasicAction";

export interface Dispatch<Action extends BasicAction> {
  (action: Action): void;
}
