/** debounce
 * Debounce function to limit the number of calls to a function.
 * This is useful for functions that are called frequently, such as
 * event handlers.
 *
 * @param callback - The function to be called after the debounce limit.
 * @param limit - The time in milliseconds to wait before calling the function.
 * @returns A function that will call the callback function after the limit.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = <CBType extends Function>(
  callback: CBType,
  limit: number
) => {
  let timer: number;
  return function (this: unknown, ...args: unknown[]) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback.apply(this, args);
    }, limit);
  };
};
