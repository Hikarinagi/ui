import {
  CalendarDate,
  endOfMonth,
  getDayOfWeek,
  startOfMonth,
  startOfYear,
  type DateValue,
} from '@internationalized/date'
import { getDaysInMonth, getLastFirstDayOfWeek, getNextLastDayOfWeek } from './comparators'
import { chunk } from './utils'

export interface Month<T> {
  value: DateValue
  cells: T[]
  rows: T[][]
}

export interface Grid<T> {
  value: DateValue
  cells: T[]
  rows: T[][]
}

export function getDaysBetween(start: DateValue, end: DateValue) {
  const days: DateValue[] = []
  let dCurrent = start.add({ days: 1 })
  const dEnd = end
  while (dCurrent.compare(dEnd) < 0) {
    days.push(dCurrent)
    dCurrent = dCurrent.add({ days: 1 })
  }
  return days
}

interface CreateMonthProps {
  dateObj: DateValue
  weekStartsOn: number
  fixedWeeks: boolean
  locale: string
}

export function createMonth(props: CreateMonthProps): Month<DateValue> {
  const { dateObj, weekStartsOn, fixedWeeks, locale } = props
  const daysInMonth = getDaysInMonth(dateObj)
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => dateObj.set({ day: i + 1 }))
  const firstDayOfMonth = startOfMonth(dateObj)
  const lastDayOfMonth = endOfMonth(dateObj)
  const lastSunday = getLastFirstDayOfWeek(firstDayOfMonth, weekStartsOn, locale)
  const nextSaturday = getNextLastDayOfWeek(lastDayOfMonth, weekStartsOn, locale)
  const lastMonthDays = getDaysBetween(lastSunday.subtract({ days: 1 }), firstDayOfMonth)
  const nextMonthDays = getDaysBetween(lastDayOfMonth, nextSaturday.add({ days: 1 }))
  const totalDays = lastMonthDays.length + datesArray.length + nextMonthDays.length
  if (fixedWeeks && totalDays < 42) {
    const extraDays = 42 - totalDays
    let startFrom = nextMonthDays.at(-1)
    if (!startFrom) startFrom = endOfMonth(dateObj)
    const from = startFrom
    const extraDaysArray = Array.from({ length: extraDays }, (_, i) => from.add({ days: i + 1 }))
    nextMonthDays.push(...extraDaysArray)
  }
  const allDays = lastMonthDays.concat(datesArray, nextMonthDays)
  return { value: dateObj, cells: allDays, rows: chunk(allDays, 7) }
}

export function startOfDecade(dateObj: DateValue) {
  return startOfYear(
    dateObj
      .subtract({ years: dateObj.year - Math.floor(dateObj.year / 10) * 10 })
      .set({ day: 1, month: 1 }),
  )
}

export function createYear(props: {
  dateObj: DateValue
  numberOfMonths?: number
  pagedNavigation?: boolean
}) {
  const { dateObj, numberOfMonths = 1, pagedNavigation = false } = props
  if (numberOfMonths && pagedNavigation)
    return Array.from({ length: Math.floor(12 / numberOfMonths) }, (_, i) =>
      startOfMonth(dateObj.set({ month: i * numberOfMonths + 1 })),
    )
  return Array.from({ length: 12 }, (_, i) => startOfMonth(dateObj.set({ month: i + 1 })))
}

export function createMonths(
  props: CreateMonthProps & { numberOfMonths: number },
): Month<DateValue>[] {
  const { numberOfMonths, dateObj, ...monthProps } = props
  const months: Month<DateValue>[] = []
  if (!numberOfMonths || numberOfMonths === 1) {
    months.push(createMonth({ ...monthProps, dateObj }))
    return months
  }
  months.push(createMonth({ ...monthProps, dateObj }))
  for (let i = 1; i < numberOfMonths; i++) {
    const nextMonth = dateObj.add({ months: i })
    months.push(createMonth({ ...monthProps, dateObj: nextMonth }))
  }
  return months
}

export function createMonthGrid(props: { dateObj: DateValue }): Grid<DateValue> {
  const { dateObj } = props
  const months = createYear({ dateObj })
  return { value: dateObj, cells: months, rows: chunk(months, 4) }
}

export function createYearGrid(props: {
  dateObj: DateValue
  yearsPerPage?: number
  decadeAligned?: boolean
}): Grid<DateValue> {
  const { dateObj, yearsPerPage = 12, decadeAligned = true } = props
  const startYear = decadeAligned ? startOfDecade(dateObj).year : dateObj.year
  const years = Array.from({ length: yearsPerPage }, (_, i) =>
    startOfYear(dateObj.set({ year: startYear + i })),
  )
  return { value: years[0]!, cells: years, rows: chunk(years, 4) }
}

export function getWeekStartsOn(locale: string) {
  const monday = new CalendarDate(2025, 1, 6)
  const dayOfWeek = getDayOfWeek(monday, locale)
  return (1 - dayOfWeek + 7) % 7
}
