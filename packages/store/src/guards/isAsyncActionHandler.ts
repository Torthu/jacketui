import { ActionHandler, AsyncActionHandler } from "../types/ActionHandler";

export function isAsyncActionHandler(
  actionHandler: ActionHandler<any, any>
): actionHandler is AsyncActionHandler<any, any> {
  return actionHandler.length >= 3;
}
