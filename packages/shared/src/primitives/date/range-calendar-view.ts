import { isSameDay, type DateValue } from '@internationalized/date'
import { getDaysBetween } from './calendar'
import type { Matcher } from './calendar-view'
import { areAllDaysBetweenValid, isBefore, isBetween } from './comparators'

export type FixedDate = 'start' | 'end' | undefined

export interface CalendarRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

export interface RangeLimits {
  start: DateValue | undefined
  end: DateValue | undefined
  fixedDate: FixedDate
  maximumDays: number | undefined
}

export function isRangeInvalid(range: CalendarRange, isDateDisabled: Matcher) {
  if (range.start && isDateDisabled(range.start)) return true
  if (range.end && isDateDisabled(range.end)) return true
  return !!(range.start && range.end && isBefore(range.end, range.start))
}

export function isRangeDateSelected(range: CalendarRange, date: DateValue) {
  if (range.start && isSameDay(range.start, date)) return true
  if (range.end && isSameDay(range.end, date)) return true
  if (range.end && range.start) return isBetween(date, range.start, range.end)
  return false
}

export function isRangeDateDisabled(date: DateValue, limits: RangeLimits, isDateDisabled: Matcher) {
  if (isDateDisabled(date)) return true
  if (!limits.maximumDays) return false
  if (limits.start && limits.end) {
    if (limits.fixedDate) {
      const diff = getDaysBetween(limits.start, limits.end).length
      if (diff <= limits.maximumDays) {
        const daysLeft = limits.maximumDays - diff - 1
        const startLimit = limits.start.subtract({ days: daysLeft })
        const endLimit = limits.end.add({ days: daysLeft })
        return !isBetween(date, startLimit, endLimit)
      }
    }
    return false
  }
  if (limits.start) {
    const maxDate = limits.start.add({ days: limits.maximumDays })
    const minDate = limits.start.subtract({ days: limits.maximumDays })
    return !isBetween(date, minDate, maxDate)
  }
  return false
}

export function highlightedCalendarRange(input: {
  start: DateValue | undefined
  end: DateValue | undefined
  focused: DateValue | undefined
  fixedDate: FixedDate
  maximumDays: number | undefined
  allowNonContiguousRanges: boolean
  isDateUnavailable: Matcher
  isDateDisabled: Matcher
  isDateHighlightable?: Matcher
}): { start: DateValue; end: DateValue } | null {
  if (input.start && input.end && !input.fixedDate) return null
  if (!input.start || !input.focused) return null
  const isStartBeforeFocused = isBefore(input.start, input.focused)
  const start = isStartBeforeFocused ? input.start : input.focused
  const end = isStartBeforeFocused ? input.focused : input.start
  if (isSameDay(start, end)) return { start, end }
  if (input.maximumDays && !input.end) {
    const anchor = input.start
    if (!isBefore(input.focused, anchor))
      return { start: anchor, end: anchor.add({ days: input.maximumDays - 1 }) }
    return { start: anchor.subtract({ days: input.maximumDays - 1 }), end: anchor }
  }
  const isValid = areAllDaysBetweenValid(
    start,
    end,
    input.allowNonContiguousRanges ? () => false : input.isDateUnavailable,
    input.isDateDisabled,
    input.isDateHighlightable,
  )
  return isValid ? { start, end } : null
}

export function rangeSelectionFocus(range: CalendarRange, isDateDisabled: Matcher) {
  const isStartDisabled = !!(range.start && isDateDisabled(range.start))
  const isEndDisabled = !!(range.end && isDateDisabled(range.end))
  const hasStart = !!range.start
  const hasEnd = !!range.end
  let isSelectedDisabled = false
  if (hasStart && hasEnd) isSelectedDisabled = isStartDisabled && isEndDisabled
  else if (hasStart || hasEnd)
    isSelectedDisabled = (hasStart && isStartDisabled) || (hasEnd && isEndDisabled)
  const selectedFocusableDate =
    range.start && !isStartDisabled
      ? range.start
      : range.end && !isEndDisabled
        ? range.end
        : undefined
  return { hasSelectedDate: hasStart || hasEnd, isSelectedDisabled, selectedFocusableDate }
}

export function isRangeFocusedDate(input: {
  day: DateValue
  outsideView: boolean
  disabled: boolean
  rootDisabled: boolean
  placeholderFocusable: boolean
  placeholder: DateValue
  selectedFocusableDate: DateValue | undefined
  hasSelectedDate: boolean
  selectedDisabled: boolean
  firstFocusableDate: DateValue | undefined
}) {
  if (input.outsideView || input.disabled) return false
  if (input.rootDisabled) return false
  if (input.placeholderFocusable && isSameDay(input.day, input.placeholder)) return true
  if (input.selectedFocusableDate && !input.placeholderFocusable)
    return isSameDay(input.day, input.selectedFocusableDate)
  if ((!input.hasSelectedDate || input.selectedDisabled) && !input.placeholderFocusable)
    return !!input.firstFocusableDate && isSameDay(input.day, input.firstFocusableDate)
  return false
}

export interface RangeChange {
  start?: { value: DateValue | undefined }
  end?: { value: DateValue | undefined }
  placeholder?: DateValue
  lastPressed?: DateValue
  preventDefault?: boolean
}

export function nextRangeSelection(
  date: DateValue,
  state: {
    start: DateValue | undefined
    end: DateValue | undefined
    highlighted: boolean
    lastPressed: DateValue | undefined
    preventDeselect: boolean
    fixedDate: FixedDate
  },
): RangeChange {
  const { start, end } = state
  if (start && !state.highlighted) {
    if (isSameDay(date, start) && !state.preventDeselect && !end)
      return { start: { value: undefined }, placeholder: date, lastPressed: date.copy() }
    if (!end)
      return {
        start:
          state.lastPressed && isSameDay(state.lastPressed, date)
            ? { value: date.copy() }
            : undefined,
        lastPressed: date.copy(),
        preventDefault: true,
      }
  }
  const lastPressed = date.copy()
  if (start && end && isSameDay(start, end) && isSameDay(start, date) && !state.preventDeselect)
    return {
      lastPressed,
      start: { value: undefined },
      end: { value: undefined },
      placeholder: date,
    }
  if (!start) return { lastPressed, start: { value: date.copy() } }
  if (!end) return { lastPressed, end: { value: date.copy() } }
  if (!state.fixedDate)
    return { lastPressed, end: { value: undefined }, start: { value: date.copy() } }
  if (state.fixedDate === 'start')
    return date.compare(start) < 0
      ? { lastPressed, start: { value: date.copy() } }
      : { lastPressed, end: { value: date.copy() } }
  return date.compare(end) > 0
    ? { lastPressed, end: { value: date.copy() } }
    : { lastPressed, start: { value: date.copy() } }
}
