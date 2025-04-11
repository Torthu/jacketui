import { BringInit } from "./BringInit";

export interface BringInitDecorator {
  (init: BringInit): BringInit;
}
