import { parseFragment } from 'parse5'
import type { DefaultTreeAdapterMap } from 'parse5'

type Node = DefaultTreeAdapterMap['childNode']
type Element = DefaultTreeAdapterMap['element']
type Parent = DefaultTreeAdapterMap['parentNode']

const ID_REFERENCES = new Set([
  'id',
  'for',
  'form',
  'list',
  'headers',
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
  'data-panel-group-id',
  'data-panel-id',
  'data-panel-resize-handle-id',
])

const GENERATED_ID = /^(?:[\w-]+-)?(?:v-\d+(?:-\d+)*|_[Rr]_[0-9a-z]+_)$/
const GENERATED_ID_PARTS = /^((?:[\w-]+-)?)(?:v-\d+(?:-\d+)*|_[Rr]_[0-9a-z]+_)$/
const COUNTER_ID_PARTS = /^((?:[\w-]+-)?hn-[a-z]+(?:-[a-z]+)*-)\d+(?:-\d+)*$/
const GEOMETRY_ATTRIBUTES = new Set(['data-side', 'data-align'])
const BLOB_URL = /blob:[^\s"')]+/g
const TRUNCATED = /(?:^|\s)truncate(?:\s|$)/
const PRIMITIVE_ATTRIBUTE = /^data-(?:reka|radix)-/
const PRIMITIVE_VARIABLE = /--(?:reka|radix)-/
const VENDOR_PREFIX = /^(webkit|moz|ms)-/
const HYDRATION_HINT = 'data-allow-mismatch'

export interface NormalizeOptions {
  ignoreAttributes?: string[]
  userIcons?: boolean
  exact?: boolean
  geometry?: boolean
}

function isElement(node: Node): node is Element {
  return 'tagName' in node
}

function classes(value: string) {
  return value.split(/\s+/).filter(Boolean).sort().join(' ')
}

function style(value: string) {
  return value
    .split(';')
    .map(declaration => declaration.trim())
    .filter(Boolean)
    .map(declaration => {
      const colon = declaration.indexOf(':')
      const name = declaration.slice(0, colon).trim().toLowerCase()
      const raw = declaration.slice(colon + 1).trim()
      const property = name
        .replace(PRIMITIVE_VARIABLE, '--primitive-')
        .replace(VENDOR_PREFIX, '-$1-')
      const value = raw
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(new RegExp(PRIMITIVE_VARIABLE.source, 'g'), '--primitive-')
      return `${property}: ${value}`
    })
    .sort()
    .join('; ')
}

function content(node: Element): Parent {
  return node.tagName === 'template' ? (node as unknown as { content: Parent }).content : node
}

function exactId(token: string, ids: Map<string, string>) {
  const parts = GENERATED_ID_PARTS.exec(token) ?? COUNTER_ID_PARTS.exec(token)
  if (!parts) return token
  if (!ids.has(token)) ids.set(token, `${parts[1]}v-${ids.size + 1}`)
  return ids.get(token)!
}

function exactValue(name: string, value: string, ids: Map<string, string>, geometry: boolean) {
  if (!geometry && name === 'style') return value.replace(/-?\d*\.?\d+/g, '#')
  if (!geometry && GEOMETRY_ATTRIBUTES.has(name)) return '#'
  if (name === 'class' && /(?:^|\s)os-/.test(value)) return value.split(/\s+/).sort().join(' ')
  if (ID_REFERENCES.has(name))
    return value
      .split(' ')
      .map(token => exactId(token, ids))
      .join(' ')
  return exactId(value, ids).replace(BLOB_URL, 'blob:')
}

function exactLines(
  parent: Parent,
  depth: number,
  lines: string[],
  geometry: boolean,
  ids = new Map<string, string>(),
) {
  const indent = '  '.repeat(depth)
  for (const node of parent.childNodes) {
    if (node.nodeName === '#comment')
      lines.push(`${indent}<!--${(node as DefaultTreeAdapterMap['commentNode']).data}-->`)
    else if (!isElement(node))
      lines.push(`${indent}${JSON.stringify((node as DefaultTreeAdapterMap['textNode']).value)}`)
    else {
      const truncated = TRUNCATED.test(node.attrs.find(({ name }) => name === 'class')?.value ?? '')
      const attributes = node.attrs
        .filter(({ name }) => geometry || !truncated || name !== 'tabindex')
        .map(({ name, value }) => ` ${name}="${exactValue(name, value, ids, geometry)}"`)
        .join('')
      lines.push(`${indent}<${node.tagName}${attributes}>`)
      exactLines(content(node), depth + 1, lines, geometry, ids)
    }
  }
  return lines
}

function children(parent: Parent) {
  const result: Node[] = []
  for (const node of parent.childNodes) {
    if (node.nodeName === '#comment') continue
    const last = result[result.length - 1]
    if (node.nodeName === '#text' && last?.nodeName === '#text') {
      ;(last as DefaultTreeAdapterMap['textNode']).value += (
        node as DefaultTreeAdapterMap['textNode']
      ).value
      continue
    }
    result.push(node.nodeName === '#text' ? { ...node } : node)
  }
  return result.filter(
    node =>
      node.nodeName !== '#text' || (node as DefaultTreeAdapterMap['textNode']).value.trim() !== '',
  )
}

export function normalizeMarkup(html: string, options: NormalizeOptions = {}) {
  if (options.exact)
    return exactLines(parseFragment(html), 0, [], options.geometry ?? true).join('\n')
  const ignored = new Set(options.ignoreAttributes ?? [])
  const ids = new Map<string, string>()
  const id = (token: string) => {
    if (!ids.has(token)) ids.set(token, `id-${ids.size + 1}`)
    return ids.get(token)!
  }

  const lines: string[] = []
  const visit = (node: Node, depth: number) => {
    const indent = '  '.repeat(depth)
    if (!isElement(node)) {
      const text = (node as DefaultTreeAdapterMap['textNode']).value.replace(/\s+/g, ' ').trim()
      lines.push(`${indent}"${text}"`)
      return
    }
    const userIcon =
      options.userIcons &&
      node.tagName === 'svg' &&
      node.attrs.some(({ name, value }) => name === 'class' && /\blucide\b/.test(value))
    const attributes = node.attrs
      .filter(({ name }) => !(userIcon && name === 'aria-hidden'))
      .map(({ name, value }) =>
        userIcon && name === 'class'
          ? {
              name,
              value: value
                .split(/\s+/)
                .filter(part => !/^lucide-/.test(part))
                .join(' '),
            }
          : { name, value },
      )
      .map(({ name, value }) => {
        const key = PRIMITIVE_ATTRIBUTE.test(name)
          ? name.replace(PRIMITIVE_ATTRIBUTE, 'data-primitive-')
          : name
        if (ignored.has(key) || key === HYDRATION_HINT) return undefined
        if (key === 'class') return [key, classes(value)] as const
        if (key === 'style') return [key, style(value)] as const
        if (ID_REFERENCES.has(key)) return [key, value.split(/\s+/).map(id).join(' ')] as const
        if (GENERATED_ID.test(value)) return [key, id(value)] as const
        return [key, value] as const
      })
      .filter(
        (entry): entry is readonly [string, string] =>
          entry !== undefined &&
          !((entry[0] === 'class' || entry[0] === 'style') && entry[1] === ''),
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => (value === '' ? name : `${name}="${value}"`))
    lines.push(`${indent}<${node.tagName}${attributes.length ? ` ${attributes.join(' ')}` : ''}>`)
    for (const child of children(content(node))) visit(child, depth + 1)
  }

  for (const node of children(parseFragment(html))) visit(node, 0)
  return lines.join('\n')
}
