/**
 * Simple reference equality comparison
 * @param {State} oldState
 * @param {State} newState
 * @returns {boolean} is equal
 */
export const referenceComparison = <State>(
  oldState: State,
  newState: State
): boolean => {
  return oldState !== newState;
};
