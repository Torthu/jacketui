const history = window.history;

interface Options {
  scrollRestoration?: "auto" | "manual" | boolean;
  data?: any;
}

const emitEvent = (oldURL: string, newURL: string) => {
  const event = new HashChangeEvent("hashchange", { oldURL, newURL });
  window.dispatchEvent(event);
};

/** **go**(to, options)
 *
 * Go to new URL, wraps History.pushState()
 *
 * @param {string} to Location to go to, e.g ("/page/2")
 * @param {Object} [options] { scrollRestoration: boolean, linkText: string }
 * @param {string} [options.scrollRestoration] whether to restore scroll position automatically
 * @param {any} [options.data=null] data to store in the history state
 *
 * @example
 *   go("/some/page", {scrollRestoration: "auto"});
 *   go("/some/page", {scrollRestoration: "manual"});
 *   go("/some/page", {data: {some: "data"}});
 *   go("/some/page", {scrollRestoration: "auto", data: {some: "data"}});
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
 */
export const go = (
  to: string,
  { scrollRestoration, data = null }: Options = {}
): void => {
  if (typeof scrollRestoration === "boolean") {
    history.scrollRestoration = scrollRestoration ? "auto" : "manual";
  } else if (typeof scrollRestoration === "string") {
    history.scrollRestoration = scrollRestoration;
  }

  const oldUrl = location.href;
  history.pushState(data, "", "#" + to);
  const newUrl = location.href;

  emitEvent(oldUrl, newUrl);
};

/** **replace**(to, options)
 *
 * Replace current history item, wraps History.replaceState()
 *
 * @param {string} to Location to replace with, e.g ("/page/2")
 * @param {Object} [options] { scrollRestoration: boolean, linkText: string }
 * @param {string} [options.scrollRestoration] whether to restore scroll position automatically
 * @param {any} [options.data=null] data to store in the history state
 *
 * @example
 *  replace("/some/page");
 *  replace("/some/page", {scrollRestoration: "auto"});
 *  replace("/some/page", {data: {some: "data"}});
 *  replace("/some/page", {scrollRestoration: "auto", data: {some: "data"}});
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
 */
export const replace = (
  to: string,
  { scrollRestoration, data = null }: Options = {}
): void => {
  if (typeof scrollRestoration === "boolean") {
    history.scrollRestoration = scrollRestoration ? "auto" : "manual";
  } else if (typeof scrollRestoration === "string") {
    history.scrollRestoration = scrollRestoration;
  }

  const oldUrl = location.href;
  history.replaceState(data, "", "#" + to);
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
