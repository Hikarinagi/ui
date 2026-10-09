import { isOptionGroup, type SelectItems, type SelectOption } from '../../types/select'
import { nextEnabled, typeaheadMatch } from './navigation'

export interface ChoiceRow<T> {
  key: string
  label: string
  option?: T
  group?: number
  source?: { label: string; options: T[] }
  position: number
}

export const CHOICE_TYPEAHEAD_TIMEOUT = 1000
export const CHOICE_PAGE_ROW = 36

export function choiceKey(value: string | number) {
  return `option:${typeof value}:${value}`
}

export function choiceRows<T extends SelectOption>(
  items: SelectItems<T>,
  query: string,
  contains: (text: string, query: string) => boolean,
) {
  const result: ChoiceRow<T>[] = []
  let position = 0
  items.forEach((item, groupIndex) => {
    if (isOptionGroup(item)) {
      const options = item.options.filter(option => !query || contains(option.label, query))
      if (!options.length) return
      const group = result.length
      result.push({ key: `group:${groupIndex}`, label: item.label, source: item, position: 0 })
      for (const option of options)
        result.push({
          key: choiceKey(option.value),
          label: option.label,
          option,
          group,
          position: ++position,
        })
    } else if (!query || contains(item.label, query))
      result.push({
        key: choiceKey(item.value),
        label: item.label,
        option: item,
        position: ++position,
      })
  })
  return result
}

export function choiceSize<T>(rows: readonly ChoiceRow<T>[]) {
  return rows.filter(row => row.option).length
}

export function choiceDisabled<T extends SelectOption>(
  rows: readonly ChoiceRow<T>[],
  index: number,
) {
  return !rows[index]?.option || !!rows[index]?.option?.disabled
}

export function choiceEstimate<T extends SelectOption>(row: ChoiceRow<T>) {
  return row.option ? (row.option.description ? 54 : 36) : 30
}

export function choiceGroups<T>(rows: readonly ChoiceRow<T>[], indexes: readonly number[]) {
  return indexes.flatMap(index => (rows[index]?.group === undefined ? [] : [rows[index]!.group!]))
}

export function selectedChoice<T extends SelectOption>(
  rows: readonly ChoiceRow<T>[],
  model: unknown,
) {
  const value = Array.isArray(model) ? model[0] : model
  return rows.findIndex(row => row.option?.value === value && !!row.option)
}

export function choiceAttrs<T>(
  rows: readonly ChoiceRow<T>[],
  index: number,
  size: number,
  id: string,
) {
  const row = rows[index]!
  return {
    'aria-posinset': row.position,
    'aria-setsize': size,
    'aria-describedby': row.group === undefined ? undefined : `${id}-${row.group}`,
  }
}

export function enabledChoiceValues<T extends SelectOption>(rows: readonly ChoiceRow<T>[]) {
  return rows.flatMap(row => (row.option && !row.option.disabled ? [row.option.value] : []))
}

export function choiceRangeValues<T extends SelectOption>(
  rows: readonly ChoiceRow<T>[],
  anchor: unknown,
  target: number,
) {
  const start = rows.findIndex(row => row.option?.value === anchor)
  if (start < 0) return undefined
  return enabledChoiceValues(rows.slice(Math.min(start, target), Math.max(start, target) + 1))
}

export function createChoiceTypeahead(now: () => number = () => Date.now()) {
  let search = ''
  let searchedAt = 0
  return {
    get search() {
      return search
    },
    expire() {
      if (now() - searchedAt > CHOICE_TYPEAHEAD_TIMEOUT) search = ''
    },
    extend(key: string) {
      const time = now()
      search = (time - searchedAt > CHOICE_TYPEAHEAD_TIMEOUT ? '' : search) + key
      searchedAt = time
      return search
    },
  }
}

export type ChoiceTypeahead = ReturnType<typeof createChoiceTypeahead>

export interface ChoiceKeyEvent {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}

export type ChoiceKeyAction =
  | { type: 'none' }
  | { type: 'select-all' }
  | { type: 'commit'; index: number }
  | { type: 'move'; target: number }

export function choiceKeyAction(
  event: ChoiceKeyEvent,
  state: {
    labels: () => readonly string[]
    count: number
    current: number
    input: boolean
    multiple: boolean
    page: number
    disabled: (index: number) => boolean
    typeahead: ChoiceTypeahead
  },
): ChoiceKeyAction {
  const { count, current, input, disabled, typeahead } = state
  const meta = event.ctrlKey || event.metaKey || event.altKey
  typeahead.expire()
  if (
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    event.key.toLowerCase() === 'a' &&
    !input &&
    state.multiple
  )
    return { type: 'select-all' }
  if (meta) return { type: 'none' }
  let target = -1
  if (event.key === 'ArrowDown') target = nextEnabled(count, current + 1, 1, disabled)
  else if (event.key === 'ArrowUp')
    target = nextEnabled(count, current < 0 ? count - 1 : current - 1, -1, disabled)
  else if (event.key === 'Home') target = nextEnabled(count, 0, 1, disabled)
  else if (event.key === 'End') target = nextEnabled(count, count - 1, -1, disabled)
  else if (event.key === 'PageDown' || event.key === 'PageUp') {
    const step = event.key === 'PageDown' ? 1 : -1
    target = nextEnabled(
      count,
      Math.max(
        0,
        Math.min(
          count - 1,
          Math.max(0, current) + step * Math.max(1, Math.floor(state.page / CHOICE_PAGE_ROW)),
        ),
      ),
      step,
      disabled,
    )
  } else if (event.key === 'Enter' || (event.key === ' ' && !input && !typeahead.search)) {
    if (current < 0 || disabled(current)) return { type: 'none' }
    return { type: 'commit', index: current }
  } else if (!input && event.key.length === 1)
    target = typeaheadMatch(state.labels(), typeahead.extend(event.key), current, disabled)
  else return { type: 'none' }
  return { type: 'move', target }
}
