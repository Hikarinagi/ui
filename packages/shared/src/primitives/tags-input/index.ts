import { arrowNavigation } from '../arrow-navigation'
import { isEqual } from '../value'

export type AcceptableInputValue = string | number | bigint | Record<string, any>
export type TagsInputDirection = 'ltr' | 'rtl'

export function tagsInputDisplayValue(value: AcceptableInputValue) {
  return value.toString()
}

export type TagsInputAddResult<T> =
  { added: true; value: T[]; payload: T } | { added: false; payload: T; duplicate: boolean }

export function addTagsInputValue<T extends AcceptableInputValue>(
  model: T[] | null | undefined,
  text: string,
  options: {
    duplicate: boolean
    max: number
    defaultValue: T[]
    convertValue?: (value: string) => T
  },
): TagsInputAddResult<T> {
  const array = Array.isArray(model) ? [...model] : []
  const modelIsObject = array.length > 0 && typeof array[0] === 'object'
  const defaultIsObject = array.length > 0 && typeof options.defaultValue[0] === 'object'
  if ((modelIsObject || defaultIsObject) && typeof options.convertValue !== 'function')
    throw new Error('You must provide a `convertValue` function when using objects as values.')
  const payload = options.convertValue ? options.convertValue(text) : (text as T)
  if (array.length >= options.max && !!options.max)
    return { added: false, payload, duplicate: false }
  if (options.duplicate || !array.includes(payload))
    return { added: true, value: [...array, payload], payload }
  return { added: false, payload, duplicate: true }
}

export function removeTagsInputValue<T>(model: T[], index: number) {
  return model.filter((_, i) => i !== index)
}

export function tagsInputValueIndex<T>(model: T[], value: unknown) {
  return model.findIndex(item => isEqual(item, value))
}

export interface TagsInputKeydownResult {
  select?: { element: HTMLElement | undefined }
  remove?: HTMLElement
  preventDefault: boolean
}

export function tagsInputKeydown(
  event: KeyboardEvent,
  state: {
    caretAtStart: boolean
    items: HTMLElement[]
    selected: HTMLElement | undefined
    dir: TagsInputDirection
  },
): TagsInputKeydownResult | undefined {
  const { items, selected, caretAtStart, dir } = state
  if (!items.length) return
  const lastTag = items.at(-1)
  switch (event.key) {
    case 'Delete':
    case 'Backspace': {
      if (!caretAtStart) return
      if (selected) {
        const index = items.findIndex(item => item === selected)
        return {
          remove: selected,
          select: { element: selected === lastTag ? items.at(index - 1) : items.at(index + 1) },
          preventDefault: true,
        }
      }
      if (event.key === 'Backspace') return { select: { element: lastTag }, preventDefault: true }
      return
    }
    case 'Home':
    case 'End':
    case 'ArrowRight':
    case 'ArrowLeft': {
      const isArrowRight =
        (event.key === 'ArrowRight' && dir === 'ltr') ||
        (event.key === 'ArrowLeft' && dir === 'rtl')
      if (!caretAtStart) return
      if (!isArrowRight && !selected) return { select: { element: lastTag }, preventDefault: true }
      if (isArrowRight && lastTag && selected === lastTag)
        return { select: { element: undefined }, preventDefault: true }
      if (selected) {
        const element = arrowNavigation(event, selected, undefined, {
          itemsArray: items,
          loop: false,
          dir,
        })
        return { select: element ? { element } : undefined, preventDefault: true }
      }
      return
    }
    case 'ArrowUp':
    case 'ArrowDown':
      return selected ? { preventDefault: true } : undefined
    default:
      return { select: { element: undefined }, preventDefault: false }
  }
}

export function matchesTagsInputDelimiter(delimiter: string | RegExp, data: string) {
  return delimiter === data || (delimiter instanceof RegExp && delimiter.test(data))
}

export function splitTagsInputPaste(value: string, delimiter: string | RegExp) {
  return delimiter ? value.split(delimiter) : [value]
}
