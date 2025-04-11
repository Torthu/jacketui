type ServerErrorStatus =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511
  | 520
  | 521
  | 522
  | 523
  | 524
  | 525
  | 526
  | 527
  | 530;

const serverStatusErrorMap: Record<ServerErrorStatus, string> = {
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
  520: "Unknown Error",
  521: "Web Server Is Down",
  522: "Connection Timed Out",
  523: "Origin Is Unreachable",
  524: "A Timeout Occurred",
  525: "SSL Handshake Failed",
  526: "Invalid SSL Certificate",
  527: "Railgun Error",
  530: "Site Is Frozen",
};

const serverStatusErrorSet = new Set(
  Object.keys(serverStatusErrorMap).map((s) => parseInt(s, 10))
);

export interface ServerErrorResponse extends Response {
  status: ServerErrorStatus;
}

export const isServerErrorResponse = (
  res: Response
): res is ServerErrorResponse => serverStatusErrorSet.has(res.status);
