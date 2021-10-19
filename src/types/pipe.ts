import { Knex } from 'knex'
import { juxt } from 'ramda'
import { Tables, users } from '../db'
import { Join } from './joins'
import { IsOrdered, Nats } from './nats'
import { Query } from './query'
import { ComparisonOperator, NonEmptyArray } from './types'

interface Order<N extends keyof Nats, D = any> {
  <T extends Tables[]>(query: Query<T>): { n: N; d: D } | void
}

type Pred<T> = { column: keyof T; operator: ComparisonOperator; value: T[Pred<T>['column']] }
type PropEq = <J>(column: keyof J, value: J[typeof column]) => Pred<J>

// type UnwrapOrders<O extends any[]> = { [K in keyof O]: O[K] extends Order<infer N, any> ? N : never }

type Filter = <D>(pred: Pred<D>) => Order<0, D>
type OrderBy = <D>(column: keyof D, desc?: boolean) => Order<3, D>
type OrderBy2 = <D>(column: keyof D, desc?: boolean) => Order<4, D>

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
  column,
  operator: '=',
  value
})

export const filter: Filter = pred => query => {
  const { column, operator, value } = pred
  query.id.where(column, operator, value as any)
}

// prettier-ignore
export const orderBy: OrderBy =
  (column, desc) => query => {
    query.id.orderBy(column, desc ? 'desc' : 'asc')
  }

export const orderBy2: OrderBy2 = (column, desc) => query => {
  query.id.orderBy(column, desc ? 'desc' : 'asc')
}

// prettier-ignore
type UnwrapOrders<O> = O extends NonEmptyArray<any>
  ? O extends [Order<infer N, any>, ...infer T] ? [N, ...UnwrapOrders<T>] : never
  : []

// type UOTest = UnwrapOrders<[Order<3, {}>, Order<1, {}>, Order<0, {}>, Order<4, {}>]>
type PipeGuard<J, O extends Order<keyof Nats, J>[]> = IsOrdered<UnwrapOrders<O>> extends true ? O : never

// prettier-ignore
type Storm = <T extends Tables[], J extends Join<T>>(q:  Query<T>) =>
  <K extends keyof Nats>(...pipes: PipeGuard<J, Order<K, J>[]>) => Knex.QueryBuilder

export const storm: Storm =
  query =>
  (...pipes) => {
    juxt(pipes as any[])(query)
    console.log(query.id.toSQL())
    return query.id
  }

// prettier-ignore
storm(users.address.city)(
  orderBy('age', false),
  filter(propEq('name', 'New York')),
)
