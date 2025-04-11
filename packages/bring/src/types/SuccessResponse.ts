type KnownSuccessStatus =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226;

const knownSuccessStatusMap = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
};

const unknownSuccessStatusText = "Unknown Success";

const knownSuccessStatusSet = new Set(
  Object.keys(knownSuccessStatusMap).map((s) => parseInt(s, 10))
);

export interface KnownSuccessResponse extends Response {
  status: KnownSuccessStatus;
}

export const isKnownSuccessResponse = (
  res: Response
): res is KnownSuccessResponse => knownSuccessStatusSet.has(res.status);

export interface UnknownSuccessResponse extends Response {
  status: number;
}

export const isUnknownSuccessResponse = (
  res: Response
): res is UnknownSuccessResponse =>
  res.status >= 200 && res.status < 300 && !isKnownSuccessResponse(res);

export type SuccessResponse = KnownSuccessResponse | UnknownSuccessResponse;

export const isSuccessResponse = (res: Response): res is SuccessResponse =>
  res.status >= 200 && res.status < 300;

export const getSuccessStatusText = (res: SuccessResponse): string =>
  isKnownSuccessResponse(res)
    ? knownSuccessStatusMap[res.status]
    : unknownSuccessStatusText;
