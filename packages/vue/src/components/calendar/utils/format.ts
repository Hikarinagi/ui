import { getLocalTimeZone, type DateValue } from '@internationalized/date'

const local = (date: DateValue) => date.toDate(getLocalTimeZone())

export function formatMonthHeading(tag: string, date: DateValue) {
  return new Intl.DateTimeFormat(tag, { year: 'numeric', month: 'long' }).format(local(date))
}

export function formatYearHeading(tag: string, date: DateValue) {
  return new Intl.DateTimeFormat(tag, { year: 'numeric' }).format(local(date))
}

export function formatMonthName(tag: string, date: DateValue) {
  return new Intl.DateTimeFormat(tag, { month: 'short' }).format(local(date))
}

export function formatDigits(tag: string, value: number) {
  return new Intl.NumberFormat(tag, { useGrouping: false }).format(value)
}

export function formatYearsHeading(tag: string, cells: DateValue[]) {
  return `${formatDigits(tag, cells[0]!.year)} – ${formatDigits(tag, cells.at(-1)!.year)}`
}
