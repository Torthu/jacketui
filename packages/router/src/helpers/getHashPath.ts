/** getHashPath
 *
 * @param l {Location}
 * @returns string
 */
export const getHashPath = (l: Location): string =>
  l.hash ? l.hash.slice(1) : "/";
