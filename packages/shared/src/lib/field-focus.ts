const INTERACTIVE = 'button, a, input, textarea, select, [contenteditable], [role="button"]'
const CONTROL = 'input:not([type="hidden"]), textarea'

function controlOf(node: Element) {
  const control = node.matches(CONTROL) ? node : node.querySelector(CONTROL)
  return control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement
    ? control
    : null
}

export function focusFieldFrom(root: HTMLElement, target: HTMLElement) {
  if (target.closest(INTERACTIVE)) return null
  const segments = Array.from(root.children)
  const from = segments.findIndex(segment => segment.contains(target))
  const own = from >= 0 ? controlOf(segments[from]!) : null
  if (own && !own.disabled) {
    own.focus()
    return own
  }
  const after = segments.slice(from + 1)
  const before = segments.slice(0, Math.max(from, 0)).reverse()
  for (const [list, caret] of [
    [after, 'start'],
    [before, 'end'],
  ] as const) {
    for (const segment of list) {
      const control = controlOf(segment)
      if (!control || control.disabled) continue
      control.focus()
      const at = caret === 'start' ? 0 : control.value.length
      control.setSelectionRange(at, at)
      return control
    }
  }
  return null
}
