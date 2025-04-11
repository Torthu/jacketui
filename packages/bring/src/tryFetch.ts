import {
  failure,
  JuiError,
  Result,
  sleep,
  success,
  tryAwait,
} from "@torthu/jacketui-core";
import { BringInit } from "./types/BringInit";

export const tryFetch = async (
  url: string | URL,
  requestInit: RequestInit,
  init: BringInit,
  retryCount = 0
): Promise<Result<Response, JuiError>> => {
  const { error, value } = await tryAwait(fetch(url, requestInit));
  if (error && retryCount < (init.retry ?? 0)) {
    init.onRetry?.(retryCount);
    const backoff = init.backoff?.(retryCount) ?? 0;
    const jitter = init.jitter?.() ?? 0;

    if (backoff + jitter > 0) {
      await sleep(backoff + jitter);
    }
    return await tryFetch(url, requestInit, init, retryCount + 1);
  } else if (error) {
    return failure(error);
  } else {
    return success(value);
  }
};
