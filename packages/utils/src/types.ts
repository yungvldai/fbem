export type BemFunction<T> = (modifiers?: T, mixes?: (string | undefined)[]) => string;

type Merge<T, U> = {
  [K in keyof T | keyof U]?: K extends keyof T & keyof U
    ? (U | T)[K]
    : K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never;
};

type Merge3<T, U, V> = Merge<T, Merge<U, V>>;
type Merge4<T, U, V, W> = Merge<Merge<T, U>, Merge<V, W>>;

export interface ComposeFunction {
  <T>(fn: BemFunction<T>): BemFunction<T>;
  <T1, T2>(fn1: BemFunction<T1>, fn2: BemFunction<T2>): BemFunction<Merge<T1, T2>>;
  <T1, T2, T3>(fn1: BemFunction<T1>, fn2: BemFunction<T2>, fn3: BemFunction<T3>): BemFunction<
    Merge3<T1, T2, T3>
  >;
  <T1, T2, T3, T4>(
    fn1: BemFunction<T1>,
    fn2: BemFunction<T2>,
    fn3: BemFunction<T3>,
    fn4: BemFunction<T4>
  ): BemFunction<Merge4<T1, T2, T3, T4>>;
  <T1, T2, T3, T4, T5>(
    fn1: BemFunction<T1>,
    fn2: BemFunction<T2>,
    fn3: BemFunction<T3>,
    fn4: BemFunction<T4>,
    fn5: BemFunction<T5>
  ): BemFunction<Merge<Merge<T1, T2>, Merge3<T3, T4, T5>>>;
  <T1, T2, T3, T4, T5, T6>(
    fn1: BemFunction<T1>,
    fn2: BemFunction<T2>,
    fn3: BemFunction<T3>,
    fn4: BemFunction<T4>,
    fn5: BemFunction<T5>,
    fn6: BemFunction<T6>
  ): BemFunction<Merge<Merge3<T1, T2, T3>, Merge3<T4, T5, T6>>>;
  <T1, T2, T3, T4, T5, T6, T7>(
    fn1: BemFunction<T1>,
    fn2: BemFunction<T2>,
    fn3: BemFunction<T3>,
    fn4: BemFunction<T4>,
    fn5: BemFunction<T5>,
    fn6: BemFunction<T6>,
    fn7: BemFunction<T7>
  ): BemFunction<Merge<Merge3<T1, T2, T3>, Merge4<T4, T5, T6, T7>>>;
  (...fns: BemFunction<any>[]): BemFunction<any>;
}
