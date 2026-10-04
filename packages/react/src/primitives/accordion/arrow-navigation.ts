const IGNORED = ['INPUT', 'TEXTAREA']

export interface ArrowNavigationOptions {
  arrowKeyOptions?: 'horizontal' | 'vertical' | 'both'
  attributeName?: string
  itemsArray?: HTMLElement[]
  loop?: boolean
  dir?: 'ltr' | 'rtl'
  preventScroll?: boolean
  focus?: boolean
  enableIgnoredElement?: boolean
}

export function arrowNavigation(
  event: KeyboardEvent,
  currentElement: HTMLElement | null,
  parentElement: HTMLElement | null | undefined,
  options: ArrowNavigationOptions = {},
) {
  if (
    !currentElement ||
    (options.enableIgnoredElement && IGNORED.includes(currentElement.nodeName))
  )
    return null
  const {
    arrowKeyOptions = 'both',
    attributeName = '[data-radix-collection-item]',
    itemsArray = [],
    loop = true,
    dir = 'ltr',
    preventScroll = true,
    focus = false,
  } = options
  const right = event.key === 'ArrowRight'
  const left = event.key === 'ArrowLeft'
  const up = event.key === 'ArrowUp'
  const down = event.key === 'ArrowDown'
  const home = event.key === 'Home'
  const end = event.key === 'End'
  const goingVertical = up || down
  const goingHorizontal = right || left
  if (
    !home &&
    !end &&
    ((!goingVertical && !goingHorizontal) ||
      (arrowKeyOptions === 'vertical' && goingHorizontal) ||
      (arrowKeyOptions === 'horizontal' && goingVertical))
  )
    return null
  const items = parentElement
    ? Array.from(parentElement.querySelectorAll<HTMLElement>(attributeName))
    : itemsArray
  if (!items.length) return null
  if (preventScroll) event.preventDefault()
  let item: HTMLElement | null = null
  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === 'ltr' ? right : left
    item = findNextFocusableElement(items, currentElement, { goForward, loop })
  } else if (home) item = items.at(0) || null
  else if (end) item = items.at(-1) || null
  if (focus) item?.focus()
  return item
}

function findNextFocusableElement(
  elements: HTMLElement[],
  currentElement: HTMLElement,
  options: { goForward: boolean; loop: boolean },
  iterations = !elements.includes(currentElement) ? elements.length + 1 : elements.length,
): HTMLElement | null {
  if (--iterations === 0) return null
  const index = elements.indexOf(currentElement)
  const newIndex =
    index === -1
      ? options.goForward
        ? 0
        : elements.length - 1
      : options.goForward
        ? index + 1
        : index - 1
  if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) return null
  const candidate = elements[(newIndex + elements.length) % elements.length]
  if (!candidate) return null
  const disabled =
    candidate.hasAttribute('disabled') && candidate.getAttribute('disabled') !== 'false'
  if (disabled) return findNextFocusableElement(elements, candidate, options, iterations)
  return candidate
}
