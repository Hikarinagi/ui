const GUARD = 'data-reka-focus-guard'
let count = 0

function createFocusGuard() {
  const element = document.createElement('span')
  element.setAttribute(GUARD, '')
  element.tabIndex = 0
  element.style.outline = 'none'
  element.style.opacity = '0'
  element.style.position = 'fixed'
  element.style.pointerEvents = 'none'
  return element
}

export function installFocusGuards() {
  const edges = document.querySelectorAll(`[${GUARD}]`)
  document.body.insertAdjacentElement('afterbegin', edges[0] ?? createFocusGuard())
  document.body.insertAdjacentElement('beforeend', edges[1] ?? createFocusGuard())
  count += 1
  return () => {
    if (count === 1) for (const node of document.querySelectorAll(`[${GUARD}]`)) node.remove()
    count -= 1
  }
}
