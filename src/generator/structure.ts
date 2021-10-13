import grammar from '../grammar/dbType.ohm-bundle'
import { MatchResult, NonterminalNode } from 'ohm-js'

export type Name = string
export type Columns = Map<Name, DbType>
export type Tables = Map<Name, Columns>

export type Structure = {
  tables: Tables
}

export type DbType = {
  unique: boolean
  notNull: boolean
  primary: boolean
  increment: boolean
  unsigned: boolean
  default?: string | number
  args: Array<string | number>
  isArray: boolean
  onDelete?: string
  onUpdate?: string
  name: string
  inverse?: string
}

export const getSemantics = (matchResult: MatchResult): DbType => {
  const semantics = grammar.createSemantics()
  const dbType: DbType = {} as any
  semantics.addOperation('asTypes()', {
    WithDefault(_1, _2, value, _3, arg, _4) {
      dbType.default = arg.sourceString
      return value.asTypes()
    },
    OnUpdate(_1, _2, value, _3, arg, _4) {
      dbType.onUpdate = arg.sourceString
      return value.asTypes()
    },
    OnDelete(_1, _2, value, _3, arg, _4) {
      dbType.onDelete = arg.sourceString
      return value.asTypes()
    },
    NotNull(_1, _2, type, _3) {
      dbType.notNull = true
      return type.asTypes()
    },
    Unique(_1, _2, type, _3) {
      dbType.unique = true
      return type.asTypes()
    },
    Primary(_1, _2, type, _3) {
      dbType.primary = true
      return type.asTypes()
    },
    Unsigned(_1, _2, type, _3) {
      dbType.unsigned = true
      return type.asTypes()
    },
    Increment(_1, _2, type, _3) {
      dbType.increment = true
      return type.asTypes()
    },
    ParamType(name, _1, args, _2) {
      dbType.name = name.sourceString
      dbType.args = args
        .asIteration()
        .children.map((c: NonterminalNode) => eval(`(${c.sourceString.replace(';', ',')})`))
    },
    ArrayType(name, _1) {
      dbType.name = name.sourceString
      dbType.isArray = true
    },
    SimpleType(name) {
      dbType.name = name.sourceString
    }
  })
  semantics(matchResult).asTypes()
  if (dbType.name == null) {
    throw 'Failed to resolve dbType'
  }
  return dbType
}
