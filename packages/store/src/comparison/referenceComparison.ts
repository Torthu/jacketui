/** referenceComparison(oldState, newState)
 * Simple reference equality comparison.
 * This is the default comparison function.
 * @param {State} oldState
 * @param {State} newState
 * @returns {boolean} is not equal
 */
export const referenceComparison = <State>(
  oldState: State,
  newState: State
): boolean => {
  return oldState !== newState;
};
