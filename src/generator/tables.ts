import { Node, Project, SyntaxKind, TypeFormatFlags } from 'ts-morph'
import { Columns, getSemantics, Name, Structure } from './structure'
import grammar from '../grammar/dbType.ohm-bundle'

export const getStructure = (source: string): Structure => {
  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(source)
  const matcher = grammar.matcher()
  const tables = new Map<Name, Columns>()
  sourceFile.forEachChild(descendant => {
    if (Node.isTypeAliasDeclaration(descendant) || Node.isInterfaceDeclaration(descendant)) {
      const tableName = descendant.getName()
      const columns = new Map<Name, any>()
      descendant.forEachDescendant(prop => {
        if (Node.isPropertyNamedNode(prop)) {
          const type =
            prop.getFirstChildByKind(SyntaxKind.TypeReference)?.getText() ??
            prop.getType().getText(undefined, TypeFormatFlags.NoTruncation)
          matcher.setInput(type)
          const matchResult = matcher.match()
          if (matchResult.failed()) {
            throw `Unsupported type ${tableName}.${prop.getName()}: ${type}`
          } else {
            const type = getSemantics(matchResult)
            columns.set(prop.getName(), type)
          }
        }
      })
      if (columns.size > 0) {
        tables.set(tableName, columns)
      }
    }
  })
  return { tables }
}
