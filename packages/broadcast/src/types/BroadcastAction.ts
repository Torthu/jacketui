/** BroadcastAction
 *  Equivalent to @torthu/jacketui-store BaseAction
 */
export type BroadcastAction<T extends string = string> = {
  type: T;
  [key: string]: any;
};
