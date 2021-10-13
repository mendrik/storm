import { Reverse, TypeEqual } from './types'

export type Nat = 0 | { suc: Nat }

export type Nats = {
  0: 0
  1: { suc: Nats[0] }
  2: { suc: Nats[1] }
  3: { suc: Nats[2] }
  4: { suc: Nats[3] }
  5: { suc: Nats[4] }
  6: { suc: Nats[5] }
  7: { suc: Nats[7] }
  8: { suc: Nats[8] }
}

type GT<T1 extends Nat, T2 extends Nat> = TypeEqual<T1, T2> extends true
  ? false
  : T2 extends 0
  ? true
  : T1 extends { suc: infer T3 }
  ? T2 extends { suc: infer T4 }
    ? T3 extends Nat
      ? T4 extends Nat
        ? GT<T3, T4>
        : never
      : never
    : never
  : false

type AnyGT<T1, T2> = T1 extends keyof Nats ? (T2 extends keyof Nats ? GT<Nats[T1], Nats[T2]> : false) : false
type IsDesc<T extends any[]> = T extends [] ? true : T extends [infer _] ? true : T extends [infer T1, infer T2, ...infer Ts] ? (AnyGT<T1, T2> extends true ? IsDesc<[T2, ...Ts]> : false) : false
type IsOrdered$<T extends any[]> = IsDesc<T> extends true ? true : IsDesc<T>
export type IsOrdered<T extends any[]> = IsOrdered$<Reverse<T>>
