import { useEffect, useRef } from "react";

/** useDomEventListener
 * Utility hook to use a DOM eventListener.
 * Wraps the EventTarget.addEventListener / EventTarget.removeEventListener with automatic cleanup on unmount.
 *
 * @param targetElement HTMLElement | Document The target element to listen for events on
 * @param type string
 * @param callback EventListenerOrEventListenerObject
 * @param options optional AddEventListenerOptions | boolean
 *
 * @example
 *   useDomEventListener(document, "mousedown", (e) => console.log(e))
 *
 * @see
 *   https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 */
export const useDomEventListener = (
  targetElement: HTMLElement | Document,
  type: string,
  callback: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean
) => {
  const callbackRef = useRef<EventListenerOrEventListenerObject>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const eventCallback = (e: Event) => {
      const curr = callbackRef.current;

      if (typeof curr === "function") {
        curr(e);
      } else if (typeof curr === "object") {
        curr.handleEvent(e);
      }
    };

    targetElement.addEventListener(type, eventCallback, options);

    return () =>
      targetElement.removeEventListener(type, eventCallback, options);
  }, [targetElement, type, options]);
};
