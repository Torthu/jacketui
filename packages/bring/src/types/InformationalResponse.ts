type InformationalResponseStatus = 100 | 101 | 102 | 103;

const informationalResponseMap: Record<InformationalResponseStatus, string> = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
};

const informationalResponseSet = new Set(
  Object.keys(informationalResponseMap).map((s) => parseInt(s, 10))
);

export interface InformationalResponse extends Response {
  status: InformationalResponseStatus;
}

export const isInformationalResponse = (
  res: Response
): res is InformationalResponse => informationalResponseSet.has(res.status);
