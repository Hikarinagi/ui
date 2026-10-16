import { endOfMonth, endOfYear, startOfYear, type DateValue } from '@internationalized/date'
import { createMonthGrid, createYearGrid, type Grid } from './calendar'
import type { CalendarBounds, Matcher, PageFunction } from './calendar-view'
import { isAfter, isBefore, isSameYear, isSameYearMonth, toDate } from './comparators'
import type { Formatter } from './formatter'

export type PickerKind = 'month' | 'year'

export function isPickerDateSelected(
  kind: PickerKind,
  date: DateValue | DateValue[] | undefined,
  dateObj: DateValue,
) {
  const same = kind === 'month' ? isSameYearMonth : isSameYear
  if (Array.isArray(date)) return date.some(item => same(item, dateObj))
  if (!date) return false
  return same(date, dateObj)
}

export function isPickerDateDisabled(
  kind: PickerKind,
  dateObj: DateValue,
  bounds: CalendarBounds,
  matcher: Matcher | undefined,
) {
  if (matcher?.(dateObj) || bounds.disabled) return true
  const start = kind === 'month' ? dateObj.set({ day: 1 }) : startOfYear(dateObj)
  const end = kind === 'month' ? endOfMonth(dateObj) : endOfYear(dateObj)
  if (bounds.maxValue && isAfter(start, bounds.maxValue)) return true
  if (bounds.minValue && isBefore(end, bounds.minValue)) return true
  return false
}

export function isPickerNextDisabled(
  kind: PickerKind,
  grid: Grid<DateValue>,
  bounds: CalendarBounds,
  page: PageFunction | undefined,
  pageFunc?: PageFunction,
) {
  if (!bounds.maxValue) return false
  if (bounds.disabled) return true
  const turn = pageFunc || page
  if (kind === 'month') {
    const currentDate = grid.value
    if (turn) return isAfter(turn(currentDate).set({ month: 1, day: 1 }), bounds.maxValue)
    return isAfter(currentDate.add({ years: 1 }).set({ month: 1, day: 1 }), bounds.maxValue)
  }
  const lastYearInView = grid.cells.at(-1)!
  if (turn) return isAfter(startOfYear(turn(lastYearInView)), bounds.maxValue)
  return isAfter(startOfYear(lastYearInView.add({ years: 1 })), bounds.maxValue)
}

export function isPickerPrevDisabled(
  kind: PickerKind,
  grid: Grid<DateValue>,
  bounds: CalendarBounds,
  page: PageFunction | undefined,
  pageFunc?: PageFunction,
) {
  if (!bounds.minValue) return false
  if (bounds.disabled) return true
  const turn = pageFunc || page
  const firstInView = grid.value
  if (kind === 'month') {
    if (turn) return isBefore(endOfMonth(turn(firstInView).set({ month: 12 })), bounds.minValue)
    return isBefore(firstInView.subtract({ years: 1 }).set({ month: 12, day: 31 }), bounds.minValue)
  }
  if (turn) return isBefore(endOfYear(turn(firstInView)), bounds.minValue)
  return isBefore(endOfYear(firstInView.subtract({ years: 1 })), bounds.minValue)
}

export function buildPickerGrid(
  kind: PickerKind,
  dateObj: DateValue,
  yearsPerPage?: number,
  decadeAligned?: boolean,
) {
  if (kind === 'month') return createMonthGrid({ dateObj })
  return createYearGrid({ dateObj, yearsPerPage, decadeAligned })
}

export function turnPickerPage(
  kind: PickerKind,
  direction: 1 | -1,
  grid: Grid<DateValue>,
  placeholder: DateValue,
  options: { page: PageFunction | undefined; yearsPerPage?: number },
  pageFunc?: PageFunction,
) {
  const firstInGrid = grid.value
  const turn = pageFunc || options.page
  const years = kind === 'month' ? 1 : options.yearsPerPage!
  const newDate = turn
    ? turn(firstInGrid)
    : direction > 0
      ? firstInGrid.add({ years })
      : firstInGrid.subtract({ years })
  return {
    grid: buildPickerGrid(kind, newDate, options.yearsPerPage, false),
    placeholder: newDate.set({ month: placeholder.month, day: placeholder.day }),
  }
}

export function pickerGridContains(kind: PickerKind, grid: Grid<DateValue>, value: DateValue) {
  if (kind === 'month') return value.year === grid.value.year
  return value.year >= grid.value.year && value.year <= grid.cells.at(-1)!.year
}

export function pickerHeading(
  kind: PickerKind,
  grid: Grid<DateValue>,
  formatter: Formatter,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  if (locale !== formatter.getLocale()) formatter.setLocale(locale)
  if (kind === 'month') return formatter.fullYear(toDate(grid.value), options)
  const firstYear = grid.cells[0]!
  const lastYear = grid.cells.at(-1)!
  return `${formatter.fullYear(toDate(firstYear), options)} - ${formatter.fullYear(toDate(lastYear), options)}`
}

export function pickerLabel(kind: PickerKind, label: string | undefined, heading: string) {
  return `${label ?? (kind === 'month' ? 'Month Picker' : 'Year Picker')}, ${heading}`
}

export function isSamePickerPeriod(kind: PickerKind, a: DateValue, b: DateValue) {
  return kind === 'month' ? isSameYearMonth(a, b) : isSameYear(a, b)
}

function resolvePickerValue(kind: PickerKind, value: DateValue, reference?: DateValue) {
  if (!reference) return value.copy()
  return kind === 'month'
    ? value.copy().set({ day: reference.day })
    : value.copy().set({ month: reference.month, day: reference.day })
}

export function nextPickerSelection(
  kind: PickerKind,
  model: DateValue | DateValue[] | undefined,
  value: DateValue,
  placeholder: DateValue,
  options: { multiple: boolean; preventDeselect: boolean },
): { value: DateValue | DateValue[] | undefined; placeholder?: DateValue } | undefined {
  const same = (a: DateValue, b: DateValue) => isSamePickerPeriod(kind, a, b)
  if (!options.multiple) {
    if (!model) return { value: resolvePickerValue(kind, value, placeholder) }
    if (!options.preventDeselect && same(model as DateValue, value))
      return { placeholder: resolvePickerValue(kind, value, model as DateValue), value: undefined }
    return { value: resolvePickerValue(kind, value, model as DateValue) }
  }
  if (!model) return { value: [resolvePickerValue(kind, value, placeholder)] }
  const values = Array.isArray(model) ? model : kind === 'month' ? [model] : undefined
  if (!values) return
  const index = values.findIndex(date => same(date, value))
  if (index === -1) return { value: [...values, resolvePickerValue(kind, value, placeholder)] }
  if (options.preventDeselect) return
  const next = values.filter(date => !same(date, value))
  if (!next.length)
    return { placeholder: resolvePickerValue(kind, value, values[index]), value: undefined }
  return { value: next.map(date => date.copy()) }
}

export function pickerShiftCandidate(
  kind: PickerKind,
  current: DateValue,
  add: number,
  unit: 'cell' | 'page',
  bounds: { minValue?: DateValue; maxValue?: DateValue; yearsPerPage?: number },
) {
  const candidate =
    kind === 'month'
      ? unit === 'cell'
        ? current.add({ months: add })
        : current.add({ years: add })
      : current.add({ years: unit === 'cell' ? add : add * bounds.yearsPerPage! })
  const end = kind === 'month' ? endOfMonth(candidate) : endOfYear(candidate)
  const start = kind === 'month' ? candidate.set({ day: 1 }) : startOfYear(candidate)
  if (
    (bounds.minValue && end.compare(bounds.minValue) < 0) ||
    (bounds.maxValue && start.compare(bounds.maxValue) > 0)
  )
    return undefined
  return candidate
}
