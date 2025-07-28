/** hashComparison(hash) => (oldState, newState) => boolean
 *  Util for creating hash comparison functions.
 *
 * @param hashFunction
 * @returns comparison function
 */
export const hashComparison = <State>(hash: (state: State) => string) => {
  let cachedHash = "";
  return (oldState: State, newState: State): boolean => {
    const newDataHash = hash(newState);
    const oldDataHash = cachedHash ?? hash(oldState);

    if (oldDataHash === "" || oldDataHash !== newDataHash) {
      cachedHash = newDataHash;
      return true;
    } else {
      return false;
    }
  };
};
