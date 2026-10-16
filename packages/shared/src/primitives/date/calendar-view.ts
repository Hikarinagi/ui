import { isEqualMonth, isSameDay, isSameMonth, type DateValue } from '@internationalized/date'
import { createMonths, type Month } from './calendar'
import { getDaysInMonth, isAfter, isBefore, toDate } from './comparators'
import type { Formatter } from './formatter'

export type Matcher = (date: DateValue) => boolean
export type PageFunction = (date: DateValue) => DateValue
export type WeekDayFormat = 'narrow' | 'short' | 'long'

export interface CalendarGridOptions {
  weekStartsOn: number
  locale: string
  fixedWeeks: boolean
  numberOfMonths: number
}

export interface CalendarBounds {
  minValue?: DateValue
  maxValue?: DateValue
  disabled: boolean
}

export function buildCalendarGrid(dateObj: DateValue, options: CalendarGridOptions) {
  return createMonths({ dateObj, ...options }) as Month<DateValue>[]
}

export function isCalendarDateSelected(
  date: DateValue | DateValue[] | undefined,
  dateObj: DateValue,
) {
  if (Array.isArray(date)) return date.some(item => isSameDay(item, dateObj))
  if (!date) return false
  return isSameDay(date, dateObj)
}

export function isCalendarSelectionInvalid(
  date: DateValue | DateValue[] | undefined,
  isDateDisabled: Matcher | undefined,
  isDateUnavailable: Matcher | undefined,
) {
  if (Array.isArray(date)) {
    for (const dateObj of date) {
      if (isDateDisabled?.(dateObj)) return true
      if (isDateUnavailable?.(dateObj)) return true
    }
    return false
  }
  if (!date) return false
  return !!(isDateDisabled?.(date) || isDateUnavailable?.(date))
}

export function hasCalendarSelection(date: DateValue | DateValue[] | undefined) {
  return Array.isArray(date) ? date.length > 0 : !!date
}

export function isCalendarSelectionDisabled(
  date: DateValue | DateValue[] | undefined,
  isDateDisabled: Matcher | undefined,
) {
  if (Array.isArray(date)) return date.some(dateObj => isDateDisabled?.(dateObj))
  if (!date) return false
  return !!isDateDisabled?.(date)
}

function nextDisabledProbe(lastPeriodInView: DateValue, nextPageFunc: PageFunction) {
  const firstPeriodOfNextPage = nextPageFunc(lastPeriodInView)
  const diff = firstPeriodOfNextPage.compare(lastPeriodInView)
  const duration: { day?: number; month?: number } = {}
  if (diff >= 7) duration.day = 1
  if (diff >= getDaysInMonth(lastPeriodInView)) duration.month = 1
  return firstPeriodOfNextPage.set({ ...duration })
}

function prevDisabledProbe(firstPeriodInView: DateValue, prevPageFunc: PageFunction) {
  const lastPeriodOfPrevPage = prevPageFunc(firstPeriodInView)
  const diff = firstPeriodInView.compare(lastPeriodOfPrevPage)
  const duration: { day?: number; month?: number } = {}
  if (diff >= 7) duration.day = 35
  if (diff >= getDaysInMonth(firstPeriodInView)) duration.month = 13
  return lastPeriodOfPrevPage.set({ ...duration })
}

export function isCalendarNextDisabled(
  grid: Month<DateValue>[],
  bounds: CalendarBounds,
  nextPage: PageFunction | undefined,
  nextPageFunc?: PageFunction,
) {
  if (!bounds.maxValue || !grid.length) return false
  if (bounds.disabled) return true
  const lastPeriodInView = grid.at(-1)!.value
  if (!nextPageFunc && !nextPage)
    return isAfter(lastPeriodInView.add({ months: 1 }).set({ day: 1 }), bounds.maxValue)
  return isAfter(nextDisabledProbe(lastPeriodInView, (nextPageFunc || nextPage)!), bounds.maxValue)
}

export function isCalendarPrevDisabled(
  grid: Month<DateValue>[],
  bounds: CalendarBounds,
  prevPage: PageFunction | undefined,
  prevPageFunc?: PageFunction,
) {
  if (!bounds.minValue || !grid.length) return false
  if (bounds.disabled) return true
  const firstPeriodInView = grid[0]!.value
  if (!prevPageFunc && !prevPage)
    return isBefore(firstPeriodInView.subtract({ months: 1 }).set({ day: 35 }), bounds.minValue)
  return isBefore(
    prevDisabledProbe(firstPeriodInView, (prevPageFunc || prevPage)!),
    bounds.minValue,
  )
}

export function isCalendarDateDisabled(
  dateObj: DateValue,
  bounds: CalendarBounds,
  isDateDisabled: Matcher | undefined,
) {
  if (isDateDisabled?.(dateObj) || bounds.disabled) return true
  if (bounds.maxValue && isAfter(dateObj, bounds.maxValue)) return true
  if (bounds.minValue && isBefore(dateObj, bounds.minValue)) return true
  return false
}

export function isOutsideCalendarView(grid: Month<DateValue>[], date: DateValue) {
  return !grid.some(month => isEqualMonth(date, month.value))
}

export function turnCalendarPage(
  direction: 1 | -1,
  grid: Month<DateValue>[],
  options: CalendarGridOptions & {
    pagedNavigation: boolean
    page: PageFunction | undefined
  },
  pageFunc?: PageFunction,
): { grid: Month<DateValue>[]; placeholder: DateValue } {
  const firstDate = grid[0]!.value
  if (!pageFunc && !options.page) {
    const months = options.pagedNavigation ? options.numberOfMonths : 1
    const newDate = direction > 0 ? firstDate.add({ months }) : firstDate.subtract({ months })
    const newGrid = buildCalendarGrid(newDate, options)
    return { grid: newGrid, placeholder: newGrid[0]!.value.set({ day: 1 }) }
  }
  const newDate = (pageFunc || options.page)!(firstDate)
  const newGrid = buildCalendarGrid(newDate, options)
  const duration: { day?: number; month?: number } = {}
  if (!pageFunc) {
    const diff =
      direction > 0 ? newGrid[0]!.value.compare(firstDate) : firstDate.compare(newGrid[0]!.value)
    if (diff >= getDaysInMonth(firstDate)) duration.day = 1
    if (diff >= 365) duration.month = 1
  }
  return { grid: newGrid, placeholder: newGrid[0]!.value.set({ ...duration }) }
}

export function calendarWeekdays(
  grid: Month<DateValue>[],
  formatter: Formatter,
  weekdayFormat: WeekDayFormat,
) {
  if (!grid.length) return []
  return grid[0]!.rows[0]!.map(date => formatter.dayOfWeek(toDate(date), weekdayFormat))
}

export function calendarHeadingOptions(placeholder: DateValue) {
  const options: Intl.DateTimeFormatOptions = { calendar: placeholder.calendar.identifier }
  if (placeholder.calendar.identifier === 'gregory' && placeholder.era === 'BC')
    options.era = 'short'
  return options
}

export function calendarHeading(
  grid: Month<DateValue>[],
  formatter: Formatter,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  if (!grid.length) return ''
  if (locale !== formatter.getLocale()) formatter.setLocale(locale)
  if (grid.length === 1) return `${formatter.fullMonthAndYear(toDate(grid[0]!.value), options)}`
  const startMonth = toDate(grid[0]!.value)
  const endMonth = toDate(grid.at(-1)!.value)
  const startMonthName = formatter.fullMonth(startMonth, options)
  const endMonthName = formatter.fullMonth(endMonth, options)
  const startMonthYear = formatter.fullYear(startMonth, options)
  const endMonthYear = formatter.fullYear(endMonth, options)
  return startMonthYear === endMonthYear
    ? `${startMonthName} - ${endMonthName} ${endMonthYear}`
    : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`
}

export function calendarLabel(label: string | undefined, heading: string) {
  return `${label ?? 'Event Date'}, ${heading}`
}

export function firstFocusableCalendarDate(
  grid: Month<DateValue>[],
  minValue: DateValue | undefined,
  isUnfocusable: Matcher,
) {
  for (const month of grid) {
    if (minValue && isBefore(month.value, minValue)) continue
    const daysInMonth = getDaysInMonth(month.value)
    const startDay = minValue && isSameMonth(minValue, month.value) ? minValue.day : 1
    for (let day = startDay; day <= daysInMonth; day++) {
      const date = month.value.set({ day })
      if (isUnfocusable(date)) continue
      return date
    }
  }
}

export function isCalendarFocusedDate(input: {
  day: DateValue
  outsideView: boolean
  disabled: boolean
  rootDisabled: boolean
  placeholderFocusable: boolean
  placeholder: DateValue
  hasSelectedDate: boolean
  selectedDateDisabled: boolean
  firstFocusableDate: DateValue | undefined
}) {
  if (input.outsideView || input.disabled) return false
  if (!input.rootDisabled && input.placeholderFocusable && isSameDay(input.day, input.placeholder))
    return true
  if ((!input.hasSelectedDate || input.selectedDateDisabled) && !input.placeholderFocusable)
    return !!input.firstFocusableDate && isSameDay(input.day, input.firstFocusableDate)
  return false
}

export function calendarCellTabIndex(focused: boolean, outsideView: boolean, disabled: boolean) {
  return focused ? 0 : outsideView || disabled ? undefined : -1
}

export function calendarShiftCandidate(
  day: DateValue,
  add: number,
  minValue: DateValue | undefined,
  maxValue: DateValue | undefined,
) {
  const candidate = day.add({ days: add })
  if (
    (minValue && candidate.compare(minValue) < 0) ||
    (maxValue && candidate.compare(maxValue) > 0)
  )
    return undefined
  return candidate
}

export function calendarArrowShift(code: string, dir: 'ltr' | 'rtl', rowLength = 7) {
  const sign = dir === 'rtl' ? -1 : 1
  switch (code) {
    case 'ArrowRight':
      return sign
    case 'ArrowLeft':
      return -sign
    case 'ArrowUp':
      return -rowLength
    case 'ArrowDown':
      return rowLength
  }
}
