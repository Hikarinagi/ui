import ts from 'typescript'

const DIRECTIVE = /^(['"])use client\1;?$/

export function hasClientDirective(text: string) {
  const file = ts.createSourceFile(
    'module.tsx',
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const first = file.statements[0]
  return (
    !!first &&
    ts.isExpressionStatement(first) &&
    ts.isStringLiteral(first.expression) &&
    DIRECTIVE.test(first.expression.getText(file))
  )
}

function importedComponents(file: ts.SourceFile) {
  const names = new Set<string>()
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement) || statement.importClause?.isTypeOnly) continue
    const clause = statement.importClause
    if (clause?.name && /^[A-Z]/.test(clause.name.text)) names.add(clause.name.text)
    const bindings = clause?.namedBindings
    if (bindings && ts.isNamedImports(bindings))
      for (const element of bindings.elements)
        if (!element.isTypeOnly && /^[A-Z]/.test(element.name.text)) names.add(element.name.text)
  }
  return names
}

function passedAsData(node: ts.Node) {
  const parent = node.parent
  return (
    (ts.isPropertyAssignment(parent) && parent.initializer === node) ||
    ts.isArrayLiteralExpression(parent) ||
    (ts.isJsxExpression(parent) && ts.isJsxAttribute(parent.parent))
  )
}

export interface ClientReasonOptions {
  data?: boolean
}

export function clientReasons(
  text: string,
  name = 'module.tsx',
  options: ClientReasonOptions = {},
) {
  const kind = name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, kind)
  const reasons = new Set<string>()
  const components = options.data ? importedComponents(file) : new Set<string>()
  const visit = (node: ts.Node) => {
    if (options.data) {
      if ((ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && passedAsData(node))
        reasons.add('passes a function as data')
      if (ts.isIdentifier(node) && components.has(node.text) && passedAsData(node))
        reasons.add(`passes the component ${node.text} as data`)
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression
      const called = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : ''
      if (/^use[A-Z]/.test(called) || called === 'use') reasons.add(`calls ${called}`)
      if (called === 'createContext') reasons.add('creates a context')
    }
    if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
      if (/^on[A-Z]/.test(node.name.text)) reasons.add(`binds ${node.name.text}`)
      else if (
        node.initializer &&
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression &&
        (ts.isArrowFunction(node.initializer.expression) ||
          ts.isFunctionExpression(node.initializer.expression))
      )
        reasons.add(`passes a function to ${node.name.text}`)
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return [...reasons]
}

export function withClientDirective(text: string) {
  return hasClientDirective(text) ? text : `'use client'\n\n${text}`
}
