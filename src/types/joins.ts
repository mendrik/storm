import { NameOf, Tables } from '../db'
import { Head, KeysOfUnion, Length, Reverse, Tail, TupleToUnion, Unboxed } from './types'

type RenameSameKeys<H, T extends any[]> = {
  [K in keyof H as K extends KeysOfUnion<TupleToUnion<T>> & string ? `${Lowercase<NameOf<H>>}.${K}` : never]: H[K]
}
type PrimitiveTuple<T> = { [K in keyof T as Unboxed<T[K]> extends Tables ? never : K]: T[K] }
type JoinLoop<T extends any[], L = Length<T>> = L extends 0 ? {} : L extends 1 ? T[0] : Join$<T>
type Join$<J extends any[], H = Head<J>, Rename = RenameSameKeys<H, Tail<J>>> = Rename & PrimitiveTuple<H> & JoinLoop<Tail<J>>
export type Join<T extends Tables[]> = PrimitiveTuple<Join$<T>>

