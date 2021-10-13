import { blue, green, yellow } from 'ansicolor'
import { Knex } from 'knex'
import { knex } from '../config/knex'
import { Columns, DbType, Name, Structure, Tables } from './structure'
import { apply, bind, filter, forEachObjIndexed, fromPairs, groupBy, join, map, pipe, prop } from 'ramda'

const knexMap = (type: string) =>
  (({
    number: 'integer'
  }[type] ?? type) as keyof Knex.CreateTableBuilder)

const colParams = (fn: Knex.ColumnBuilder, type: DbType) => {
  if (type.default != null) {
    fn.defaultTo(type.default)
  }
  if (type.unsigned != null) {
    fn.unsigned()
  }
  if (type.primary != null) {
    fn.primary()
  }
  if (type.notNull) {
    fn.notNullable()
  }
  if (type.unique) {
    fn.unique()
  }
  if (type.onUpdate) {
    fn.onUpdate(type.onUpdate)
  }
  if (type.onDelete) {
    fn.onUpdate(type.onDelete)
  }
}

const createDataColumn = (t: Knex.CreateTableBuilder, column: Name, type: DbType) => {
  console.log(`  ${yellow(column)} ${blue(type.name)}`)
  const knexFunc = t[knexMap(type.name.toLowerCase())]?.bind?.(t)
  const args = type.args ?? []
  if (knexFunc != null) {
    const col = type.increment ? t.increments(column) : (apply(bind(knexFunc, t), [column, ...args]) as Knex.ColumnBuilder)
    colParams(col, type)
  }
}

const createRefColumn = (t: Knex.CreateTableBuilder, column: Name, type: DbType) => {
  console.log(`  ${yellow(column)} ${blue(type.name + ' ⁎ ')}`)
  const col = t.integer(`${column}_id`).unsigned().references('id').inTable(type.name)
  colParams(col, type)
}

const createCrossTables = (s: Knex.SchemaBuilder, parentTable: string, tables: Tables, columns: Columns) => {
  const xCols: Record<string, Record<Name, DbType>> = pipe<any, any, any, any, any>(
    Array.from,
    filter(([, v]) => v.isArray),
    groupBy(([, v]) => v.name),
    map(fromPairs)
  )(columns)
  forEachObjIndexed((c: Record<Name, DbType>, table: string) => {
    const crossTable = `${parentTable}${table}`
    s.createTable(crossTable, t => {
      console.log(green(`Creating ${crossTable}`))
      t.integer('id').unsigned().references('id').inTable(parentTable)
      forEachObjIndexed((type, col: string) => {
        createRefColumn(t, col, type)
      }, c)
    })
  }, xCols)
}

export const getSql = ({ tables }: Structure): string => {
  const ct = knex.schema
  tables.forEach((columns, table) => {
    ct.createTable(table, t => {
      console.log(green(`Creating ${table}`))
      // refs and data columns
      columns.forEach((type, column) => {
        if (tables.has(type.name)) {
          if (!type.isArray) {
            createRefColumn(t, column, type)
          } else {
            console.log(`  ${yellow(column)} ${blue(type.name + ' ⁂ ')}`)
          }
        } else {
          createDataColumn(t, column, type)
        }
      })
    })
  })
  tables.forEach((columns, table) => {
    createCrossTables(ct, table, tables, columns)
  })
  return pipe(map(prop('sql')), join(';\n'))(ct.toSQL())
}
