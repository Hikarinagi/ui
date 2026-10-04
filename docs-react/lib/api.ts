import type Token from 'markdown-it/lib/token.mjs'
import { frameworkView } from '../../docs/framework'
import {
  DOM_NAMES,
  camel,
  componentMapping,
  pascal,
  reactEvent,
  reactProp,
  reactSlot,
} from '../../packages/parity/src/api/mapping'
import type { Locale } from './routes'

type Kind = 'props' | 'slots' | 'events' | 'expose'

function kindOf(header: string): Kind | undefined {
  const label = header.replace(/`/g, '').trim()
  if (/^(属性|Props?|Property)$/i.test(label)) return 'props'
  if (/^(插槽|Slots?)$/i.test(label)) return 'slots'
  if (/^(事件|Events?)$/i.test(label)) return 'events'
  if (/^(成员|方法|Member|Method|Expose)$/i.test(label)) return 'expose'
  return undefined
}

const PARAMS =
  /^(参数|插槽参数|渲染函数参数|Props|Payload|Scope|Parameters|Slot props|Render props|Context)$/i
const EMPTY = /^[—–-]?$/

const labels: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    插槽: '内容属性',
    Slots: '内容属性',
    事件: '回调',
    Events: '回调',
    Expose: 'Ref',
    实例: 'Ref',
    事件与实例: '回调与 Ref',
    'Events 与 Expose': '回调与 Ref',
    实例与类型: 'Ref 与类型',
    复制事件: '复制回调',
    双向绑定: '受控状态',
    模型: '受控状态',
    Models: '受控状态',
    'Props 与双向绑定': 'Props 与受控状态',
  },
  en: {
    Slots: 'Content props',
    Events: 'Callbacks',
    Expose: 'Ref',
    'Exposed instance': 'Ref',
    'Exposed methods': 'Ref',
    Instance: 'Ref',
    'Events and instance': 'Callbacks and ref',
    'Events and exposed controls': 'Callbacks and ref',
    'Exposed methods and types': 'Ref and types',
    'The copied event': 'The copied callback',
    Models: 'Controlled state',
    'Two-way bindings': 'Controlled state',
    'Props and models': 'Props and controlled state',
  },
}

export function reactHeading(locale: Locale, label: string) {
  return labels[locale][label.trim()]
}

const headers: Record<Locale, Record<Kind, string | undefined>> = {
  'zh-CN': { props: undefined, slots: '属性', events: '回调', expose: undefined },
  en: { props: undefined, slots: 'Prop', events: 'Callback', expose: undefined },
}

export interface PageApi {
  component: string
  model: string
  renamed: string[]
  slotNames: Record<string, string>
  eventNames: Record<string, string>
  slots: Map<string, string>
  events: Map<string, string>
  props: Set<string>
}

export function reactName(
  kind: Kind,
  name: string,
  params: string,
  renamed: string[] = [],
  model = 'value',
  events: Record<string, string> = {},
  slots: Record<string, string> = {},
) {
  if (kind === 'props') return reactProp(name, model)
  if (kind === 'slots') {
    if (name === 'children') return 'children'
    if (/^render[A-Z]|.Content$/.test(name)) return name
    return reactSlot(name, !EMPTY.test(params.replace(/`/g, '').trim()), renamed, slots)
  }
  if (kind === 'events') return reactEvent(name, model, events)
  return name
}

function cellsOf(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map(cell => cell.trim())
}

function namesOf(cell: string) {
  const codes = [...cell.matchAll(/`([^`]+)`/g)].map(match => match[1]!)
  return (codes.length ? codes : [cell])
    .flatMap(code => code.split(/\s*\/\s*/))
    .map(name => name.trim().replace(/^#/, ''))
    .filter(Boolean)
}

export function pageApi(source: string, component = ''): PageApi {
  const api: PageApi = {
    component,
    ...componentMapping(component),
    slots: new Map(),
    events: new Map(),
    props: new Set(),
  }
  const lines = source.split('\n')
  let fence = false
  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*(```|~~~)/.test(lines[index]!)) fence = !fence
    if (fence || !lines[index]!.startsWith('|')) continue
    const head = cellsOf(lines[index]!)
    const kind = kindOf(head[0] ?? '')
    const scoped = head.length > 2 && PARAMS.test(head[1] ?? '')
    let cursor = index + 2
    for (; cursor < lines.length && lines[cursor]!.startsWith('|'); cursor += 1) {
      if (!kind) continue
      const cells = cellsOf(lines[cursor]!)
      for (const name of namesOf(cells[0] ?? '')) {
        if (kind === 'props') api.props.add(name)
        if (kind === 'slots' && !api.slots.has(name))
          api.slots.set(name, slotName(api, name, scoped ? (cells[1] ?? '') : ''))
        if (kind === 'events' && !api.events.has(name)) api.events.set(name, eventName(api, name))
      }
    }
    index = cursor - 1
  }
  return api
}

function slotName(api: PageApi, name: string, params = '') {
  return reactName('slots', name, params, api.renamed, api.model, api.eventNames, api.slotNames)
}

function eventName(api: PageApi, name: string) {
  return reactName('events', name, '', [], api.model, api.eventNames)
}

function slotOf(api: PageApi, raw: string) {
  const name = raw.replace(/^#/, '').replace(/(\(.*\)|=".*")$/, '')
  const prefix = /^(.+?)-/.exec(name)?.[1]
  return (
    api.slots.get(name) ??
    (prefix && api.slots.has(`${prefix}-key`)
      ? api.slots.get(`${prefix}-key`)!
      : slotName(api, name))
  )
}

function eventOf(api: PageApi, raw: string) {
  const match = /^@?([\w:-]+)(\(.*\))?$/.exec(raw)
  if (!match) return raw
  return `${api.events.get(match[1]!) ?? eventName(api, match[1]!)}${match[2] ?? ''}`
}

const AT_RULES =
  /^@(import|source|theme|apply|layer|utility|variant|custom-variant|plugin|config|reference|media|supports|container|keyframes|font-face)$/

const ATTRIBUTES = /^(?:[:@]?[a-z][\w:-]*(?:="[^"]*"|=[\w.+-]+)?\s*)+$/

const LITERAL = /^(true|false|-?\d+(\.\d+)?)$/
const STRING_ATTRIBUTES = new Set([
  'value',
  'defaultValue',
  'name',
  'id',
  'label',
  'title',
  'alt',
  'href',
  'placeholder',
  'key',
  'type',
])

function attributes(content: string, api: PageApi) {
  return content.replace(
    /(^|\s)([:@]?)([a-z][\w:-]*)(?:="([^"]*)"|=([\w.+-]+))?/g,
    (match, space: string, prefix: string, name: string, quoted?: string, bare?: string) => {
      const value = quoted ?? bare
      if (prefix === '@')
        return `${space}${eventOf(api, name)}${value === undefined ? '' : `={${value}}`}`
      if (prefix === ':') return `${space}${camel(name)}={${value ?? ''}}`
      if (/^(aria|data)-/.test(name)) return match
      const renamed = DOM_NAMES[name] ?? camel(name)
      if (value === undefined)
        return renamed !== name && (DOM_NAMES[name] || api.props.has(renamed))
          ? `${space}${renamed}`
          : match
      if (LITERAL.test(value) && (bare !== undefined || !STRING_ATTRIBUTES.has(renamed)))
        return `${space}${renamed}={${value}}`
      return `${space}${renamed}="${value}"`
    },
  )
}

const GENERIC = new Set(['error', 'close', 'empty'])

export function reactInline(content: string, api: PageApi, prose = true) {
  if (api.eventNames[content]) return api.eventNames[content]
  if (content === 'v-model') return `${api.model} / on${pascal(api.model)}Change`
  const model = /^v-model:(.+)$/.exec(content)
  if (model) return `${camel(model[1]!)} / on${pascal(model[1]!)}Change`
  if (content === 'class') return 'className'
  if (content === 'as-child') return 'asChild'
  if (/^update:[\w-]+(\(.*\))?$/.test(content)) return eventOf(api, content)
  if (AT_RULES.test(content)) return content
  if (/^@[\w:-]+$/.test(content)) return eventOf(api, content)
  const slot = /^#([\w-]+)(\(.*\))?(=".*")?$/.exec(content)
  if (slot && !/^[\da-f]{3,8}$/i.test(slot[1]!)) return `${slotOf(api, slot[1]!)}${slot[2] ?? ''}`
  if (
    prose &&
    !GENERIC.has(content) &&
    api.events.has(content) &&
    !api.props.has(content) &&
    !api.slots.has(content)
  )
    return api.events.get(content)!
  if (DOM_NAMES[content]) return DOM_NAMES[content]
  if (ATTRIBUTES.test(content) && /[:@=]|-/.test(content)) return attributes(content, api)
  return content.replace(/@hina-ui\/vue/g, '@hina-ui/react')
}

function inlineText(token: Token | undefined) {
  return (token?.children ?? [])
    .map(child => child.content)
    .join('')
    .trim()
}

function codes(cell: Token | undefined) {
  return (cell?.children ?? []).filter(child => child.type === 'code_inline')
}

function renameCell(cell: Token | undefined, kind: Kind, params: string, api: PageApi) {
  const children = cell?.children ?? []
  const spans = codes(cell)
  if (!spans.length) {
    const text = children.find(child => child.type === 'text')
    if (kind === 'slots' && text?.content.trim() === 'default') text.content = 'children'
    return
  }
  for (const span of spans) {
    const names = span.content.split(/\s*\/\s*/).map(part => {
      const original = part === 'className' ? 'class' : part.replace(/^#/, '')
      if (kind === 'slots') return slotName(api, original, params)
      if (kind === 'events') return eventName(api, original)
      const renamed = reactName(kind, original, params, [], api.model)
      return renamed === original ? reactInline(part, api, false) : renamed
    })
    span.content = [...new Set(names)].join(' / ')
  }
}

export function adaptForReact(tokens: Token[], locale: Locale, api: PageApi) {
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!

    if (token.type === 'inline')
      for (const child of token.children ?? [])
        if (child.type === 'code_inline') child.content = reactInline(child.content, api)

    if (token.type === 'fence')
      token.content = token.content.replace(/@hina-ui\/vue/g, '@hina-ui/react')

    if (token.type !== 'table_open') continue
    const cells: Token[][] = []
    let row: Token[] = []
    let end = index
    for (let cursor = index; cursor < tokens.length; cursor += 1) {
      const current = tokens[cursor]!
      if (current.type === 'tr_open') row = []
      if (current.type === 'inline') row.push(current)
      if (current.type === 'tr_close') cells.push(row)
      if (current.type === 'table_close') {
        end = cursor
        break
      }
    }
    const [head, ...body] = cells
    const kind = kindOf(inlineText(head?.[0]))
    const scoped = (head?.length ?? 0) > 2 && PARAMS.test(inlineText(head?.[1]))
    for (const [rowIndex, row] of cells.entries())
      for (const [column, cell] of row.entries()) {
        if (kind && rowIndex > 0 && column === 0) continue
        for (const child of codes(cell)) child.content = reactInline(child.content, api, column > 0)
      }
    if (kind && head) {
      const label = headers[locale][kind]
      if (label && head[0]?.children?.[0]) {
        head[0].children = head[0].children.slice(0, 1)
        head[0].children[0]!.content = label
      }
      for (const cells of body) renameCell(cells[0], kind, scoped ? inlineText(cells[1]) : '', api)
    }
    index = end
  }
  return tokens
}

const CODE = '`[^`\\n]+`'
const LIST_ZH = `(?:${CODE}\\s*(?:、|，|,|和|与|或|及|以及)\\s*)*${CODE}`
const LIST_EN = `(?:${CODE}(?:,\\s+and\\s+|,\\s+or\\s+|,\\s*|\\s+and\\s+|\\s+or\\s+))*${CODE}`
const CJK = /[㐀-鿿\w]/

type Replacer = (substring: string, ...args: any[]) => string
type Rule = [RegExp, (api: PageApi) => Replacer]

function mapList(list: string, map: (name: string) => string) {
  return list.replace(/`([^`\n]+)`/g, (_match, name: string) => `\`${map(name)}\``)
}

function events(api: PageApi, list: string) {
  return [...list.matchAll(/`([^`\n]+)`/g)].every(found => isEvent(api, found[1]!))
}

function isEvent(api: PageApi, raw: string) {
  const name = raw.replace(/^@/, '').replace(/\(.*\)$/, '')
  return api.events.has(name) || /^(update:|on[A-Z])/.test(name) || raw.startsWith('@')
}

function spaced(insert: string, offset: number, match: string, whole: string) {
  const before = whole[offset - 1] ?? ''
  const after = whole[offset + match.length] ?? ''
  return `${/^[`\w]/.test(insert) && CJK.test(before) ? ' ' : ''}${insert}${
    /[`\w]$/.test(insert) && CJK.test(after) ? ' ' : ''
  }`
}

function code(insert: string): Replacer {
  return (match: string, ...rest: unknown[]) => {
    const whole = rest[rest.length - 1] as string
    const offset = rest[rest.length - 2] as number
    return spaced(insert, offset, match, whole)
  }
}

const verbs: Record<string, string> = {
  emits: 'calls',
  emitting: 'calling',
  emit: 'call',
  fires: 'calls',
  firing: 'calling',
  fire: 'call',
  triggers: 'calls',
  triggering: 'calling',
  trigger: 'call',
}

const rules: Record<Locale, Rule[]> = {
  'zh-CN': [
    [
      new RegExp(`(${LIST_ZH})(\\s*)插槽(?!值|参数|内容|属性|名)`, 'g'),
      api => (_match: string, list: string, space: string) =>
        `${mapList(list, name => slotOf(api, name))}${space}属性`,
    ],
    [/默认(?:内容)?插槽/g, () => code('`children`')],
    [/插槽内容/g, () => () => '传入的内容'],
    [/插槽负责触发/g, () => code('`children` 负责触发')],
    [/插槽中的触发器/g, () => code('`children` 中的触发器')],
    [/提供空插槽也不会恢复默认布局/g, () => () => '返回空内容也不会恢复默认布局'],
    [/插槽根元素/g, () => () => '子元素'],
    [/插槽参数/g, () => () => '渲染函数参数'],
    [
      /插槽(中的|的|提供的)(\s*`)/g,
      () => (_m: string, tail: string, space: string) => `渲染函数${tail}${space}`,
    ],
    [
      new RegExp(`(触发|发出|派发|抛出)\\s*(${CODE})\\s*事件`, 'g'),
      api => (match: string, _verb: string, name: string) =>
        events(api, name) ? `调用 ${mapList(name, raw => eventOf(api, raw))}` : match,
    ],
    [
      new RegExp(`(${LIST_ZH})\\s*事件的处理函数`, 'g'),
      api => (match: string, list: string) =>
        events(api, list) ? `${mapList(list, raw => eventOf(api, raw))} 回调` : match,
    ],
    [
      new RegExp(`(${LIST_ZH})(\\s*)事件(?!监听|处理)`, 'g'),
      api => (match: string, list: string, space: string) =>
        events(api, list) ? `${mapList(list, raw => eventOf(api, raw))}${space}回调` : match,
    ],
    [
      new RegExp(`事件\\s*(${CODE})`, 'g'),
      api => (match: string, name: string) =>
        events(api, name) ? `回调 ${mapList(name, raw => eventOf(api, raw))}` : match,
    ],
    [
      new RegExp(`(触发|发出)\\s*(${CODE})`, 'g'),
      api => (match: string, _verb: string, name: string) =>
        events(api, name) ? `调用 ${mapList(name, raw => eventOf(api, raw))}` : match,
    ],
    [/事件监听器/g, () => () => '事件处理函数'],
    [/模板引用/g, () => code('ref')],
    [/支持双向绑定/g, () => () => '可受控'],
    [/支持\s*`v-model(?::[\w-]+)?`/g, () => () => '可受控'],
    [/双向绑定/g, () => () => '受控'],
    [/Reka 的全局方向配置/g, () => code('`ConfigProvider` 的全局方向配置')],
    [/Reka 的全局配置/g, () => code('`ConfigProvider` 的全局配置')],
    [/Reka 的方向提供器/g, () => code('`ConfigProvider`')],
    [/Vue 组件/g, () => () => 'React 组件'],
  ],
  en: [
    [
      new RegExp(
        `(${LIST_EN})(\\s+)slot(s?)\\b(?!\\s+(?:values?|props?|param|parameters|content))`,
        'g',
      ),
      api => (_match: string, list: string, space: string, plural: string) =>
        `${mapList(list, name => slotOf(api, name))}${space}prop${plural}`,
    ],
    [/\b(?:[Tt]he|[Aa]n?)\s+default\s+slot\b/g, () => () => '`children`'],
    [/\bdefault\s+slot\b/g, () => () => '`children`'],
    [
      /\b([Ss])lot content\b/g,
      () => (_m: string, s: string) => `${s === 'S' ? 'S' : 's'}upplied content`,
    ],
    [
      /\b([Ss])lot props\b/g,
      () => (_m: string, s: string) => `${s === 'S' ? 'R' : 'r'}ender props`,
    ],
    [/\b([Ss])lot prop\b/g, () => (_m: string, s: string) => `${s === 'S' ? 'R' : 'r'}ender prop`],
    [
      /\b([Ss])lot parameters\b/g,
      () => (_m: string, s: string) => `${s === 'S' ? 'R' : 'r'}ender function parameters`,
    ],
    [
      new RegExp(
        `\\b(emits|emitting|emit|fires|firing|fire|triggers|triggering|trigger)\\s+(?:(an?|the)\\s+)?(${LIST_EN})(\\s+events?\\b)?`,
        'g',
      ),
      api => (match: string, verb: string, _article: string, list: string) => {
        if (!events(api, list)) return match
        return `${verbs[verb]} ${mapList(list, raw => eventOf(api, raw))}`
      },
    ],
    [
      new RegExp(`(${LIST_EN})\\s+(is|are)\\s+emitted\\b`, 'g'),
      api => (match: string, list: string, verb: string) =>
        events(api, list) ? `${mapList(list, raw => eventOf(api, raw))} ${verb} called` : match,
    ],
    [
      new RegExp(`(${LIST_EN})(\\s+)event(s?)\\b`, 'g'),
      api => (match: string, list: string, space: string, plural: string) =>
        events(api, list)
          ? `${mapList(list, raw => eventOf(api, raw))}${space}callback${plural}`
          : match,
    ],
    [/(`on[A-Z]\w*`)\s+emits\b/g, () => (_m: string, name: string) => `${name} receives`],
    [
      /\b(callbacks?)\s+(is|are)\s+emitted\b/g,
      () => (_m: string, noun: string, verb: string) => `${noun} ${verb} called`,
    ],
    [/\bis emitted as\s+(`on\w+`)/g, () => (_m: string, name: string) => `is passed to ${name}`],
    [
      /\b([Ee])mitted when\b/g,
      () => (_m: string, e: string) => `${e === 'E' ? 'C' : 'c'}alled when`,
    ],
    [/\bthe slot's root element\b/g, () => () => 'the child element'],
    [/\btemplate refs?\b/g, () => match => (match.endsWith('s') ? 'refs' : 'ref')],
    [/\bsupports (?:two-way binding|v-model)\b/g, () => () => 'can be controlled'],
    [/\bsupports\s+`v-model(?::[\w-]+)?`/g, () => () => 'can be controlled'],
    [/\bbound two-way\b/g, () => () => 'controlled'],
    [/\btwo-way binding\b/g, () => () => 'controlled state'],
    [
      /Reka's global direction configuration/g,
      () => () => 'the global direction from `ConfigProvider`',
    ],
    [/Reka's global direction\b/g, () => () => 'the global direction from `ConfigProvider`'],
    [/Reka's global configuration/g, () => () => 'the global configuration from `ConfigProvider`'],
    [/Reka's direction provider/g, () => () => '`ConfigProvider`'],
    [/\bVue components?\b/g, () => match => match.replace('Vue', 'React')],
  ],
}

function cjk(replacer: Replacer): Replacer {
  return (match: string, ...rest: unknown[]) => {
    const output = replacer(match, ...rest)
    if (output === match) return output
    return spaced(output, rest[rest.length - 2] as number, match, rest[rest.length - 1] as string)
  }
}

export function reactText(text: string, locale: Locale, api: PageApi) {
  return text
    .split(/(\]\([^)]*\))/)
    .map((part, index) =>
      index % 2
        ? part
        : rules[locale].reduce(
            (current, [pattern, make]) =>
              current.replace(pattern, locale === 'zh-CN' ? cjk(make(api)) : make(api)),
            part,
          ),
    )
    .join('')
}

const HEADING = /^(#{1,6}\s+)(.*?)(\s*\{#[\w-]+\})?\s*$/
const FRONT = /^(title|description):(\s*)(['"]?)(.*?)\3\s*$/

export function reactProse(source: string, locale: Locale, api: PageApi) {
  const lines = source.split('\n')
  let fence: string | undefined
  let front = lines[0] === '---'
  let script = false
  let table: Kind | undefined
  for (let index = front ? 1 : 0; index < lines.length; index += 1) {
    const line = lines[index]!
    if (front) {
      if (line === '---') front = false
      else {
        const field = FRONT.exec(line)
        if (field)
          lines[index] =
            `${field[1]}:${field[2]}${field[3]}${reactText(field[4]!, locale, api)}${field[3]}`
      }
      continue
    }
    const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1]
    if (fence) {
      if (marker && marker[0] === fence[0] && marker.length >= fence.length) fence = undefined
      continue
    }
    if (marker) {
      fence = marker
      continue
    }
    if (/^\s*<script\b/.test(line)) script = true
    if (script) {
      if (/<\/script>/.test(line)) script = false
      continue
    }
    if (/^\s*<[A-Za-z/!]/.test(line)) continue
    if (line.startsWith('|')) {
      const parts = line.split(/(?<!\\)\|/)
      if (!lines[index - 1]?.startsWith('|')) table = kindOf(parts[1] ?? '')
      if (table === 'slots' && parts[1]?.trim() === 'default')
        parts[1] = parts[1].replace('default', '`children`')
      lines[index] = parts
        .map((part, position) =>
          position === 0 || (table && position === 1 && !/^\|\s*:?-/.test(line))
            ? part
            : reactText(part, locale, api),
        )
        .join('|')
      continue
    }
    const heading = HEADING.exec(line)
    if (heading) {
      const label = heading[2]!
      lines[index] =
        `${heading[1]}${reactHeading(locale, label) ?? reactText(label, locale, api)}${heading[3] ?? ''}`
      continue
    }
    lines[index] = reactText(line, locale, api)
  }
  return lines.join('\n')
}

export function componentOf(path: string) {
  return path.startsWith('components/') ? path.slice('components/'.length) : ''
}

export function sourceApi(source: string, path: string) {
  return pageApi(frameworkView(source, 'vue'), componentOf(path))
}

export function reactSource(
  source: string,
  locale: Locale,
  path: string,
  api = sourceApi(source, path),
) {
  const view = frameworkView(source, 'react')
  if (path === 'changelog') return view
  return reactProse(view, locale, api)
}
