type RedirectStatus = 301 | 302 | 303 | 307 | 308;

const redirectMap: Record<RedirectStatus, string> = {
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
};

const redirectSet = new Set(
  Object.keys(redirectMap).map((s) => parseInt(s, 10))
);

export interface RedirectResponse extends Response {
  status: RedirectStatus;
}

export const isRedirectResponse = (res: Response): res is RedirectResponse =>
  redirectSet.has(res.status);
