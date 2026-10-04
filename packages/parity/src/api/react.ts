import { join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { valuesOf, type ReactMember, type ReactSurface } from './types'

const reactRoot = fileURLToPath(new URL('../../../react', import.meta.url))
const sharedRoot = fileURLToPath(new URL('../../../shared', import.meta.url))

function program(root: string) {
  const path = join(root, 'tsconfig.json')
  const config = ts.readConfigFile(path, ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  return ts.createProgram([join(root, 'src', 'index.ts')], { ...parsed.options, noEmit: true })
}

function isOwn(symbol: ts.Symbol, roots: string[]) {
  return (symbol.declarations ?? []).some(declaration => {
    const file = declaration.getSourceFile().fileName
    return (
      !file.includes(`${sep}node_modules${sep}`) &&
      roots.some(root => file.startsWith(`${root}${sep}`))
    )
  })
}

function nonNullable(type: ts.Type) {
  if (!type.isUnion()) return [type]
  return type.types.filter(
    part => !(part.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)),
  )
}

function handleOf(checker: ts.TypeChecker, ref: ts.Symbol | undefined) {
  if (!ref) return undefined
  for (const part of nonNullable(checker.getTypeOfSymbol(ref))) {
    const current = part.getProperty('current')
    if (!current) continue
    const targets = nonNullable(checker.getTypeOfSymbol(current))
    const members = new Set<string>()
    let element = false
    for (const target of targets) {
      if (target.getProperty('nodeType')) element = true
      for (const property of checker.getPropertiesOfType(target)) members.add(property.name)
    }
    return { element, members: [...members].sort() }
  }
  return undefined
}

function reactNodeType(program: ts.Program) {
  const checker = program.getTypeChecker()
  for (const file of program.getSourceFiles()) {
    if (!/[\\/]@types[\\/]react[\\/]index\.d\.ts$/.test(file.fileName)) continue
    const module = checker.getSymbolAtLocation(file)
    const node = module && checker.getExportsOfModule(module).find(e => e.name === 'ReactNode')
    if (node) return checker.getDeclaredTypeOfSymbol(node)
  }
  throw new Error('ReactNode not found')
}

function propsOf(checker: ts.TypeChecker, type: ts.Type, roots: string[], node: ts.Type) {
  const parts = type.isUnion() ? type.types : [type]
  const found = new Map<string, { symbols: ts.Symbol[]; count: number }>()
  for (const part of parts)
    for (const symbol of checker.getPropertiesOfType(checker.getApparentType(part))) {
      const entry = found.get(symbol.name) ?? { symbols: [], count: 0 }
      entry.symbols.push(symbol)
      entry.count += 1
      found.set(symbol.name, entry)
    }
  const props: ReactMember[] = []
  for (const [name, { symbols, count }] of found) {
    const optional =
      count < parts.length || symbols.some(symbol => symbol.flags & ts.SymbolFlags.Optional)
    const symbol = symbols[0]!
    const propType = checker.getTypeOfSymbol(symbol)
    props.push({
      name,
      required: !optional,
      type: checker.typeToString(propType),
      values: valuesOf(checker, propType),
      callable: nonNullable(propType).some(part => part.getCallSignatures().length > 0),
      own: symbols.some(symbol => isOwn(symbol, roots)),
      node: checker.isTypeAssignableTo(node, propType),
    })
  }
  return { props, ref: found.get('ref')?.symbols[0] }
}

export function extractReact(names: Iterable<string>, root = reactRoot): ReactSurface[] {
  const roots = [join(root, 'src'), join(sharedRoot, 'src')]
  const built = program(root)
  const checker = built.getTypeChecker()
  const node = reactNodeType(built)
  const index = built.getSourceFile(join(root, 'src', 'index.ts'))!
  const exports = new Map(
    checker
      .getExportsOfModule(checker.getSymbolAtLocation(index)!)
      .map(symbol => [symbol.name, symbol]),
  )
  const surfaces: ReactSurface[] = []
  for (const name of names) {
    const exported = exports.get(name)
    if (!exported) continue
    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
    if (!declaration) continue
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration)
    const signature = type.getCallSignatures()[0]
    const parameter = signature?.getParameters()[0]
    if (!parameter) {
      surfaces.push({ name, props: [] })
      continue
    }
    const { props, ref } = propsOf(checker, checker.getTypeOfSymbol(parameter), roots, node)
    surfaces.push({ name, props, handle: handleOf(checker, ref) })
  }
  return surfaces
}
