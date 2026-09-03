const INTERACTIVE = 'button, a, input, textarea, select, [contenteditable], [role="button"]'
const CONTROL = 'input:not([type="hidden"]), textarea'

function controlOf(node: Element) {
  const control = node.matches(CONTROL) ? node : node.querySelector(CONTROL)
  return control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement
    ? control
    : null
}

/**
 * 点击输入面里非交互的部分（附属格、前后缀、空白）时把焦点交给最近的输入区，返回被聚焦的输入区；点击落在交互元素上或者没有可聚焦的输入区时返回 null。
 * 点击所在的段自己含输入区时只认它、不动光标（段内的处理器已经定过位）；否则先向后找，再向前找；落在点击位置之后的输入区把光标放到开头，之前的放到末尾。
 */
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
