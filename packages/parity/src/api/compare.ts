import {
  CONTENT_SLOTS,
  DOM_NAMES,
  EVENT_NAMES,
  SLOT_NAMES,
  camel,
  componentMapping,
  reactDefault,
  reactEvent,
  reactProp,
  reactSlot,
} from './mapping'
import type { Undeclared } from './coverage'
import type { Member, ReactSurface, VueSurface } from './types'

type Kind = 'prop' | 'model' | 'default' | 'callback' | 'content'

interface Expectation {
  kind: Kind
  source: string
  vue?: Member
  merged?: string
  scoped?: boolean
}

const ALWAYS_ALLOWED = new Set(['ref', 'key', 'style'])

function describe(kind: Kind, source: string) {
  if (kind === 'model') return source === 'modelValue' ? 'v-model' : `v-model:${source}`
  if (kind === 'default')
    return source === 'modelValue' ? 'v-model, uncontrolled' : `v-model:${source}, uncontrolled`
  if (kind === 'callback') return `emit ${source}`
  if (kind === 'content') return `slot ${source}`
  return ''
}

function label(kind: Kind) {
  if (kind === 'callback') return 'callback'
  if (kind === 'content') return 'content'
  return 'prop'
}

export function expectations(vue: VueSurface) {
  const mapping = componentMapping(vue.directory)
  const expected = new Map<string, Expectation>()
  const mappingGaps: string[] = []
  expected.set('className', { kind: 'prop', source: 'class' })
  for (const prop of vue.props) {
    const model = vue.models.includes(prop.name)
    expected.set(reactProp(prop.name, mapping.model), {
      kind: model ? 'model' : 'prop',
      source: prop.name,
      vue: prop,
    })
    if (model)
      expected.set(reactDefault(prop.name, mapping.model), { kind: 'default', source: prop.name })
  }
  for (const event of vue.events) {
    const name = reactEvent(event, mapping.model, mapping.eventNames)
    const taken = expected.get(name)
    if (taken?.kind === 'callback')
      mappingGaps.push(
        `mapping: emit ${event} and ${describe(taken.kind, taken.source)} both map to ${name}; add EVENT_NAMES['${vue.directory}']`,
      )
    else expected.set(name, { kind: 'callback', source: event })
  }
  for (const slot of vue.slots) {
    const name = reactSlot(slot.name, slot.scoped, mapping.renamed, mapping.slotNames)
    const taken = expected.get(name)
    if (taken && taken.kind !== 'content') taken.merged = slot.name
    else expected.set(name, { kind: 'content', source: slot.name, scoped: slot.scoped })
  }
  return { expected, mappingGaps }
}

export function forwardedNames(vue: VueSurface) {
  const names = new Set<string>()
  for (const { name, directory } of vue.attributes) {
    const { model } = componentMapping(directory)
    const update = /^onUpdate:(.+)$/.exec(name)
    if (update) names.add(reactEvent(`update:${update[1]}`, model))
    else if (/^on[A-Z]/.test(name)) names.add(name)
    else {
      names.add(reactProp(name, model))
      if (DOM_NAMES[name]) names.add(DOM_NAMES[name])
      if (name === 'modelValue') names.add(reactDefault(name, model))
    }
  }
  return names
}

function sameValues(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

export function compareSurface(vue: VueSurface, react: ReactSurface | undefined) {
  if (!react) return ['missing React component']
  const { expected, mappingGaps } = expectations(vue)
  const gaps = [...mappingGaps]
  const props = new Map(react.props.map(prop => [prop.name, prop]))
  for (const [name, expectation] of expected) {
    const prop = props.get(name)
    const origin = describe(expectation.kind, expectation.source)
    const suffix = origin ? ` (${origin})` : ''
    if (!prop) {
      gaps.push(`missing ${label(expectation.kind)} ${name}${suffix}`)
      continue
    }
    if (
      !prop.own &&
      name !== 'children' &&
      (expectation.kind === 'callback' || expectation.kind === 'content')
    )
      gaps.push(
        `missing ${label(expectation.kind)} ${name}${suffix}: only the DOM attribute exists`,
      )
    if (expectation.kind === 'content' && expectation.scoped && !prop.callable)
      gaps.push(`content ${name}${suffix}: is not a render function`)
    if (expectation.kind === 'content' && !expectation.scoped && !prop.node)
      gaps.push(`content ${name}${suffix}: does not accept a ReactNode`)
    if (expectation.merged && !prop.node)
      gaps.push(`content ${name} (slot ${expectation.merged}): does not accept a ReactNode`)
    const vueProp = expectation.vue
    if (!vueProp) continue
    if (vueProp.required && !prop.required) gaps.push(`optional ${name}: required in Vue`)
    if (!vueProp.required && prop.required) gaps.push(`required ${name}: optional in Vue`)
    if (
      !expectation.merged &&
      vueProp.values &&
      prop.values &&
      !sameValues(vueProp.values, prop.values)
    )
      gaps.push(
        `values ${name}: Vue ${vueProp.values.join(' | ')}, React ${prop.values.join(' | ')}`,
      )
  }
  const as = vue.props.find(prop => prop.name === 'as')
  const anchor = as && (!as.values || as.values.includes('string') || as.values.includes('"a"'))
  if (anchor && !props.has('href'))
    gaps.push('missing prop href (fallthrough attribute with as="a")')
  const forwarded = forwardedNames(vue)
  const accepted = (name: string) => expected.has(name) || forwarded.has(name)
  for (const prop of react.props) {
    if (!prop.own || accepted(prop.name) || ALWAYS_ALLOWED.has(prop.name)) continue
    const controlled = /^default([A-Z].*)$/.exec(prop.name)
    if (controlled) {
      const base = controlled[1]![0]!.toLowerCase() + controlled[1]!.slice(1)
      if (accepted(base) && accepted(`on${controlled[1]}Change`)) continue
    }
    if (prop.name === 'href' && props.has('as')) continue
    gaps.push(`extra prop ${prop.name}`)
  }
  const handle = react.handle
  for (const member of vue.exposed)
    if (!handle?.members.includes(member)) gaps.push(`missing handle ${member}`)
  if (handle && !handle.element)
    for (const member of handle.members)
      if (!vue.exposed.includes(member)) gaps.push(`extra handle ${member}`)
  return gaps.sort()
}

export function withUndeclared(vue: VueSurface[], undeclared: Record<string, Undeclared>) {
  return vue.map(surface => {
    const extra = undeclared[surface.name]
    if (!extra) return surface
    return {
      ...surface,
      props: [
        ...surface.props,
        ...(extra.props ?? []).map(name => ({
          name,
          required: false,
          type: 'unknown',
          callable: false,
        })),
      ],
      events: [...surface.events, ...(extra.events ?? [])],
      slots: [...surface.slots, ...(extra.slots ?? []).map(name => ({ name, scoped: false }))],
    }
  })
}

export function compareSurfaces(vue: VueSurface[], react: ReactSurface[]) {
  const byName = new Map(react.map(surface => [surface.name, surface]))
  const result: Record<string, string[]> = {}
  for (const surface of vue) {
    const gaps = compareSurface(surface, byName.get(surface.name))
    if (gaps.length) result[surface.name] = gaps
  }
  return result
}

export function unusedMappings(vue: VueSurface[]) {
  const unused: string[] = []
  const directories = new Map<string, VueSurface[]>()
  for (const surface of vue)
    directories.set(surface.directory, [...(directories.get(surface.directory) ?? []), surface])
  for (const [directory, slots] of Object.entries(CONTENT_SLOTS))
    for (const slot of slots)
      if (
        !(directories.get(directory) ?? []).some(
          surface =>
            surface.slots.some(entry => entry.name === slot && !entry.scoped) &&
            surface.props.some(prop => prop.name === camel(slot)),
        )
      )
        unused.push(`CONTENT_SLOTS['${directory}'] ${slot}`)
  for (const [directory, names] of Object.entries(SLOT_NAMES))
    for (const slot of Object.keys(names))
      if (!(directories.get(directory) ?? []).some(s => s.slots.some(e => e.name === slot)))
        unused.push(`SLOT_NAMES['${directory}'] ${slot}`)
  for (const [directory, names] of Object.entries(EVENT_NAMES))
    for (const event of Object.keys(names))
      if (!(directories.get(directory) ?? []).some(s => s.events.includes(event)))
        unused.push(`EVENT_NAMES['${directory}'] ${event}`)
  return unused
}
