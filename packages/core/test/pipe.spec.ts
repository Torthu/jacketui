import { pipe } from "../src/pipe";
import { describe, it, expect } from "vitest";

describe("pipe", () => {
  it("should pipe functions", () => {
    const join = (...chars: string[]) => chars.join("");
    const val = pipe(join, parseInt)("1", "2", "3"); // -> 123
    expect(val).toBe(123);
  });
  it("should pipe functions", () => {
    const square = (n: number) => n ** 2;
    const val = pipe(square, square, square)(2); // -> 256
    expect(val).toBe(256);
  });
});
