export type BemFunction<T> = (modifiers?: T, mixes?: string[]) => string;

export interface ComposeFunction {
  <T>(fn: BemFunction<T>): BemFunction<T>;
  <T1, T2>(fn1: BemFunction<T1>, fn2: BemFunction<T2>): BemFunction<T1 & T2>;
  <T1, T2, T3>(fn1: BemFunction<T1>, fn2: BemFunction<T2>, fn3: BemFunction<T3>): BemFunction<
    T1 & T2 & T3
  >;
  <T1, T2, T3, T4>(
    fn1: BemFunction<T1>,
    fn2: BemFunction<T2>,
    fn3: BemFunction<T3>,
    fn4: BemFunction<T4>
  ): BemFunction<T1 & T2 & T3 & T4>;
  <T1, T2, T3, T4, T5>(
    fn1: BemFunction<T1>,
    fn2: BemFunction<T2>,
    fn3: BemFunction<T3>,
    fn4: BemFunction<T4>,
    fn5: BemFunction<T5>
  ): BemFunction<T1 & T2 & T3 & T4 & T5>;
  (...fns: BemFunction<any>[]): BemFunction<any>;
}
