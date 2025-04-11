import { describe, expect, it } from "vitest";
import { errorToJuiError, JuiError } from "../src";

describe("errorToJuiError", () => {
  it("should return a JuiError", () => {
    const error = new Error("error");
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.message).toBe("error");
  });
  it("should return a JuiError with a message", () => {
    const error = new Error("error");
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.message).toBe("error");
  });
  it("should return a JuiError with a stack", () => {
    const error = new Error("error");
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.cause).toBe(error);
  });
  it("should convert a string to a JuiError", () => {
    const error = "error";
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.message).toBe(error);
  });
  it("should convert a number to a JuiError", () => {
    const error = 1;
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.context?.value).toBe(error);
    expect(juiError.context?.type).toBe(typeof error);
  });
  it("should convert a boolean to a JuiError", () => {
    const error = true;
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.context?.value).toBe(error);
    expect(juiError.context?.type).toBe(typeof error);
  });
  it("should convert a null to a JuiError", () => {
    const error = null;
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.context?.value).toBe(error);
    expect(juiError.context?.type).toBe(typeof error);
  });
  it("should convert a undefined to a JuiError", () => {
    const error = undefined;
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.context?.value).toBe(error);
    expect(juiError.context?.type).toBe(typeof error);
  });
  it("should convert a symbol to a JuiError", () => {
    const error = Symbol("error");
    const juiError = errorToJuiError(error);
    expect(juiError).toBeInstanceOf(JuiError);
    expect(juiError.context?.value).toBe(error.toString());
    expect(juiError.context?.type).toBe(typeof error);
  });
});
