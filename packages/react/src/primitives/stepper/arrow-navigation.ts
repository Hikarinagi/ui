const ignoredElement = ['INPUT', 'TEXTAREA']

export interface ArrowNavigationOptions {
  arrowKeyOptions?: 'horizontal' | 'vertical' | 'both'
  attributeName?: string
  itemsArray?: HTMLElement[]
  loop?: boolean
  dir?: 'ltr' | 'rtl'
  preventScroll?: boolean
  enableIgnoredElement?: boolean
  focus?: boolean
}

export function navigateByArrow(
  e: KeyboardEvent,
  currentElement: HTMLElement | null,
  parentElement: HTMLElement | undefined,
  options: ArrowNavigationOptions = {},
): HTMLElement | null {
  if (
    !currentElement ||
    (options.enableIgnoredElement && ignoredElement.includes(currentElement.nodeName))
  )
    return null
  const {
    arrowKeyOptions = 'both',
    attributeName = '[data-reka-collection-item]',
    itemsArray = [],
    loop = true,
    dir = 'ltr',
    preventScroll = true,
    focus = false,
  } = options
  const [right, left, up, down, home, end] = [
    e.key === 'ArrowRight',
    e.key === 'ArrowLeft',
    e.key === 'ArrowUp',
    e.key === 'ArrowDown',
    e.key === 'Home',
    e.key === 'End',
  ]
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
  const allCollectionItems: HTMLElement[] = parentElement
    ? Array.from(parentElement.querySelectorAll(attributeName))
    : itemsArray
  if (!allCollectionItems.length) return null
  if (preventScroll) e.preventDefault()
  let item: HTMLElement | null = null
  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === 'ltr' ? right : left
    item = findNextFocusableElement(allCollectionItems, currentElement, { goForward, loop })
  } else if (home) {
    item = allCollectionItems.at(0) || null
  } else if (end) {
    item = allCollectionItems.at(-1) || null
  }
  if (focus) item?.focus()
  return item
}

function findNextFocusableElement(
  elements: HTMLElement[],
  currentElement: HTMLElement,
  options: { goForward: boolean; loop?: boolean },
  iterations = !elements.includes(currentElement) ? elements.length + 1 : elements.length,
): HTMLElement | null {
  if (--iterations === 0) return null
  const index = elements.indexOf(currentElement)
  let newIndex: number
  if (index === -1) newIndex = options.goForward ? 0 : elements.length - 1
  else newIndex = options.goForward ? index + 1 : index - 1
  if (!options.loop && (newIndex < 0 || newIndex >= elements.length)) return null
  const adjustedNewIndex = (newIndex + elements.length) % elements.length
  const candidate = elements[adjustedNewIndex]
  if (!candidate) return null
  const isDisabled =
    candidate.hasAttribute('disabled') && candidate.getAttribute('disabled') !== 'false'
  if (isDisabled) return findNextFocusableElement(elements, candidate, options, iterations)
  return candidate
}

export function getActiveElement(): Element | null {
  let activeElement = document.activeElement
  if (activeElement == null) return null
  while (
    activeElement != null &&
    activeElement.shadowRoot != null &&
    activeElement.shadowRoot.activeElement != null
  )
    activeElement = activeElement.shadowRoot.activeElement
  return activeElement
}
