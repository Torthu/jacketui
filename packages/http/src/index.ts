export * from "./HttpClient";
export * from "./errors";
export * from "./types/InFlight";

import { HttpClient } from "./HttpClient";

const clientInstance = new HttpClient();

export const fetch = clientInstance.fetch;
export const abort = clientInstance.abort;
export const getInFlight = clientInstance.getInFlight;
export const getRequest = clientInstance.getRequest;
export const wasAborted = HttpClient.wasAborted;
export const wasTimeout = HttpClient.wasTimeout;
