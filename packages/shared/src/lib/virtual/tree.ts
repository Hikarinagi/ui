import { CHOICE_PAGE_ROW, type ChoiceTypeahead } from './choices'
import { nextEnabled, typeaheadMatch } from './navigation'

export interface VirtualTreeRow<T> {
  _id: string
  level: number
  hasChildren: boolean
  parentItem?: T
  value: T
}

export interface VirtualTreeKeyEvent {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
}

export function virtualTreeDisabled<T extends { disabled?: boolean }>(
  rows: readonly VirtualTreeRow<T>[],
  index: number,
  rootDisabled: boolean,
  disabled?: (node: T) => boolean,
) {
  const row = rows[index]
  return !row || rootDisabled || (disabled?.(row.value) ?? !!row.value.disabled)
}

export function virtualTreeKeyTarget<T extends { label: string }>(
  event: VirtualTreeKeyEvent,
  state: {
    rows: readonly VirtualTreeRow<T>[]
    current: number
    expanded: readonly string[]
    dir: 'ltr' | 'rtl'
    page: number
    getKey: (value: T) => string
    disabled: (index: number) => boolean
    typeahead: ChoiceTypeahead
  },
): number | undefined {
  const { rows, current, expanded, disabled } = state
  if (event.ctrlKey || event.metaKey || event.altKey) return undefined
  const count = rows.length
  const item = rows[current]
  if (event.key === 'ArrowDown') return nextEnabled(count, current + 1, 1, disabled)
  if (event.key === 'ArrowUp') return nextEnabled(count, current - 1, -1, disabled)
  if (event.key === 'Home') return nextEnabled(count, 0, 1, disabled)
  if (event.key === 'End') return nextEnabled(count, count - 1, -1, disabled)
  if (event.key === 'PageDown' || event.key === 'PageUp') {
    const step = event.key === 'PageDown' ? 1 : -1
    return nextEnabled(
      count,
      Math.max(
        0,
        Math.min(count - 1, current + step * Math.max(1, Math.floor(state.page / CHOICE_PAGE_ROW))),
      ),
      step,
      disabled,
    )
  }
  if (event.key === (state.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) {
    if (!item?.hasChildren) return undefined
    if (!expanded.includes(item._id)) return undefined
    const child = nextEnabled(count, current + 1, 1, disabled)
    return rows[child]?.level === item.level + 1 ? child : -1
  }
  if (event.key === (state.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft')) {
    if (!item || expanded.includes(item._id)) return undefined
    if (!item.parentItem) return -1
    const parent = state.getKey(item.parentItem)
    return rows.findIndex(row => row._id === parent)
  }
  if (event.key.length === 1 && event.key !== ' ')
    return typeaheadMatch(
      rows.map(row => row.value.label),
      state.typeahead.extend(event.key),
      current,
      disabled,
    )
  return undefined
}

export function survivingTreeAncestor<T>(
  rows: readonly VirtualTreeRow<T>[],
  previous: readonly VirtualTreeRow<T>[] | undefined,
  active: string,
  getKey: (value: T) => string,
) {
  let removed = previous?.find(row => row._id === active)
  let target = -1
  while (removed?.parentItem && target < 0) {
    const parent = getKey(removed.parentItem)
    target = rows.findIndex(row => row._id === parent)
    removed = previous?.find(row => row._id === parent)
  }
  return target
}
