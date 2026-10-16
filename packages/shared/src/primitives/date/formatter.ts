import { DateFormatter, getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import { hasTime, isZonedDateTime, toDate } from './comparators'

export type Formatter = ReturnType<typeof createDateFormatter>

export function createDateFormatter(initialLocale: string, opts: Intl.DateTimeFormatOptions = {}) {
  let locale = initialLocale

  function getLocale() {
    return locale
  }

  function setLocale(newLocale: string) {
    locale = newLocale
  }

  function custom(date: Date, options: Intl.DateTimeFormatOptions) {
    return new DateFormatter(locale, { ...opts, ...options }).format(date)
  }

  function selectedDate(date: DateValue, includeTime = true) {
    if (hasTime(date) && includeTime)
      return custom(toDate(date), { dateStyle: 'long', timeStyle: 'long' })
    return custom(toDate(date), { dateStyle: 'long' })
  }

  function fullMonthAndYear(date: Date, options: Intl.DateTimeFormatOptions = {}) {
    return new DateFormatter(locale, {
      ...opts,
      month: 'long',
      year: 'numeric',
      ...options,
    }).format(date)
  }

  function fullMonth(date: Date, options: Intl.DateTimeFormatOptions = {}) {
    return new DateFormatter(locale, { ...opts, month: 'long', ...options }).format(date)
  }

  function getMonths() {
    const defaultDate = today(getLocalTimeZone())
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => ({
      label: fullMonth(toDate(defaultDate.set({ month: item }))),
      value: item,
    }))
  }

  function fullYear(date: Date, options: Intl.DateTimeFormatOptions = {}) {
    return new DateFormatter(locale, { ...opts, year: 'numeric', ...options }).format(date)
  }

  function toParts(date: DateValue, options?: Intl.DateTimeFormatOptions) {
    if (isZonedDateTime(date))
      return new DateFormatter(locale, {
        ...opts,
        ...options,
        timeZone: date.timeZone,
      }).formatToParts(toDate(date))
    return new DateFormatter(locale, { ...opts, ...options }).formatToParts(toDate(date))
  }

  function dayOfWeek(date: Date, length: Intl.DateTimeFormatOptions['weekday'] = 'narrow') {
    return new DateFormatter(locale, { ...opts, weekday: length }).format(date)
  }

  function dayPeriod(date: Date) {
    const parts = new DateFormatter(locale, {
      ...opts,
      hour: 'numeric',
      minute: 'numeric',
    }).formatToParts(date)
    const value = parts.find(p => p.type === 'dayPeriod')?.value
    if (value === 'PM' || value === 'pm' || value === 'p.m.') return 'PM'
    return 'AM'
  }

  const defaultPartOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }

  function part(
    dateObj: DateValue,
    type: Intl.DateTimeFormatPartTypes,
    options: Intl.DateTimeFormatOptions = {},
  ) {
    const parts = toParts(dateObj, { ...defaultPartOptions, ...options })
    const found = parts.find(p => p.type === type)
    return found ? found.value : ''
  }

  return {
    setLocale,
    getLocale,
    fullMonth,
    fullYear,
    fullMonthAndYear,
    toParts,
    custom,
    part,
    dayPeriod,
    selectedDate,
    dayOfWeek,
    getMonths,
  }
}
