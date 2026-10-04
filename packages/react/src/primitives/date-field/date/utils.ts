import type { DateValue } from '@internationalized/date'
import type { Granularity, HourCycle } from './comparators'

export interface DateStep {
  year?: number
  month?: number
  day?: number
  hour?: number
  minute?: number
  second?: number
  millisecond?: number
}

export function chunk<T>(arr: T[], size: number) {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
  return result
}

export function getOptsByGranularity(
  granularity: Granularity,
  hourCycle: HourCycle,
  isTimeValue = false,
) {
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hourCycle: normalizeHourCycle(hourCycle),
    hour12: normalizeHour12(hourCycle),
  }
  if (isTimeValue) {
    delete opts.year
    delete opts.month
    delete opts.day
  }
  if (granularity === 'day') {
    delete opts.second
    delete opts.hour
    delete opts.minute
    delete opts.timeZoneName
  }
  if (granularity === 'hour') {
    delete opts.minute
    delete opts.second
  }
  if (granularity === 'minute') delete opts.second
  return opts
}

export function normalizeDateStep(step: DateStep | undefined): Required<DateStep> {
  return {
    year: 1,
    month: 1,
    day: 1,
    hour: 1,
    minute: 1,
    second: 1,
    millisecond: 1,
    ...Object.fromEntries(Object.entries(step ?? {}).filter(([, value]) => value !== undefined)),
  }
}

export function handleCalendarInitialFocus(calendar: HTMLElement | null) {
  if (!calendar) return
  const selectedDay = calendar.querySelector<HTMLElement>('[data-selected]')
  if (selectedDay) return selectedDay.focus()
  const today = calendar.querySelector<HTMLElement>('[data-today]')
  if (today) return today.focus()
  const firstDay = calendar.querySelector<HTMLElement>(
    '[data-value]:not([data-outside-view]):not([data-disabled])',
  )
  if (firstDay) return firstDay.focus()
}

export function normalizeHourCycle(hourCycle: HourCycle) {
  if (hourCycle === 24) return 'h23'
  if (hourCycle === 12) return 'h11'
  return undefined
}

export function normalizeHour12(hourCycle: HourCycle) {
  if (hourCycle === 24) return false
  if (hourCycle === 12) return true
  return undefined
}

export function getInputType(granularity: Granularity) {
  return granularity === 'day' ? 'date' : 'datetime-local'
}

export function normalizeInputValue(date: DateValue | undefined, granularity: Granularity) {
  if (!date) return ''
  const type = getInputType(granularity)
  const year = String(date.year).padStart(4, '0')
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  if (type === 'date') return `${year}-${month}-${day}`
  const hour = String('hour' in date ? date.hour : 0).padStart(2, '0')
  const minute = String('minute' in date ? date.minute : 0).padStart(2, '0')
  if (granularity === 'second') {
    const second = String('second' in date ? date.second : 0).padStart(2, '0')
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`
  }
  return `${year}-${month}-${day}T${hour}:${minute}`
}

function roundToStepPrecision(value: number, step: number) {
  let roundedValue = value
  const stepString = step.toString()
  const pointIndex = stepString.indexOf('.')
  const precision = pointIndex >= 0 ? stepString.length - pointIndex : 0
  if (precision > 0) {
    const pow = 10 ** precision
    roundedValue = Math.round(roundedValue * pow) / pow
  }
  return roundedValue
}

export function snapValueToStep(value: number, minValue: number, maxValue: number, step: number) {
  const min = Number(minValue)
  const max = Number(maxValue)
  const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step
  let snappedValue = roundToStepPrecision(
    Math.abs(remainder) * 2 >= step
      ? value + Math.sign(remainder) * (step - Math.abs(remainder))
      : value - remainder,
    step,
  )
  if (!Number.isNaN(min)) {
    if (snappedValue < min) snappedValue = min
    else if (!Number.isNaN(max) && snappedValue > max)
      snappedValue = min + Math.floor(roundToStepPrecision((max - min) / step, step)) * step
  } else if (!Number.isNaN(max) && snappedValue > max)
    snappedValue = Math.floor(roundToStepPrecision(max / step, step)) * step
  return roundToStepPrecision(snappedValue, step)
}

export function getActiveElement() {
  let activeElement = document.activeElement
  if (activeElement == null) return null
  while (
    activeElement != null &&
    activeElement.shadowRoot != null &&
    activeElement.shadowRoot.activeElement != null
  )
    activeElement = activeElement.shadowRoot.activeElement
  return activeElement
}

export const kbd = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  BACKSPACE: 'Backspace',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  PAGE_DOWN: 'PageDown',
  PAGE_UP: 'PageUp',
  SHIFT: 'Shift',
  SPACE: ' ',
  TAB: 'Tab',
  SPACE_CODE: 'Space',
} as const
