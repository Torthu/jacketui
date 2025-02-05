/** joinRoutePaths
 * Join paths in order to match subroutes
 *
 *  @param {string} root
 *  @param {string} path
 *  @return {string} joined
 */
export const joinRoutePaths = (root: string, path: string) => {
  // CASE: path is from root
  if (path[0] === "~") {
    return path[1];
  }

  // CASE: root path is a not, we need to ignore the root path for children

  if (root !== "") {
    const splitRoot = root.split("/");
    const splitPath = path.split("/");

    // Ignore root if the root path is a negated path
    if (root[0] === "!") {
      return splitPath.filter((n) => n).join("/");
    }

    if (splitRoot[splitRoot.length - 1] === "**") {
      splitRoot.pop();
    }

    if (splitPath[0] === "**") {
      splitPath.shift();
    }

    return splitRoot
      .concat(splitPath)
      .filter((n) => n)
      .join("/");
  }

  return path;
};
