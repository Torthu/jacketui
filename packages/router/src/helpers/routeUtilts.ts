const history = window.history;

interface Options {
  scrollRestoration?: boolean;
  linkText?: string;
}

const emitEvent = (oldURL: string, newURL: string) => {
  const event = new HashChangeEvent("hashchange", { oldURL, newURL });
  window.dispatchEvent(event);
};

/** go
 * Go to new URL, wraps History.pushState()
 * @param to Location to go to, e.g ("/page/2")
 * @param options
 *
 * @example
 *   go("/some/page", {scrollRestoration: "auto"});
 */
export const go = (to: string, options?: Options): void => {
  if (typeof options?.scrollRestoration === "boolean") {
    history.scrollRestoration = options.scrollRestoration ? "auto" : "manual";
  }

  const oldUrl = location.href;
  history.pushState({}, options?.linkText ?? "", "#" + to);
  const newUrl = location.href;

  emitEvent(oldUrl, newUrl);
};

/** replace
 * Replace current history item, wraps History.replaceState()
 * @param to Location to replace with, e.g ("/page/2")
 * @param options
 */
export const replace = (to: string, options?: Options): void => {
  if (typeof options?.scrollRestoration === "boolean") {
    history.scrollRestoration = options.scrollRestoration ? "auto" : "manual";
  }
  history.replaceState({}, options?.linkText ?? "", "#" + to);
};

/**
 * Go backwards in history stack
 * @param num (optional) number of history states to go backwards
 */
export const back = (num?: number): void => {
  if (typeof num !== "undefined") {
    history.go(-1 * num);
  } else {
    history.back();
  }
};

/**
 * Go forward in history stack
 * @param num (optional) number of history states to go forward
 */
export const forward = (num?: number): void => {
  if (typeof num !== "undefined") {
    history.go(num);
  } else {
    history.forward();
  }
};

const hasParameter = (path: string) => path.match(/:\w+/);

interface RouteParam {
  [key: string]: string;
}

/**
 * Get parameters from a potential path
 * @param path string: the path to match against (e.g /foo/buz)
 * @param routePath string: a route path (e.g /foo/:bar)
 */
export const getParameters = (path: string, routePath: string): RouteParam => {
  const parts = path.split("/");
  const routeparts = routePath.split("/");
  const params: RouteParam = {};
  parts.forEach((p, i) => {
    if (p[0] === ":") {
      params[p.slice(1)] = routeparts[i];
    }
  });

  return params;
};

/**
 * @fixme Support glob patterns? use path-to-regexp?
 * @param routePath
 * @param path
 * @returns
 */
export const matchRoute = (routePath: string, path: string): boolean => {
  path = maybeAppendSlash(path);
  routePath = maybeAppendSlash(routePath);

  const splitPath = path.split("/");
  const splitRoutePath = routePath.split("/");

  if (splitPath.length < splitRoutePath.length) {
    console.log(`match ${routePath} ${path} false`);
    return false;
  }

  const wildcard = splitRoutePath.indexOf("*");

  if (wildcard < 0 && splitPath.length !== splitRoutePath.length) {
    console.log(`match ${routePath} ${path} false`);
    return false;
  }

  const splitPathSubset = splitPath.splice(
    0,
    wildcard > -1 ? wildcard : splitPath.length - 1
  );

  let match: boolean = true;

  for (let i = 0; i < splitPathSubset.length; i++) {
    if (
      !(
        splitRoutePath[i][0] === ":" || splitPathSubset[i] === splitRoutePath[i]
      )
    ) {
      match = false;
      break;
    }
  }

  console.log(`match ${routePath} ${path} ${match}`);
  return match;
};

export const maybeAppendSlash = (path: string): string =>
  path.endsWith("/") ? path : path + "/";

export const matchRoute2 = (path: string, routePath: string): boolean => {
  path = maybeAppendSlash(path);
  routePath = maybeAppendSlash(routePath);

  if (hasParameter(path)) {
    const params = getParameters(path, routePath);
    const testpath = path
      .split("/")
      .map((p) => (params[p.slice(1)] ? params[p.slice(1)] : p))
      .join("/");

    return routePath === testpath;
  }

  return path === routePath;
};

/** getHashPath
 *
 * @param l {Location}
 * @returns string
 */
export const getHashPath = (l: Location): string =>
  l.hash ? l.hash.slice(1) : "/";
