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
  const oldUrl = location.href;
  history.replaceState({}, options?.linkText ?? "", "#" + to);
  const newUrl = location.href;
  emitEvent(oldUrl, newUrl);
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
