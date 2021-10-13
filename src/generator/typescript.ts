import { Columns, Structure } from './structure'
import {
  createPrinter,
  createSourceFile,
  EmitHint,
  factory,
  NewLineKind,
  NodeFlags,
  PropertyAssignment,
  ScriptKind,
  ScriptTarget
} from 'typescript'

const propsForColumns = (structure: Structure, columns: Columns): PropertyAssignment[] =>
  Array.from(columns).reduce(
    (arr: PropertyAssignment[], [column, type]) =>
      structure.tables.has(type.name)
        ? [...arr, factory.createPropertyAssignment(column, factory.createStringLiteral(type.name))]
        : arr,
    []
  )

export const createTypescriptHelper = (structure: Structure): string => {
  const file = createSourceFile('./bla.tmp', '', ScriptTarget.ESNext, false, ScriptKind.TS)
  const printer = createPrinter({ newLine: NewLineKind.LineFeed })
  const result: string[] = []
  structure.tables.forEach((columns, table) => {
    const statement = factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(table),
            undefined,
            undefined,
            factory.createObjectLiteralExpression(propsForColumns(structure, columns), true)
          )
        ],
        NodeFlags.Const
      )
    )
    result.push(printer.printNode(EmitHint.Unspecified, statement, file))
  })
  return result.join('\n')
}
