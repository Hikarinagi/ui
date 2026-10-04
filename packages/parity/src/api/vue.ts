import { readFileSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { createChecker } from 'vue-component-meta'
import { parse } from 'vue/compiler-sfc'
import { valuesOf, type Attribute, type Member, type Slot, type VueSurface } from './types'

const vueRoot = fileURLToPath(new URL('../../../vue', import.meta.url))

const ELEMENT = 1
const TEXT = 2
const COMMENT = 3
const DIRECTIVE = 7

const GLOBAL_PROPS = new Set(['key', 'ref', 'ref_for', 'ref_key', 'class', 'style'])

interface TemplateNode {
  type: number
  tag?: string
  content?: string
  name?: string
  arg?: unknown
  exp?: { content?: string }
  props?: TemplateNode[]
  children?: TemplateNode[]
}

export function vueComponents(root = vueRoot) {
  const index = join(root, 'src', 'index.ts')
  const file = ts.createSourceFile(index, readFileSync(index, 'utf8'), ts.ScriptTarget.Latest, true)
  const components: { name: string; file: string }[] = []
  for (const statement of file.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue
    const specifier = statement.moduleSpecifier
    if (!specifier || !ts.isStringLiteral(specifier) || !specifier.text.endsWith('.vue')) continue
    const clause = statement.exportClause
    if (!clause || !ts.isNamedExports(clause)) continue
    for (const element of clause.elements)
      if ((element.propertyName ?? element.name).text === 'default')
        components.push({ name: element.name.text, file: join(root, 'src', specifier.text) })
  }
  return components
}

export function definedModels(source: string) {
  const { descriptor } = parse(source)
  const file = ts.createSourceFile(
    'setup.ts',
    descriptor.scriptSetup?.content ?? '',
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const models: string[] = []
  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'defineModel'
    ) {
      const first = node.arguments[0]
      models.push(first && ts.isStringLiteralLike(first) ? first.text : 'modelValue')
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return models
}

const directive = (node: TemplateNode, name: string) =>
  (node.props ?? []).find(prop => prop.type === DIRECTIVE && prop.name === name)

function roots(nodes: TemplateNode[]): TemplateNode[] {
  const children = nodes.filter(
    node => node.type !== COMMENT && !(node.type === TEXT && !node.content?.trim()),
  )
  if (!children.every(node => node.type === ELEMENT)) return []
  const branches =
    children.length === 1 ||
    children.every(
      node => directive(node, 'if') || directive(node, 'else-if') || directive(node, 'else'),
    )
  if (!branches) return []
  return children.flatMap(node =>
    node.tag === 'Transition' || node.tag === 'transition' || node.tag === 'template'
      ? roots(node.children ?? [])
      : node.tag === 'slot'
        ? []
        : [node],
  )
}

export function attributeTargets(source: string) {
  const { descriptor } = parse(source)
  const ast = descriptor.template?.ast as TemplateNode | undefined
  const script = `${descriptor.script?.content ?? ''}\n${descriptor.scriptSetup?.content ?? ''}`
  const text = `${script}\n${descriptor.template?.content ?? ''}`
  const reads = (pattern: string) =>
    [
      ...text.matchAll(
        new RegExp(`${pattern}(?:\\.([A-Za-z][\\w]*)|\\[['"]([\\w-]+)['"]\\])`, 'g'),
      ),
    ].map(match => match[1] ?? match[2]!)
  const local = (factory: string) =>
    new RegExp(`(?:const|let)\\s+(\\w+)\\s*=\\s*${factory}\\(\\)`).exec(script)?.[1]
  const attrs = local('useAttrs')
  const slotsVariable = local('useSlots')
  const read = {
    attributes: [...reads('\\$attrs'), ...(attrs ? reads(`\\b${attrs}`) : [])],
    slots: [...reads('\\$slots'), ...(slotsVariable ? reads(`\\b${slotsVariable}`) : [])],
  }
  if (!ast) return { attributes: [], slots: [], read }
  const inherit = !/inheritAttrs:\s*false/.test(script)
  const attributes = new Set<string>()
  const slots = new Set<string>()
  const visit = (node: TemplateNode) => {
    if (node.type === ELEMENT && node.tag) {
      const bound = (node.props ?? []).some(
        prop =>
          prop.type === DIRECTIVE &&
          prop.name === 'bind' &&
          !prop.arg &&
          /\$attrs\b/.test(prop.exp?.content ?? ''),
      )
      if (!inherit && bound) attributes.add(node.tag)
      const forwards = (node.children ?? []).some(child => {
        const loop = child.type === ELEMENT && child.tag === 'template' && directive(child, 'for')
        return !!loop && /\bin\s+\$slots\b/.test(loop.exp?.content ?? '')
      })
      if (forwards) slots.add(node.tag)
    }
    for (const child of node.children ?? []) visit(child)
  }
  visit(ast)
  if (inherit) for (const node of roots(ast.children ?? [])) attributes.add(node.tag!)
  return { attributes: [...attributes], slots: [...slots], read }
}

function propertyOf(checker: ts.TypeChecker, type: ts.Type, name: string): ts.Type | undefined {
  const symbol = type.getProperty(name)
  if (symbol) return checker.getTypeOfSymbol(symbol)
  if (type.isUnionOrIntersection())
    for (const part of type.types) {
      const found = propertyOf(checker, part, name)
      if (found) return found
    }
  return undefined
}

function componentType(program: ts.Program, path: string) {
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(path)
  const module = source && checker.getSymbolAtLocation(source)
  const exported = module && checker.getExportsOfModule(module).find(e => e.name === 'default')
  const declaration = exported?.valueDeclaration
  if (!declaration || !ts.isExportAssignment(declaration)) return undefined
  return checker.getTypeAtLocation(declaration.expression)
}

function slotsType(checker: ts.TypeChecker, component: ts.Type) {
  for (const signature of component.getConstructSignatures()) {
    const slots = propertyOf(checker, signature.getReturnType(), '$slots')
    if (slots) return slots
  }
  for (const signature of component.getCallSignatures()) {
    const context = signature.parameters[1]
    const slots = context && propertyOf(checker, checker.getTypeOfSymbol(context), 'slots')
    if (slots) return slots
  }
  return undefined
}

function propsType(checker: ts.TypeChecker, component: ts.Type) {
  for (const signature of component.getConstructSignatures()) {
    const props = propertyOf(checker, signature.getReturnType(), '$props')
    if (props) return props
  }
  for (const signature of component.getCallSignatures()) {
    const props = signature.parameters[0]
    if (props) return checker.getTypeOfSymbol(props)
  }
  return undefined
}

function dynamicSlots(checker: ts.TypeChecker, component: ts.Type | undefined) {
  const slots = component && slotsType(checker, component)
  if (!slots) return []
  const names: string[] = []
  for (const info of checker.getIndexInfosOfType(checker.getNonNullableType(slots))) {
    const key = info.keyType
    if (!(key.flags & ts.TypeFlags.TemplateLiteral)) continue
    const template = key as ts.TemplateLiteralType
    if (template.texts.length === 2 && template.texts[1] === '' && template.texts[0]!.endsWith('-'))
      names.push(`${template.texts[0]!.slice(0, -1)}-key`)
  }
  return [...new Set(names)]
}

function genericExposed(checker: ts.TypeChecker, component: ts.Type | undefined) {
  for (const signature of component?.getCallSignatures() ?? []) {
    const expose = signature.parameters[2]
    if (!expose) continue
    const callback = checker.getNonNullableType(checker.getTypeOfSymbol(expose))
    for (const call of callback.getCallSignatures()) {
      const exposed = call.getParameters()[0]
      if (exposed)
        return checker.getPropertiesOfType(checker.getTypeOfSymbol(exposed)).map(e => e.name)
    }
  }
  return []
}

const pascalTag = (tag: string) =>
  tag
    .split('-')
    .map(part => part[0]!.toUpperCase() + part.slice(1))
    .join('')

function importedComponent(program: ts.Program, path: string, tag: string) {
  const source = program.getSourceFile(path)
  if (!source || !/^[A-Z]|-/.test(tag)) return undefined
  const name = pascalTag(tag)
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
      continue
    const clause = statement.importClause
    if (!clause || clause.isTypeOnly) continue
    const specifier = statement.moduleSpecifier.text
    const identifiers = [
      clause.name,
      ...(clause.namedBindings && ts.isNamedImports(clause.namedBindings)
        ? clause.namedBindings.elements.map(element => element.name)
        : []),
    ]
    const identifier = identifiers.find(node => node?.text === name)
    if (!identifier) continue
    return {
      type: program.getTypeChecker().getTypeAtLocation(identifier),
      file: specifier.endsWith('.vue') ? resolve(dirname(path), specifier) : undefined,
    }
  }
  return undefined
}

function directoryOf(file: string, root: string) {
  const components = join(root, 'src', 'components') + sep
  return file.startsWith(components) ? file.slice(components.length).split(sep)[0]! : ''
}

export function extractVue(root = vueRoot): VueSurface[] {
  const checker = createChecker(join(root, 'tsconfig.json'), { schema: false })
  const program = checker.getProgram()!
  const types = program.getTypeChecker()
  const forwarded = new Map<string, { attributes: Attribute[]; slots: Slot[] }>()

  function slotsOf(file: string) {
    const component = componentType(program, file)
    return [
      ...checker.getComponentMeta(file).slots.map(slot => {
        const type = slot.getTypeObject()
        const scoped = !!type && !(type.flags & ts.TypeFlags.Any) && type.getProperties().length > 0
        return { name: slot.name, scoped }
      }),
      ...dynamicSlots(types, component).map(slot => ({ name: slot, scoped: true })),
    ]
  }

  function fallthrough(file: string, seen = new Set<string>()) {
    const cached = forwarded.get(file)
    if (cached) return cached
    const result = { attributes: [] as Attribute[], slots: [] as Slot[] }
    if (seen.has(file)) return result
    seen.add(file)
    const targets = attributeTargets(readFileSync(file, 'utf8'))
    result.attributes.push(...targets.read.attributes.map(name => ({ name, directory: '' })))
    result.slots.push(...targets.read.slots.map(name => ({ name, scoped: false })))
    for (const tag of targets.attributes) {
      const target = importedComponent(program, file, tag)
      if (!target) continue
      const props = propsType(types, target.type)
      const directory = target.file ? directoryOf(target.file, root) : ''
      for (const property of props ? types.getPropertiesOfType(props) : [])
        if (!GLOBAL_PROPS.has(property.name) && !/^onVnode[A-Z]/.test(property.name))
          result.attributes.push({ name: property.name, directory })
      if (target.file) result.attributes.push(...fallthrough(target.file, seen).attributes)
    }
    for (const tag of targets.slots) {
      const target = importedComponent(program, file, tag)
      if (!target?.file) continue
      result.slots.push(...slotsOf(target.file), ...fallthrough(target.file, seen).slots)
    }
    forwarded.set(file, result)
    return result
  }

  return vueComponents(root).map(({ name, file }) => {
    const meta = checker.getComponentMeta(file)
    const component = componentType(program, file)
    const props: Member[] = meta.props
      .filter(prop => !prop.global)
      .map(prop => ({
        name: prop.name,
        required: prop.required,
        type: prop.type,
        values: valuesOf(types, prop.getTypeObject()),
        callable: types.getNonNullableType(prop.getTypeObject()).getCallSignatures().length > 0,
      }))
    const declared = slotsOf(file)
    const { attributes, slots } = fallthrough(file)
    return {
      name,
      directory: directoryOf(file, root),
      props,
      models: definedModels(readFileSync(file, 'utf8')),
      events: meta.events.map(event => event.name),
      slots: [...declared, ...slots].filter(
        (slot, index, all) => all.findIndex(entry => entry.name === slot.name) === index,
      ),
      exposed: meta.exposed.length
        ? meta.exposed.map(member => member.name)
        : genericExposed(types, component),
      attributes,
    }
  })
}
