export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }
export type Head<T extends readonly unknown[]> = T[0]
export type Last<T extends readonly unknown[]> = T extends readonly [...infer _, infer U] ? U : undefined
export type Tail<T extends readonly unknown[]> = T extends [unknown, ...infer TailType] ? TailType : never
export type Length<T extends readonly unknown[]> = T['length']

export type Prepend<I, T extends unknown[]> = [I, ...T]
export type Append<I, T extends unknown[]> = [...T, I]
export type AddBetween<I, T extends unknown[], U extends unknown[]> = [...T, I, ...U]
export type TypeEqual<T, U> = T extends U ? (U extends T ? true : false) : false
export type TupleToUnion<T extends readonly any[]> = T[number]
export type KeysOfUnion<T> = T extends T ? keyof T : never

export type ComparisonOperator = '=' | '>' | '>=' | '<' | '<=' | '<>'
export type Reverse<Tuple extends readonly unknown[]> = Tuple extends [infer Head, ...infer Rest] ? [...Reverse<Rest>, Head] : []

export type Cast<X, Y> = X extends Y ? X : Y
export type Unboxed<T> = T extends (infer U)[] ? U : T

export type Fn<T, R> = (t1: T) => R
export type Fn2<T1, T2, R> = (t1: T1, t2: T2) => R

export type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never
export type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W ? [...UnionToTuple<Exclude<T, W>>, W] : []
export type ExpandRecursively<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T
export type NonEmptyArray<T> = [T, ...T[]]
