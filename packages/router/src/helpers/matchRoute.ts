import { parse as defaultParser } from "regexparam";

interface MatchRouteOptions {
  parser?: (
    route: string,
    loose?: boolean
  ) => { keys: string[]; pattern: RegExp };
  loose?: boolean;
}

export const matchRoute = (
  route: string,
  path: string,
  { parser = defaultParser, loose = false }: MatchRouteOptions = {}
) => {
  let mode: "normal" | "not" = "normal";

  if (route[0] === "!") {
    mode = "not";
    route = route.slice(1);
  }
  // if the input is a regexp, skip parsing
  const { pattern, keys } = parser(route);

  // array destructuring loses keys, so this is done in two steps
  const result = pattern.exec(path) || [];

  // when parser is in "loose" mode, `$base` is equal to the
  // first part of the route that matches the pattern
  // (e.g. for pattern `/a/:b` and path `/a/1/2/3` the `$base` is `a/1`)
  // we use this for route nesting
  const [$base, ...matches] = result;

  if (mode === "normal") {
    if ($base !== undefined) {
      return [
        true,

        (() => {
          const groups = Object.fromEntries(
            keys.map((key, i) => [key, matches[i]])
          );

          // convert the array to an instance of object
          // this makes it easier to integrate with the existing param implementation
          const obj = { ...matches };

          // merge named capture groups with matches array
          Object.assign(obj, groups);

          return obj;
        })(),

        // the third value if only present when parser is in "loose" mode,
        // so that we can extract the base path for nested routes
        ...(loose ? [$base] : []),
      ];
    } else {
      return [false, null];
    }
  } else {
    return $base === undefined
      ? [
          true,

          (() => {
            const groups = Object.fromEntries(
              keys.map((key, i) => [key, matches[i]])
            );

            // convert the array to an instance of object
            // this makes it easier to integrate with the existing param implementation
            const obj = { ...matches };

            // merge named capture groups with matches array
            Object.assign(obj, groups);

            return obj;
          })(),

          // the third value if only present when parser is in "loose" mode,
          // so that we can extract the base path for nested routes
          ...(loose ? [$base] : []),
        ]
      : [false, null];
  }
};
