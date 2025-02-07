// resolves . and .. elements in a path array with directory names there
// must be no slashes or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
export function normalizeArray(parts: string[]) {
  const res = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];

    // ignore empty parts
    if (!p || p === ".") continue;

    if (p === "..") {
      if (res.length && res[res.length - 1] !== "..") {
        res.pop();
      }
    } else {
      res.push(p);
    }
  }

  return res;
}

// returns an array with empty elements removed from either end of the input
// array or the original array if no elements need to be removed
function trimArray(arr: string[]) {
  var lastIndex = arr.length - 1;
  var start = 0;
  for (; start <= lastIndex; start++) {
    if (arr[start]) break;
  }

  var end = lastIndex;
  for (; end >= 0; end--) {
    if (arr[end]) break;
  }

  if (start === 0 && end === lastIndex) return arr;
  if (start > end) return [];
  return arr.slice(start, end + 1);
}

// path.resolve([from ...], to)
// posix version
export function resolve(...args: string[]) {
  let resolvedAbsolute = false;

  let resolvedPath = args.reverse().reduce((acc, path) => {
    const joined = path + "/" + acc;
    resolvedAbsolute = joined[0] === "/";

    return joined;
  }, "");

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split("/")).join("/");

  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
}

// path.normalize(path)
// posix version
export function normalize(path: string) {
  const isAbsolutePath = isAbsolute(path);
  const trailingSlash = path && path[path.length - 1] === "/";

  // Normalize the path
  path = normalizeArray(path.split("/")).join("/");

  if (!path && !isAbsolute) {
    path = ".";
  }
  if (path && trailingSlash) {
    path += "/";
  }

  return (isAbsolutePath ? "/" : "") + path;
}

// posix version
function isAbsolute(path: string) {
  return path.charAt(0) === "/";
}

// posix version
export function join(...args: string[]) {
  const joinedPath = args.reduce((path, segment) => {
    if (segment) {
      if (!path) {
        path += segment;
      } else {
        path += "/" + segment;
      }
    }
    return path;
  }, "");
  return normalize(joinedPath);
}

// path.relative(from, to)
// posix version
export function relative(from: string, to: string) {
  from = resolve(from).slice(1);
  to = resolve(to).slice(1);

  var fromParts = trimArray(from.split("/"));
  var toParts = trimArray(to.split("/"));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push("..");
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join("/");
}
