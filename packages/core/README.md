# JacketUI Core

Utilities and utility types.

## Result<T, E>

Result type: Success<T> | Failure<E>

```
const someResult = (): Result<string, string> => {
  Math.random() > 0.5 ? success("some value") : failure("some error");
}

const result = someResult();
if (result.ok) {
  console.log(result.value);
} else {
  console.log(result.error);
}
```

## pipe()

Simple function composition utility.

```
const join = (...chars: string[]) => chars.join("");
const joinStringToInt = pipe(join, parseInt);
const val = joinStringToInt("1", "2", "3"); // -> 123
```

## memo()

Simple function memoization utility.

## JuiError

A custom error class for use in JacketUI projects.

- errorToJuiError(val: unknown) transforms values into JuiError instances.
