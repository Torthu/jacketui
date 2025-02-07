interface RouteProps {
  [key: string]: string | null;
}

/** getParameters
 *  Get route props from a path.
 *
 * @param {string} path
 * @param {RegExp} pattern
 * @param {string[]} keys
 * @returns {RouteProps}
 */
export function getParameters(
  path: string,
  pattern: RegExp,
  keys: string[]
): RouteProps {
  let i = 0;
  let out: Record<(typeof keys)[number], string | null> = {};
  let matches = pattern.exec(path);

  if (!matches) {
    return {};
  }

  while (i < keys.length) {
    out[keys[i]] = matches[++i] || null;
  }

  return out;
}
