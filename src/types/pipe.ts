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

interface Order<T extends Tables[], N extends keyof Nats> {
  (query: Query<T>): void
  tag?: N
}

type Orders<T extends Tables[]> = Order<T, keyof Nats>[]
type PropEq = <J extends any, K extends keyof J>(column: K, value: J[K]) => Pred<J>
type UnwrapOrders<O extends Orders<any>> = { [K in keyof O]: O[K] extends Order<any, infer N> ? N : never }

type Filter = <T extends Tables[]>(pred: Pred<Join<T>>) => Order<T, 0>
type OrderBy = <T extends Tables[]>(column: keyof Join<T>, desc?: boolean) => Order<T, 3>

type Storm = <T extends Tables[], P extends Orders<T>>(q: Query<T>) => (...pipes: IsOrdered<P, UnwrapOrders<P>>) => Knex.QueryBuilder

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

const wrong2 = storm(users.address.city)(orderBy('biography', true), filter(propEq('city.name', 'stuff'))) // ok, incorrect!
const right2 = storm(users.address.city)(filter(propEq('age', 770)), orderBy('biography', true)) // ok, correct!
