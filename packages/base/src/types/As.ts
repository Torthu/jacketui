import { DomStringElement } from "./DomStringElement";

export type As<DomStringType = DomStringElement> =
  | React.ComponentType<any>
  | DomStringType;
