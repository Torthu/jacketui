import { BringCallbacks, BringInit } from "../types/BringInit";

export const extractCallbacks = (init: BringInit): BringCallbacks => {
  const {
    onSuccess,
    onError,
    onAbort,
    onRetry,
    onTimeout,
    onClientError,
    onServerError,
  } = init;

  return {
    onSuccess,
    onError,
    onAbort,
    onRetry,
    onTimeout,
    onClientError,
    onServerError,
  };
};
