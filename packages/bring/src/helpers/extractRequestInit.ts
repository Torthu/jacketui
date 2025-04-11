import { BringInit, RequestInit } from "../types/BringInit";

export const extractRequestInit = (init: BringInit): RequestInit => {
  const {
    method,
    headers,
    body,
    mode,
    credentials,
    cache,
    redirect,
    referrer,
    referrerPolicy,
    integrity,
    keepalive,
  } = init;
  return {
    method,
    headers,
    body,
    mode,
    credentials,
    cache,
    redirect,
    referrer,
    referrerPolicy,
    integrity,
    keepalive,
  };
};
