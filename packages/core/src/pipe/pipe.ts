import { isPromise } from "../promise";
import { Fn } from "../types/Fn";

/**
 * Copyright (c) 2020, Mathis Bullinger <mathis@bullinger.dev>
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 */

export type MakeProm<T> = Promise<T extends PromiseLike<infer I> ? I : T>;

/**
 * Given a list of functions returns a function that will execute the given
 * functions one after another, always passing the result of the previous
 * function as an argument to the next function.
 *
 * If one of the given functions returns a promise, the promise will be resolved
 * before being passed to the next function.
 *
 * @example
 * ```
 * const join = (...chars: string[]) => chars.join('')
 * pipe(join, parseInt)('1', '2', '3')  // -> 123
 *
 * const square = (n: number) => n ** 2
 *
 * // this is equivalent to: square(square(square(2)))
 * pipe(square, square, square)(2)  // -> 256
 *
 * // also works with promises:
 * fetchNumber :: async () => Promise<number>
 * pipe(fetchNumber, n => n.toString())  // async () => Promise<string>
 * ```
 *
 * @note Vendored from Froebel
 * @author Mathis Bullinger <mathis@bullinger.io>
 * @license ISC
 * @see https://github.com/MathisBullinger/froebel
 */
export const pipe = <T extends [Fn, ...Fn[]]>(
  ...funs: PipeReturn<T> extends never ? never : T
) =>
  ((...args) => {
    let nextArgs: unknown[] = args;

    for (let i = 0; i < funs.length; i++) {
      const [result] = (nextArgs = [funs[i](...nextArgs)]);
      if (isPromise(result)) return resolveAsync(result, funs.slice(i + 1));
    }

    return nextArgs[0];
  }) as PipedFun<T>;

export default pipe;

/**
 * Like `pipe` but takes an argument as its first parameter and invokes the pipe
 * with it.
 *
 * Note: unlike in `pipe`, the first function of the pipe must take exactly one
 * argument.
 *
 * @see {@link pipe}
 *
 * @example
 * ```
 * applyPipe(2, double, square, half)  // -> 8
 * ```
 *
 *
 * @note Vendored from Froebel
 * @author Mathis Bullinger <mathis@bullinger.io>
 * @license ISC
 * @see https://github.com/MathisBullinger/froebel
 */
export const applyPipe = <T extends [Fn<[any], any>, ...Fn[]]>(
  arg: Parameters<T[0]>[0],
  ...funs: PipeReturn<T> extends never ? never : T
): PipeReturn<T> => (pipe(...funs) as any)(arg);

const resolveAsync = async (result: unknown, funs: Fn[]) => {
  for (const fun of funs) result = fun(await result);
  return await result;
};

type PipedFun<T extends Fn[]> = PipeReturn<T> extends never
  ? never
  : (...args: Parameters<T[0]>) => PipeReturn<T>;

type PipeReturn<F extends Fn[]> = CheckPipe<
  F,
  CarryReturn<ReturnTypes<F>, Parameters<F[0]>>
>;

type FunDef = [Return: any, Args: any[]];

type CheckPipe<
  F extends Fn[],
  D extends FunDef[],
  Async extends boolean = false
> = F extends [any, any, ...any[]]
  ? Resolved<D[0][1]> extends Parameters<F[0]>
    ? CheckPipe<
        F extends [any, ...infer F_] ? (F_ extends Fn[] ? F_ : never) : never,
        D extends [any, ...infer D_]
          ? D_ extends FunDef[]
            ? D_
            : never
          : never,
        Async extends true
          ? true
          : ReturnType<F[0]> extends Promise<unknown>
          ? true
          : false
      >
    : never
  : Resolved<D[0][1]> extends Parameters<F[0]>
  ? Async extends true
    ? MakeProm<ReturnType<F[0]>>
    : ReturnType<F[0]>
  : never;

type Resolved<T extends unknown> = {
  [K in keyof T]: T[K] extends Promise<infer I> ? I : T[K];
};

type ReturnTypes<T extends Fn[]> = {
  [K in keyof T]: ReturnType<T[K]>;
};

type CarryReturn<Returns extends any[], Args extends any[]> = Returns extends [
  infer A,
  ...infer B
]
  ? [[A, Args], ...CarryReturn<B, [A]>]
  : [];
