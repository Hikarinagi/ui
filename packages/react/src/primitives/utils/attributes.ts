const REACT_NAMES: Record<string, string> = {
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  class: 'className',
  for: 'htmlFor',
  inputmode: 'inputMode',
  readonly: 'readOnly',
  spellcheck: 'spellCheck',
  tabindex: 'tabIndex',
}

const BOOLEAN_ATTRIBUTES = new Set([
  'checked',
  'disabled',
  'hidden',
  'multiple',
  'readonly',
  'required',
  'selected',
])

export function reactAttributes(attributes: Record<string, unknown>) {
  const props: Record<string, unknown> = {}
  for (const [name, value] of Object.entries(attributes)) {
    const present = value !== undefined && value !== null && value !== false
    props[REACT_NAMES[name] ?? name] = BOOLEAN_ATTRIBUTES.has(name)
      ? present || undefined
      : (value ?? undefined)
  }
  return props
}
