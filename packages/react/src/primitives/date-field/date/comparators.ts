import {
  CalendarDate,
  CalendarDateTime,
  DateFormatter,
  Time,
  ZonedDateTime,
  createCalendar,
  getDayOfWeek,
  getLocalTimeZone,
  toCalendar,
  type DateValue,
} from '@internationalized/date'

export type Granularity = 'day' | 'hour' | 'minute' | 'second'
export type HourCycle = 12 | 24 | undefined
export type TimeValue = Time | CalendarDateTime | ZonedDateTime

export function toDate(dateValue: DateValue, tz = getLocalTimeZone()) {
  if (isZonedDateTime(dateValue)) return dateValue.toDate()
  return dateValue.toDate(tz)
}

export function isCalendarDateTime(dateValue: unknown): dateValue is CalendarDateTime {
  return dateValue instanceof CalendarDateTime
}

export function isZonedDateTime(dateValue: unknown): dateValue is ZonedDateTime {
  return dateValue instanceof ZonedDateTime
}

export function hasTime(dateValue: DateValue) {
  return isCalendarDateTime(dateValue) || isZonedDateTime(dateValue)
}

export function getDaysInMonth(date: DateValue) {
  return date.set({ day: 100 }).day
}

export function isBefore(dateToCompare: DateValue, referenceDate: DateValue) {
  return dateToCompare.compare(referenceDate) < 0
}

export function isAfter(dateToCompare: DateValue, referenceDate: DateValue) {
  return dateToCompare.compare(referenceDate) > 0
}

export function isBeforeOrSame(dateToCompare: DateValue, referenceDate: DateValue) {
  return dateToCompare.compare(referenceDate) <= 0
}

export function isAfterOrSame(dateToCompare: DateValue, referenceDate: DateValue) {
  return dateToCompare.compare(referenceDate) >= 0
}

export function isBetweenInclusive(date: DateValue, start: DateValue, end: DateValue) {
  return isAfterOrSame(date, start) && isBeforeOrSame(date, end)
}

export function isBetween(date: DateValue, start: DateValue, end: DateValue) {
  return isAfter(date, start) && isBefore(date, end)
}

export function getLastFirstDayOfWeek<T extends DateValue>(
  date: T,
  firstDayOfWeek: number,
  locale: string,
): T {
  const day = getDayOfWeek(date, locale, 'sun')
  if (firstDayOfWeek > day) return date.subtract({ days: day + 7 - firstDayOfWeek }) as T
  if (firstDayOfWeek === day) return date
  return date.subtract({ days: day - firstDayOfWeek }) as T
}

export function getNextLastDayOfWeek<T extends DateValue>(
  date: T,
  firstDayOfWeek: number,
  locale: string,
): T {
  const day = getDayOfWeek(date, locale, 'sun')
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  if (day === lastDayOfWeek) return date
  if (day > lastDayOfWeek) return date.add({ days: 7 - day + lastDayOfWeek }) as T
  return date.add({ days: lastDayOfWeek - day }) as T
}

export function isSameYearMonth(a: DateValue, b: DateValue) {
  return a.year === b.year && a.month === b.month
}

export function isSameYear(a: DateValue, b: DateValue) {
  return a.year === b.year
}

export function areAllDaysBetweenValid(
  start: DateValue,
  end: DateValue,
  isUnavailable: ((date: DateValue) => boolean) | undefined,
  isDisabled: ((date: DateValue) => boolean) | undefined,
  isHighlightable?: (date: DateValue) => boolean,
) {
  if (isUnavailable === undefined && isDisabled === undefined && isHighlightable === undefined)
    return true
  let dCurrent = start.add({ days: 1 })
  if ((isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) && !isHighlightable?.(dCurrent))
    return false
  const dEnd = end
  while (dCurrent.compare(dEnd) < 0) {
    dCurrent = dCurrent.add({ days: 1 })
    if ((isDisabled?.(dCurrent) || isUnavailable?.(dCurrent)) && !isHighlightable?.(dCurrent))
      return false
  }
  return true
}

export function getDefaultDate(props: {
  defaultValue?: DateValue | DateValue[]
  defaultPlaceholder?: DateValue
  granularity?: Granularity
  locale?: string
}): DateValue {
  const { defaultValue, defaultPlaceholder, granularity = 'day', locale = 'en' } = props
  if (Array.isArray(defaultValue) && defaultValue.length) return defaultValue.at(-1)!.copy()
  if (defaultValue && !Array.isArray(defaultValue)) return defaultValue.copy()
  if (defaultPlaceholder) return defaultPlaceholder.copy()
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const defaultFormatter = new DateFormatter(locale)
  const calendar = createCalendar(defaultFormatter.resolvedOptions().calendar as never)
  if (['hour', 'minute', 'second'].includes(granularity ?? 'day'))
    return toCalendar(new CalendarDateTime(year, month, day, 0, 0, 0), calendar)
  return toCalendar(new CalendarDate(year, month, day), calendar)
}

export function getDefaultTime(props: {
  defaultValue?: TimeValue
  defaultPlaceholder?: TimeValue
}): TimeValue {
  const { defaultValue, defaultPlaceholder } = props
  if (defaultValue) return defaultValue.copy()
  if (defaultPlaceholder) return defaultPlaceholder.copy()
  return new Time(0, 0, 0)
}
