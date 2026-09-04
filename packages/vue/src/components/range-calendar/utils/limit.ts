import type { DateValue } from '@internationalized/date'

export function maximumDaysMatcher(
  start: DateValue | undefined,
  end: DateValue | undefined,
  maximumDays: number | undefined,
) {
  if (!start || end || !maximumDays) return undefined
  const reach = maximumDays - 1
  return (date: DateValue) => Math.abs(date.compare(start)) > reach
}
