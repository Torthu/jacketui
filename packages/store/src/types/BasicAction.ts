export interface BasicAction<T extends string = string> {
  type: T;
  [key: string]: any;
}
