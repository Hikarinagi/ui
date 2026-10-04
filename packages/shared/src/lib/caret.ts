const MIRRORED = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'font-variant',
  'font-feature-settings',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-indent',
  'text-transform',
  'tab-size',
  'direction',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
]

export function caretTop(node: HTMLTextAreaElement, at = node.selectionEnd): number {
  const style = getComputedStyle(node)
  const mirror = node.ownerDocument.createElement('div')
  for (const prop of MIRRORED) mirror.style.setProperty(prop, style.getPropertyValue(prop))
  Object.assign(mirror.style, {
    position: 'absolute',
    top: '0',
    insetInlineStart: '-9999px',
    visibility: 'hidden',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    width: `${node.offsetWidth}px`,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
  })
  mirror.textContent = node.value.slice(0, at)
  const marker = node.ownerDocument.createElement('span')
  marker.textContent = node.value.slice(at) || '​'
  mirror.append(marker)
  node.ownerDocument.body.append(mirror)
  const top = marker.offsetTop
  mirror.remove()
  return top
}
