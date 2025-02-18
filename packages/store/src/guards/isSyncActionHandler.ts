import { ActionHandler, SyncActionHandler } from "../types/ActionHandler";

export function isSyncActionHandler(
  actionHandler: ActionHandler<any, any>
): actionHandler is SyncActionHandler<any, any> {
  return actionHandler.length === 2;
}
