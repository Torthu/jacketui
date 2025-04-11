export interface Action<T extends string = string> {
  type: T;
  [key: string]: any;
}

export const isAction = (action: unknown): action is Action => {
  return (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof action.type === "string"
  );
};
