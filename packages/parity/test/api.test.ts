import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { compareSurface, compareSurfaces, unusedMappings, withUndeclared } from '../src/api/compare'
import { EXCEPTIONS, REACT_ONLY, UNDECLARED } from '../src/api/coverage'
import { extractReact } from '../src/api/react'
import type { ReactMember, ReactSurface, VueSurface } from '../src/api/types'
import { extractVue } from '../src/api/vue'

type Pending = Record<string, { reason: string; gaps: string[] }>

const pendingFile = new URL('../coverage/api-pending.json', import.meta.url)
let pending: Pending = JSON.parse(readFileSync(pendingFile, 'utf8'))

const declared = extractVue()
const vue = withUndeclared(declared, UNDECLARED)
const react = extractReact(vue.map(surface => surface.name))
const raw = compareSurfaces(vue, react)

const reactOnlyKey = (component: string, gap: string) => {
  const match = /^extra (?:prop|handle) (\S+)$/.exec(gap)
  return match ? `${component}.${match[1]}` : undefined
}

const waived = (component: string, gap: string) => {
  const key = reactOnlyKey(component, gap)
  return `${component}: ${gap}` in EXCEPTIONS || (!!key && key in REACT_ONLY)
}

const open = Object.fromEntries(
  Object.entries(raw)
    .map(([component, gaps]) => [component, gaps.filter(gap => !waived(component, gap))] as const)
    .filter(([, gaps]) => gaps.length),
)

const flatten = (gaps: Record<string, string[]>) =>
  Object.entries(gaps).flatMap(([component, list]) => list.map(gap => `${component}: ${gap}`))

if (process.env.HINA_UPDATE_API_PENDING) {
  const pruned: Pending = {}
  for (const [component, entry] of Object.entries(pending)) {
    const gaps = entry.gaps.filter(gap => open[component]?.includes(gap))
    if (gaps.length) pruned[component] = { reason: entry.reason, gaps }
  }
  if (JSON.stringify(pruned) !== JSON.stringify(pending)) {
    const prettier = await import('prettier')
    const options = await prettier.resolveConfig(fileURLToPath(pendingFile))
    const text = await prettier.format(JSON.stringify(pruned, null, 2), {
      ...options,
      parser: 'json',
    })
    writeFileSync(pendingFile, text)
  }
  pending = pruned
}

describe('API surface parity', () => {
  it('extracts every public Vue component and its React counterpart', () => {
    expect(vue.length).toBeGreaterThan(150)
    expect(react.map(surface => surface.name).sort()).toEqual(
      vue.map(surface => surface.name).sort(),
    )
  })

  it('every gap is fixed, recorded as an exception, or pending', () => {
    const listed = new Set(
      flatten(
        Object.fromEntries(
          Object.entries(pending).map(([component, entry]) => [component, entry.gaps]),
        ),
      ),
    )
    expect(flatten(open).filter(gap => !listed.has(gap))).toEqual([])
  })

  it('the pending list only shrinks: fixed gaps are removed from it', () => {
    const stale = Object.entries(pending).flatMap(([component, entry]) =>
      entry.gaps.filter(gap => !open[component]?.includes(gap)).map(gap => `${component}: ${gap}`),
    )
    expect(stale).toEqual([])
  })

  it('pending entries, exceptions, React-only extras and undeclared API give a reason', () => {
    const missing = [
      ...Object.entries(pending)
        .filter(([, entry]) => !entry.reason?.trim() || !entry.gaps.length)
        .map(([component]) => `pending ${component}`),
      ...Object.entries(EXCEPTIONS)
        .filter(([, reason]) => !reason.trim())
        .map(([key]) => `exception ${key}`),
      ...Object.entries(REACT_ONLY)
        .filter(([, reason]) => !reason.trim())
        .map(([key]) => `React-only ${key}`),
      ...Object.entries(UNDECLARED)
        .filter(([, entry]) => !entry.reason.trim())
        .map(([key]) => `undeclared ${key}`),
    ]
    expect(missing).toEqual([])
  })

  it('exceptions and React-only extras still describe a gap', () => {
    const gaps = new Set(flatten(raw))
    const extras = new Set(
      Object.entries(raw).flatMap(([component, list]) =>
        list.map(gap => reactOnlyKey(component, gap)).filter(Boolean),
      ),
    )
    expect([
      ...Object.keys(EXCEPTIONS).filter(key => !gaps.has(key)),
      ...Object.keys(REACT_ONLY).filter(key => !extras.has(key)),
    ]).toEqual([])
  })

  it('undeclared Vue API names components that do not declare it', () => {
    const stale = Object.entries(UNDECLARED).flatMap(([name, entry]) => {
      const surface = declared.find(candidate => candidate.name === name)
      if (!surface) return [`${name}: not a public Vue component`]
      return [
        ...(entry.props ?? []).filter(prop => surface.props.some(p => p.name === prop)),
        ...(entry.events ?? []).filter(event => surface.events.includes(event)),
        ...(entry.slots ?? []).filter(slot => surface.slots.some(s => s.name === slot)),
      ].map(member => `${name}: ${member} is declared`)
    })
    expect(stale).toEqual([])
  })

  it('mapping tables only name slots and events that exist', () => {
    expect(unusedMappings(declared)).toEqual([])
  })
})

const member = (name: string, values?: string[], required = false) => ({
  name,
  required,
  type: values?.join(' | ') ?? 'unknown',
  values,
  callable: false,
})

const reactMember = (name: string, options: Partial<ReactMember> = {}): ReactMember => ({
  ...member(name),
  own: true,
  node: false,
  ...options,
})

const surface = (overrides: Partial<VueSurface>): VueSurface => ({
  name: 'Sample',
  directory: 'sample',
  props: [],
  models: [],
  events: [],
  slots: [],
  exposed: [],
  attributes: [],
  ...overrides,
})

const reactSurface = (props: ReactMember[], handle?: ReactSurface['handle']): ReactSurface => ({
  name: 'Sample',
  props: [reactMember('className'), ...props],
  handle,
})

describe('API mapping rules', () => {
  it('maps v-model to value, defaultValue and onValueChange, or checked on Checkbox', () => {
    const vueSurface = surface({
      props: [member('modelValue', ['string'])],
      models: ['modelValue'],
      events: ['update:modelValue'],
    })
    expect(compareSurface(vueSurface, reactSurface([]))).toEqual([
      'missing callback onValueChange (emit update:modelValue)',
      'missing prop defaultValue (v-model, uncontrolled)',
      'missing prop value (v-model)',
    ])
    expect(
      compareSurface(
        { ...vueSurface, directory: 'checkbox' },
        reactSurface([
          reactMember('checked', { values: ['string'] }),
          reactMember('defaultChecked'),
          reactMember('onCheckedChange', { callable: true }),
        ]),
      ),
    ).toEqual([])
  })

  it('maps named models, emits, slots and exposed members', () => {
    const vueSurface = surface({
      props: [member('open', ['boolean']), member('title', ['string'], true)],
      models: ['open'],
      events: ['update:open', 'row-click'],
      slots: [
        { name: 'default', scoped: false },
        { name: 'icon', scoped: false },
        { name: 'title', scoped: false },
        { name: 'footer', scoped: true },
        { name: 'cell-key', scoped: true },
      ],
      exposed: ['focus'],
    })
    expect(
      compareSurface(
        vueSurface,
        reactSurface(
          [
            reactMember('open', { values: ['boolean'] }),
            reactMember('defaultOpen'),
            reactMember('onOpenChange', { callable: true }),
            reactMember('onRowClick', { callable: true }),
            reactMember('title', { required: true, node: true }),
            reactMember('children', { node: true }),
            reactMember('icon', { node: true }),
            reactMember('renderFooter', { callable: true }),
            reactMember('renderCell', { callable: true }),
          ],
          { element: false, members: ['focus'] },
        ),
      ),
    ).toEqual([])
  })

  it('reports missing, extra, mismatched and string-only members', () => {
    const vueSurface = surface({
      props: [
        member('size', ['"lg"', '"md"', '"sm"']),
        member('label', ['string'], true),
        member('as'),
      ],
      events: ['close'],
      slots: [
        { name: 'label', scoped: false },
        { name: 'item', scoped: true },
      ],
      exposed: ['focus'],
    })
    expect(
      compareSurface(
        vueSurface,
        reactSurface(
          [
            reactMember('size', { values: ['"md"', '"sm"'] }),
            reactMember('label', { values: ['string'] }),
            reactMember('as'),
            reactMember('onClose', { own: false, callable: true }),
            reactMember('renderItem', { node: true }),
            reactMember('tone'),
          ],
          { element: false, members: ['blur'] },
        ),
      ),
    ).toEqual([
      'content label (slot label): does not accept a ReactNode',
      'content renderItem (slot item): is not a render function',
      'extra handle blur',
      'extra prop tone',
      'missing callback onClose (emit close): only the DOM attribute exists',
      'missing handle focus',
      'missing prop href (fallthrough attribute with as="a")',
      'optional label: required in Vue',
      'values size: Vue "lg" | "md" | "sm", React "md" | "sm"',
    ])
  })

  it('accepts props that Vue forwards to the element receiving $attrs', () => {
    const vueSurface = surface({
      attributes: [
        { name: 'modelValue', directory: 'checkbox' },
        { name: 'onUpdate:open', directory: '' },
        { name: 'tabindex', directory: '' },
      ],
    })
    expect(
      compareSurface(
        vueSurface,
        reactSurface([
          reactMember('checked'),
          reactMember('defaultChecked'),
          reactMember('onOpenChange'),
          reactMember('tabIndex'),
        ]),
      ),
    ).toEqual([])
  })

  it('requires a descriptive name when an emit collides with a model callback', () => {
    expect(
      compareSurface(
        surface({
          props: [member('page', ['number'])],
          models: ['page'],
          events: ['update:page', 'pageChange'],
        }),
        reactSurface([
          reactMember('page', { values: ['number'] }),
          reactMember('defaultPage'),
          reactMember('onPageChange'),
        ]),
      ),
    ).toEqual([
      "mapping: emit pageChange and emit update:page both map to onPageChange; add EVENT_NAMES['sample']",
    ])
  })
})
