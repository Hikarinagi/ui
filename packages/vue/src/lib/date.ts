import {
  CalendarDate,
  CalendarDateTime,
  parseDate,
  parseDateTime,
  type DateValue,
} from '@internationalized/date'

export type DateGranularity = 'day' | 'hour' | 'minute' | 'second'

export interface DateRangeValue {
  start: string | null
  end: string | null
}

interface DateRangeParts {
  start: DateValue | undefined
  end: DateValue | undefined
}

const LENGTH: Record<DateGranularity, number> = {
  day: 'YYYY-MM-DD'.length,
  hour: 'YYYY-MM-DDTHH:mm'.length,
  minute: 'YYYY-MM-DDTHH:mm'.length,
  second: 'YYYY-MM-DDTHH:mm:ss'.length,
}

export function parseDateValue(
  value: string | null | undefined,
  granularity: DateGranularity = 'day',
): DateValue | undefined {
  if (!value) return undefined
  try {
    if (granularity === 'day') return parseDate(value.slice(0, LENGTH.day))
    return value.includes('T')
      ? parseDateTime(value)
      : parseDate(value).toDate('UTC')
        ? toDateTime(parseDate(value))
        : undefined
  } catch {
    return undefined
  }
}

export function formatDateValue(value: DateValue, granularity: DateGranularity = 'day'): string {
  if (granularity === 'day') return new CalendarDate(value.year, value.month, value.day).toString()
  const time = value instanceof CalendarDateTime ? value : toDateTime(value)
  return time.toString().slice(0, LENGTH[granularity])
}

export function parseDateRange(
  value: DateRangeValue | null | undefined,
  granularity: DateGranularity = 'day',
): DateRangeParts {
  return {
    start: parseDateValue(value?.start, granularity),
    end: parseDateValue(value?.end, granularity),
  }
}

export function formatDateRange(
  value: DateRangeParts,
  granularity: DateGranularity = 'day',
): DateRangeValue | null {
  if (!value.start && !value.end) return null
  return {
    start: value.start ? formatDateValue(value.start, granularity) : null,
    end: value.end ? formatDateValue(value.end, granularity) : null,
  }
}

function toDateTime(value: DateValue) {
  return new CalendarDateTime(value.year, value.month, value.day)
}
