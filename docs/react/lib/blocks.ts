export interface PlaygroundControl {
  prop: string
  options?: readonly string[]
  default?: string | boolean
}

export interface BlockTag {
  name: string
  attrs: Record<string, string>
}

const TAG = /^\s*<([A-Z][A-Za-z]*)\b([\s\S]*?)\/>\s*$/

export function parseBlock(source: string): BlockTag | undefined {
  const match = TAG.exec(source)
  if (!match) return undefined
  const attrs: Record<string, string> = {}
  for (const [, key, value] of match[2]!.matchAll(/(:?[\w-]+)="([^"]*)"/g)) attrs[key!] = value!
  return { name: match[1]!, attrs }
}

export function parseControls(source = '[]'): PlaygroundControl[] {
  const json = source
    .replace(/'/g, '"')
    .replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":')
    .replace(/,\s*([\]}])/g, '$1')
  return JSON.parse(json) as PlaygroundControl[]
}

export function initialValue(control: PlaygroundControl): string | boolean {
  return control.default ?? control.options?.[0] ?? false
}

export function playgroundCode(
  name: string,
  label: string | undefined,
  controls: PlaygroundControl[],
  state: Record<string, string | boolean> = {},
) {
  const attrs = controls
    .filter(control => (state[control.prop] ?? initialValue(control)) !== initialValue(control))
    .map(control => {
      const value = state[control.prop]
      if (value === true) return ` ${control.prop}`
      if (value === false) return ` ${control.prop}={false}`
      return ` ${control.prop}="${value}"`
    })
    .join('')
  return label ? `<${name}${attrs}>${label}</${name}>` : `<${name}${attrs} />`
}
