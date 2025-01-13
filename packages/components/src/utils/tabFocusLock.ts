/** tabFocusLock
 * Disables tab focus for any focusable element outside the children of focusLockedElement
 * Will automatically focus the first focusable element in the subtree.
 *
 * @param focusLockedElement { HTMLElement } The HTML element whose subtree you want to lock focus to
 * @param options (optional) { Object }
 * @param options.initialFocusElement (optional) { HTMLElement } The element to initially focus (within the focusLockedElement)
 * @returns { function } unlock Call to unlock focus
 *
 * @example
 *   const unlockFocus = lockFocus(document.getElementById("#someElement"));
 *   // tab-navigation now locked to subtree of "someElement"
 *   unlock();
 *   / tab-navigation now unlocked
 */
export const tabFocusLock = (
  focusLockedElement: HTMLElement,
  { initialFocusElement }: { initialFocusElement?: HTMLElement } = {}
): (() => void) => {
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableContent = focusLockedElement.querySelectorAll(
    focusableElements
  ) as NodeListOf<HTMLElement>;
  const firstFocusableElement: HTMLElement =
    initialFocusElement || focusableContent[0];
  const lastFocusableElement: HTMLElement =
    focusableContent[focusableContent.length - 1];

  const tabCallback = (e: KeyboardEvent) => {
    if (e.key !== "Tab") {
      return;
    }

    if (e.shiftKey) {
      // if shift key pressed for shift + tab combination
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); // add focus for the last focusable element
        e.preventDefault();
      }
    } else {
      // if tab key is pressed
      if (document.activeElement === lastFocusableElement) {
        // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus(); // add focus for the first focusable element
        e.preventDefault();
      }
    }
  };

  document.addEventListener("keydown", tabCallback);

  firstFocusableElement.focus();

  return () => document.removeEventListener("keydown", tabCallback);
};
