export type Fn<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Return;
