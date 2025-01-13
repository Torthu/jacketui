/**
 * Whether no-scroll is currently enabled
 */
let isEnabled = false;

/**
 * Cached size of scrollbar
 */
let scrollbarWidth: number;

/**
 * Cached Y Offset (to ensure we end up at the same place when disabling)
 */
let pageYOffset = 0;

/** getScrollbarSize
 * Get the size of the scrollbar.
 * Uses a dummy element's offset to calculate the size of the actual scrollbar.
 *
 * @returns number (in px)
 *
 * @example
 *   getScrollbarSize(); // 17
 */
export const getScrollbarWidth = () => {
  if (typeof scrollbarWidth === "number") return scrollbarWidth;

  const dummyElement = document.createElement("div");
  dummyElement.style.cssText =
    "overflow:scroll; visibility:hidden; position:absolute;";
  document.body.appendChild(dummyElement);
  scrollbarWidth = dummyElement.offsetWidth - dummyElement.clientWidth;
  document.removeChild(dummyElement);
  return scrollbarWidth;
};

/** enableNoScroll
 *
 * @returns void
 */
export const enableNoScroll = () => {
  if (isEnabled) return;

  pageYOffset = window.scrollY;
  const docStyle = document.documentElement.style;

  docStyle.width = `calc(100% - ${getScrollbarWidth()}px)`;
  docStyle.position = "fixed";
  docStyle.top = `-${pageYOffset}px`;
  docStyle.overflow = "hidden";

  isEnabled = true;
};

/** disableNoScroll
 *
 * @returns void
 */
export const disableNoScroll = () => {
  if (!isEnabled) return;

  const docStyle = document.documentElement.style;
  docStyle.width = "";
  docStyle.position = "";
  docStyle.top = "";
  docStyle.overflow = "";
  window.scroll(0, pageYOffset);

  isEnabled = false;
};

/** toggleNoScroll
 *
 * @returns void
 */
export const toggleNoScroll = () =>
  isEnabled ? disableNoScroll() : enableNoScroll();

/** noScrollEnabled
 *
 * @returns boolean
 */
export const noScrollEnabled = () => isEnabled;
