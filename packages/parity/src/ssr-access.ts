import ts from 'typescript'
import { parse } from 'vue/compiler-sfc'

function browserAccess(text: string) {
  const file = ts.createSourceFile('source.ts', text, ts.ScriptTarget.Latest, true)
  const options = { noLib: true, noResolve: true }
  const host = ts.createCompilerHost(options)
  host.getSourceFile = name => (name === file.fileName ? file : undefined)
  const checker = ts.createProgram([file.fileName], options, host).getTypeChecker()
  const hits: string[] = []

  function visit(node: ts.Node) {
    if (ts.isTypeNode(node)) return
    if (ts.isFunctionLike(node)) {
      let expression: ts.Node = node
      while (ts.isParenthesizedExpression(expression.parent)) expression = expression.parent
      if (!ts.isCallExpression(expression.parent) || expression.parent.expression !== expression) {
        return
      }
    }
    if (
      ts.isPropertyDeclaration(node) &&
      !node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.StaticKeyword)
    )
      return
    const target =
      ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)
        ? node.expression
        : ts.isVariableDeclaration(node)
          ? node.initializer
          : undefined
    if (
      target &&
      ts.isIdentifier(target) &&
      (target.text === 'window' || target.text === 'document') &&
      !checker.getSymbolAtLocation(target)
    )
      hits.push(node.getText(file))
    ts.forEachChild(node, visit)
  }

  visit(file)
  return hits
}

export function topLevelBrowserAccess(text: string, vue = false) {
  if (!vue) return browserAccess(text)
  const { descriptor } = parse(text)
  return [descriptor.script, descriptor.scriptSetup].flatMap(script =>
    script ? browserAccess(script.content) : [],
  )
}
