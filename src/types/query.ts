import { Knex } from 'knex'
import { Head, Prepend, Reverse, Unboxed, UnionToTuple } from './types'
import { Tables } from '../db'

type CastArray<T> = T extends any[] ? T : []

type Relations<C extends Tables[], T = Head<C>> = {
  [K in keyof T as Unboxed<T[K]> extends Tables ? K : never]: Query<CastArray<Prepend<Unboxed<T[K]>, C>>>
}

export type Query<C extends Tables[]> = {
  id: Knex.QueryBuilder
} & Relations<C>

export type J<X> = X extends Query<infer U> ? Reverse<U> : never
