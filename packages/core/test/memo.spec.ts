import { memo } from "../src";

import { describe, expect, it, vi } from "vitest";

describe("memo", () => {
  it("should memoize a function", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memo(fn);
    memoized(1, 2);
    memoized(1, 2);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it("should call the function again for different arguments", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memo(fn);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should return the same result for the same arguments", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memo(fn);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should check for property equality and not reference equality", () => {
    const object = { a: 1, b: 2 };
    const equalObject = { a: 1, b: 2 };

    const fn = vi.fn((a: object) => a);
    const memoized = memo(fn);
    expect(memoized(object)).toBe(object);
    expect(memoized(equalObject)).toBe(object);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
