export interface Hotkey {
  key: string
  mod: boolean
  shift: boolean
  alt: boolean
}

export function parseHotkey(spec: string): Hotkey {
  const parts = spec
    .toLowerCase()
    .split('+')
    .map(part => part.trim())
    .filter(Boolean)
  const modifiers = parts.slice(0, -1)
  return {
    key: parts.at(-1) ?? '',
    mod: modifiers.includes('mod'),
    shift: modifiers.includes('shift'),
    alt: modifiers.includes('alt'),
  }
}

export function matchesHotkey(event: KeyboardEvent, hotkey: Hotkey): boolean {
  if (event.key.toLowerCase() !== hotkey.key) return false
  const mod = event.metaKey || event.ctrlKey
  return mod === hotkey.mod && event.shiftKey === hotkey.shift && event.altKey === hotkey.alt
}
