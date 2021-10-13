import { Knex } from 'knex'
import { juxt } from 'ramda'
import { Tables, users } from '../db'
import { Address, City, User } from '../model'
import { Join } from './joins'
import { IsOrdered, Nats } from './nats'
import { Query } from './query'
import { ComparisonOperator, NonEmptyArray } from './types'

type Pred<T> = {
  column: keyof T
  operator: ComparisonOperator
  value: T[Pred<T>['column']]
}

type ErrorBrand<Err extends string> = Readonly<{
  [key in Err]: void
}>

interface Order<T extends Tables[], N extends keyof Nats> {
  (query: Query<T>): void
  tag?: N
}
type Orders<T extends Tables[]> = Order<T, keyof Nats>[]
type PropEq = <J, K extends keyof J>(column: K, value: J[K]) => Pred<J>
type UnwrapOrder<T> = T extends Order<any, infer N> ? N : never
type UnwrapOrders<T extends Order<any, keyof Nats>[]> = T extends [infer H, ...infer E] ? [UnwrapOrder<H>, ...(E extends NonEmptyArray<Order<any, keyof Nats>> ? UnwrapOrders<E> : [])] : never

type Storm = <T extends Tables[], O extends Orders<T>, OK extends IsOrdered<UnwrapOrders<O>>>(q: Query<T>) => (...pipes: OK extends true ? O : ErrorBrand<'wrong order'>) => Knex.QueryBuilder

type Filter = <T extends Tables[]>(pred: Pred<Join<T>>) => Order<T, 0>
type OrderBy = <T extends Tables[]>(column: keyof Join<T>, desc?: boolean) => Order<T, 3>

/* 
type GroupBy = <T extends Tables[]>(context: any) => Pipe<1>
type Having = <T extends Tables[]>(context: any) => Pipe<2>
type Map = <T extends Tables[]>(context: any) => Pipe<4>
type Reduce = <T extends Tables[]>(context: any) => Pipe<4>
type Save = <T extends Tables[]>(context: any) => Pipe<5>
type Delete = <T extends Tables[]>(context: any) => Pipe<5>
type Select = <T extends Tables[]>(context: any) => Pipe<5>
*/

export const propEq: PropEq = (column, value) => ({
  column: column,
  operator: '=',
  value: value
})

export const filter: Filter = pred => query => {
  const { column, operator, value } = pred
  query.id.where(column, operator, value as any)
}

export const orderBy: OrderBy = (column, desc) => query => {
  query.id.orderBy(column, desc ? 'desc' : 'asc')
}

export const storm: Storm =
  query =>
  (...pipes) => {
    juxt(pipes)(query)
    console.log(query.id.toSQL())
    return query.id
  }

const o = orderBy<[City, Address, User]>('biography', true)
const f = filter<[City, Address, User]>(propEq('city.name', 'stuff'))

type right = IsOrdered<UnwrapOrders<[typeof f, typeof o]>> // true, correct!
type wrong = IsOrdered<UnwrapOrders<[typeof o, typeof f]>> // false, correct!

const wrong1 = storm(users.address.city)(o, f) // ok, incorrect!
const right1 = storm(users.address.city)(f, o) // ok, correct!

const wrong2 = storm(users.address.city)(orderBy('biography', true), filter(propEq('city.name', 'stuff'))) // ok, incorrect!
const right2 = storm(users.address.city)(filter(propEq('age', 770)), orderBy('biography', true)) // ok, correct!
