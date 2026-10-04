export const pascal = (name: string) =>
  name
    .split(/[-:]/)
    .filter(Boolean)
    .map(part => part[0]!.toUpperCase() + part.slice(1))
    .join('')

export const camel = (name: string) =>
  name.replace(/-([a-z0-9])/g, (_match, next: string) => next.toUpperCase())

export const CONTENT_SLOTS: Record<string, string[]> = {
  dialog: ['title'],
  sheet: ['title'],
  drawer: ['title'],
  masonry: ['loading'],
  'data-table': ['loading'],
  'virtual-list': ['loading'],
  autocomplete: ['loading'],
  image: ['skeleton'],
  'app-shell': ['sidebar'],
}

export const SLOT_NAMES: Record<string, Record<string, string>> = {
  'data-table': { 'footer-key': 'renderColumnFooter' },
}

export const EVENT_NAMES: Record<string, Record<string, string>> = {
  'data-list': { pageChange: 'onPaginationChange' },
}

export const MODEL_PROPS: Record<string, string> = {
  checkbox: 'checked',
  switch: 'checked',
}

export const DOM_NAMES: Record<string, string> = {
  tabindex: 'tabIndex',
  maxlength: 'maxLength',
  minlength: 'minLength',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  readonly: 'readOnly',
  inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint',
  spellcheck: 'spellCheck',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  for: 'htmlFor',
}

export interface ComponentMapping {
  model: string
  renamed: string[]
  slotNames: Record<string, string>
  eventNames: Record<string, string>
}

export function componentMapping(component: string): ComponentMapping {
  return {
    model: MODEL_PROPS[component] ?? 'value',
    renamed: CONTENT_SLOTS[component] ?? [],
    slotNames: SLOT_NAMES[component] ?? {},
    eventNames: EVENT_NAMES[component] ?? {},
  }
}

export function reactProp(name: string, model = 'value') {
  if (name === 'modelValue') return model
  if (name === 'class') return 'className'
  return name
}

export function reactDefault(name: string, model = 'value') {
  return `default${pascal(reactProp(name, model))}`
}

export function reactEvent(name: string, model = 'value', names: Record<string, string> = {}) {
  if (names[name]) return names[name]
  if (/^on[A-Z]/.test(name)) return name
  if (name === 'update:modelValue') return `on${pascal(model)}Change`
  const match = /^update:(.+)$/.exec(name)
  if (match) return `on${pascal(match[1]!)}Change`
  return `on${pascal(name)}`
}

export function reactSlot(
  name: string,
  scoped: boolean,
  renamed: readonly string[] = [],
  names: Record<string, string> = {},
) {
  if (name === 'default') return 'children'
  if (names[name]) return names[name]
  const dynamic = /^(.+)-key$/.exec(name)
  if (dynamic) return `render${pascal(dynamic[1]!)}`
  if (!scoped) return renamed.includes(name) ? `${camel(name)}Content` : camel(name)
  return `render${pascal(name)}`
}
