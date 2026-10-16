import { DateFormatter, type DateValue } from '@internationalized/date'
import { getDaysInMonth, toDate, type HourCycle } from './comparators'
import type { Formatter } from './formatter'
import type { SegmentValueObj } from './parser'
import { isAcceptableSegmentKey, isNumberString, isSegmentNavigationKey } from './segment'
import { getActiveElement, kbd, snapValueToStep, type DateStep } from './utils'

const DIGIT_REG = /^\d$/

export type DateFieldPart = keyof SegmentValueObj | 'literal' | 'timeZoneName' | 'era'
export type SegmentAttributes = Record<string, string | number | boolean | undefined>

type Values = Record<string, number | string | null | undefined>
type CyclePart = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
interface Cyclable {
  set: (fields: Record<string, number>) => Cyclable
  cycle: (field: CyclePart, amount: number) => Cyclable
  [key: string]: unknown
}

export interface SegmentAttributeProps {
  disabled: boolean
  placeholder: DateValue
  hourCycle: HourCycle
  segmentValues: SegmentValueObj
  formatter: Formatter
}

export const SEGMENT_CARET_STYLE = 'caret-color: transparent;'

function commonSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  return {
    role: 'spinbutton',
    contenteditable: true,
    tabindex: props.disabled ? undefined : 0,
    spellcheck: false,
    inputmode: 'numeric',
    autocorrect: 'off',
    enterkeyhint: 'next',
    style: SEGMENT_CARET_STYLE,
  }
}

function daySegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  const { segmentValues, placeholder } = props
  const isEmpty = segmentValues.day === null
  const dateFields: { day?: number; month?: number } = {}
  if (segmentValues.day) dateFields.day = segmentValues.day
  if (segmentValues.month) dateFields.month = segmentValues.month
  const date = Object.keys(dateFields).length > 0 ? placeholder.set(dateFields) : placeholder
  const valueNow = date.day
  return {
    ...commonSegmentAttrs(props),
    'aria-label': 'day,',
    'aria-valuemin': 1,
    'aria-valuemax': getDaysInMonth(date),
    'aria-valuenow': valueNow,
    'aria-valuetext': isEmpty ? 'Empty' : `${valueNow}`,
    'data-placeholder': isEmpty ? '' : undefined,
  }
}

function monthSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  const { segmentValues, placeholder, formatter } = props
  const isEmpty = segmentValues.month === null
  const date = segmentValues.month ? placeholder.set({ month: segmentValues.month }) : placeholder
  const valueNow = date.month
  return {
    ...commonSegmentAttrs(props),
    'aria-label': 'month, ',
    contenteditable: true,
    'aria-valuemin': 1,
    'aria-valuemax': 12,
    'aria-valuenow': valueNow,
    'aria-valuetext': isEmpty ? 'Empty' : `${valueNow} - ${formatter.fullMonth(toDate(date))}`,
    'data-placeholder': isEmpty ? '' : undefined,
  }
}

function yearSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  const { segmentValues, placeholder } = props
  const isEmpty = segmentValues.year === null
  const date = segmentValues.year ? placeholder.set({ year: segmentValues.year }) : placeholder
  const valueNow = date.year
  return {
    ...commonSegmentAttrs(props),
    'aria-label': 'year, ',
    'aria-valuemin': 1,
    'aria-valuemax': 9999,
    'aria-valuenow': valueNow,
    'aria-valuetext': isEmpty ? 'Empty' : `${valueNow}`,
    'data-placeholder': isEmpty ? '' : undefined,
  }
}

function hourSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  const { segmentValues, hourCycle, placeholder } = props
  if (!('hour' in segmentValues) || !('hour' in placeholder)) return {}
  const isEmpty = segmentValues.hour === null
  const date = (
    segmentValues.hour ? placeholder.set({ hour: segmentValues.hour } as never) : placeholder
  ) as DateValue & { hour: number }
  const valueNow = date.hour
  return {
    ...commonSegmentAttrs(props),
    'aria-label': 'hour, ',
    'aria-valuemin': hourCycle === 12 ? 1 : 0,
    'aria-valuemax': hourCycle === 12 ? 12 : 23,
    'aria-valuenow': valueNow,
    'aria-valuetext': isEmpty ? 'Empty' : `${valueNow} ${segmentValues.dayPeriod ?? ''}`,
    'data-placeholder': isEmpty ? '' : undefined,
  }
}

function minuteOrSecondAttrs(part: 'minute' | 'second') {
  return (props: SegmentAttributeProps): SegmentAttributes => {
    const { segmentValues, placeholder } = props
    if (!(part in segmentValues) || !(part in placeholder)) return {}
    const isEmpty = segmentValues[part] === null
    const date = (
      segmentValues[part] ? placeholder.set({ [part]: segmentValues[part] } as never) : placeholder
    ) as DateValue & Record<'minute' | 'second', number>
    const valueNow = date[part]
    return {
      ...commonSegmentAttrs(props),
      'aria-label': `${part}, `,
      'aria-valuemin': 0,
      'aria-valuemax': 59,
      'aria-valuenow': valueNow,
      'aria-valuetext': isEmpty ? 'Empty' : `${valueNow}`,
      'data-placeholder': isEmpty ? '' : undefined,
    }
  }
}

function dayPeriodSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  const { segmentValues } = props
  if (!('dayPeriod' in segmentValues)) return {}
  const hour = segmentValues.hour
  return {
    ...commonSegmentAttrs(props),
    inputmode: 'text',
    'aria-label': 'AM/PM',
    'aria-valuemin': 0,
    'aria-valuemax': 12,
    'aria-valuenow': hour ? (hour > 12 ? hour - 12 : hour) : 0,
    'aria-valuetext': segmentValues.dayPeriod ?? 'AM',
  }
}

function literalSegmentAttrs(): SegmentAttributes {
  return { 'aria-hidden': true, 'data-segment': 'literal' }
}

function timeZoneSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  return {
    role: 'textbox',
    'aria-label': 'timezone, ',
    'data-readonly': true,
    'data-segment': 'timeZoneName',
    tabindex: props.disabled ? undefined : 0,
    style: SEGMENT_CARET_STYLE,
  }
}

function eraSegmentAttrs(props: SegmentAttributeProps): SegmentAttributes {
  const { segmentValues, placeholder } = props
  return {
    ...commonSegmentAttrs(props),
    'aria-label': 'era',
    'aria-valuemin': 0,
    'aria-valuemax': 0,
    'aria-valuenow': 0,
    'aria-valuetext':
      'era' in segmentValues
        ? ((segmentValues as unknown as Values).era as string)
        : (placeholder as DateValue & { era: string }).era,
  }
}

const segmentBuilders: Record<string, (props: SegmentAttributeProps) => SegmentAttributes> = {
  day: daySegmentAttrs,
  month: monthSegmentAttrs,
  year: yearSegmentAttrs,
  hour: hourSegmentAttrs,
  minute: minuteOrSecondAttrs('minute'),
  second: minuteOrSecondAttrs('second'),
  dayPeriod: dayPeriodSegmentAttrs,
  literal: literalSegmentAttrs,
  timeZoneName: timeZoneSegmentAttrs,
  era: eraSegmentAttrs,
}

export function dateSegmentAttributes(part: string, props: SegmentAttributeProps) {
  return segmentBuilders[part]?.(props) ?? {}
}

export interface Box<T> {
  value: T
}

export interface DateFieldSegmentOptions {
  hasLeftFocus: Box<boolean>
  lastKeyZero: Box<boolean>
  placeholder: () => DateValue
  hourCycle: HourCycle
  step: () => DateStep
  stepSnapping: () => boolean
  formatter: Formatter
  segmentValues: () => SegmentValueObj
  assign: (fields: Values) => void
  disabled: () => boolean
  readonly: () => boolean
  part: DateFieldPart
  setModelValue: (value: DateValue | undefined) => void
  focusNext: () => void
}

export function createDateFieldSegment(props: DateFieldSegmentOptions) {
  const values = () => props.segmentValues() as Values
  const assign = (part: string, value: number | string | null) => props.assign({ [part]: value })
  const placeholder = () => props.placeholder() as unknown as Cyclable

  function minuteSecondIncrementation(
    event: KeyboardEvent,
    part: 'minute' | 'second',
    dateRef: Cyclable,
    prevValue: number | null,
  ) {
    const step = props.step()[part] ?? 1
    const sign = event.key === kbd.ARROW_UP ? step : -step
    if (prevValue === null) return sign > 0 ? 0 : 59
    return dateRef.set({ [part]: prevValue }).cycle(part, sign)[part] as number
  }

  function deleteValue(prevValue: number | null) {
    props.hasLeftFocus.value = false
    if (prevValue === null) return prevValue
    const str = prevValue.toString()
    if (str.length === 1) {
      props.setModelValue(undefined)
      return null
    }
    return Number.parseInt(str.slice(0, -1))
  }

  function dateTimeValueIncrementation(
    event: KeyboardEvent,
    part: 'day' | 'month' | 'year' | 'hour',
    dateRef: Cyclable,
    prevValue: number | null,
  ) {
    const step = props.step()[part] ?? 1
    const sign = event.key === kbd.ARROW_UP ? step : -step
    if (prevValue === null) return dateRef[part] as number
    if (part === 'hour' && 'hour' in dateRef)
      return dateRef.set({ [part]: prevValue }).cycle(part, sign)[part] as number
    if (part === 'day')
      return dateRef
        .set({ [part]: prevValue, month: (values().month as number | null) ?? 1 })
        .cycle(part, sign)[part] as number
    return dateRef.set({ [part]: prevValue }).cycle(part, sign)[part] as number
  }

  function startOver(prev: number | null, resetZero: boolean) {
    if (!props.hasLeftFocus.value) return prev
    props.hasLeftFocus.value = false
    if (resetZero) props.lastKeyZero.value = false
    return null
  }

  function updateTwoDigits(
    max: number,
    num: number,
    prevValue: number | null,
    zero: number | null,
    overflowMoves: boolean,
  ) {
    const prev = startOver(prevValue, true)
    let moveToNext = false
    const maxStart = Math.floor(max / 10)
    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.value = true
        return { value: zero, moveToNext }
      }
      if (props.lastKeyZero.value || num > maxStart) moveToNext = true
      props.lastKeyZero.value = false
      return { value: num, moveToNext }
    }
    const digits = prev.toString().length
    const total = Number.parseInt(prev.toString() + num.toString())
    if (digits === 2 || total > max) {
      if (num > maxStart || (overflowMoves && total > max)) moveToNext = true
      return { value: num, moveToNext }
    }
    moveToNext = true
    return { value: total, moveToNext }
  }

  function updateYear(num: number, prevValue: number | null) {
    const prev = startOver(prevValue, false)
    let moveToNext = false
    if (prev === null) return { value: num === 0 ? 1 : num, moveToNext }
    const str = prev.toString() + num.toString()
    if (str.length > 4) return { value: num === 0 ? 1 : num, moveToNext }
    if (str.length === 4) moveToNext = true
    return { value: Number.parseInt(str), moveToNext }
  }

  function handleDateSegmentKeydown(event: KeyboardEvent, part: 'day' | 'month' | 'year') {
    if (!isAcceptableSegmentKey(event.key) || isSegmentNavigationKey(event.key)) return
    const prevValue = values()[part] as number | null
    if (event.key === kbd.ARROW_DOWN || event.key === kbd.ARROW_UP) {
      assign(part, dateTimeValueIncrementation(event, part, placeholder(), prevValue))
      return
    }
    if (isNumberString(event.key)) {
      const num = Number.parseInt(event.key)
      let result: { value: number | null; moveToNext: boolean }
      if (part === 'day') {
        const month = values().month as number | null
        const daysInMonth = month ? getDaysInMonth(props.placeholder().set({ month })) : 31
        result = updateTwoDigits(daysInMonth, num, prevValue, null, true)
      } else if (part === 'month') result = updateTwoDigits(12, num, prevValue, null, true)
      else result = updateYear(num, prevValue)
      assign(part, result.value)
      if (result.moveToNext) props.focusNext()
    }
    if (event.key === kbd.BACKSPACE) {
      props.hasLeftFocus.value = false
      assign(part, deleteValue(prevValue))
    }
  }

  function uses12HourFormat(locale: string) {
    const hourCycle = new DateFormatter(locale, { hour: 'numeric' }).resolvedOptions().hourCycle
    return hourCycle === 'h11' || hourCycle === 'h12'
  }

  function handleHourSegmentKeydown(event: KeyboardEvent) {
    const dateRef = placeholder()
    if (
      !isAcceptableSegmentKey(event.key) ||
      isSegmentNavigationKey(event.key) ||
      !('hour' in dateRef) ||
      !('hour' in values())
    )
      return
    const prevValue = values().hour as number | null
    if (event.key === kbd.ARROW_UP || event.key === kbd.ARROW_DOWN) {
      const newHour = dateTimeValueIncrementation(event, 'hour', placeholder(), prevValue)
      assign('hour', newHour)
      if ('dayPeriod' in values() && newHour !== null)
        assign('dayPeriod', newHour >= 12 ? 'PM' : 'AM')
      return
    }
    if (isNumberString(event.key)) {
      const num = Number.parseInt(event.key)
      const is12Hour =
        props.hourCycle !== undefined
          ? props.hourCycle === 12
          : uses12HourFormat(props.formatter.getLocale())
      const max = is12Hour ? 12 : 24
      let displayPrev = prevValue
      if (is12Hour && prevValue !== null)
        displayPrev = prevValue % 12 === 0 ? 0 : prevValue > 12 ? prevValue - 12 : prevValue
      const { value, moveToNext } = updateTwoDigits(max, num, displayPrev, 0, false)
      let internalValue = value
      if (is12Hour && value !== null) {
        const period = (values().dayPeriod as string | null) || 'AM'
        if (value === 12) internalValue = period === 'AM' ? 0 : 12
        else internalValue = period === 'PM' ? value + 12 : value
      }
      assign('hour', internalValue)
      if (moveToNext) props.focusNext()
    }
    if (event.key === kbd.BACKSPACE) {
      props.hasLeftFocus.value = false
      assign('hour', deleteValue(prevValue))
    }
  }

  function handleMinuteOrSecondKeydown(event: KeyboardEvent, part: 'minute' | 'second') {
    const dateRef = placeholder()
    if (
      !isAcceptableSegmentKey(event.key) ||
      isSegmentNavigationKey(event.key) ||
      !(part in dateRef) ||
      !(part in values())
    )
      return
    const prevValue = values()[part] as number | null
    if (event.key === kbd.ARROW_UP || event.key === kbd.ARROW_DOWN)
      assign(part, minuteSecondIncrementation(event, part, placeholder(), prevValue))
    if (isNumberString(event.key)) {
      const num = Number.parseInt(event.key)
      const { value, moveToNext } = updateTwoDigits(59, num, prevValue, 0, false)
      assign(part, value)
      if (moveToNext) props.focusNext()
    }
    if (event.key === kbd.BACKSPACE) {
      props.hasLeftFocus.value = false
      assign(part, deleteValue(prevValue))
    }
  }

  function handleDayPeriodSegmentKeydown(event: KeyboardEvent) {
    if (
      ((!isAcceptableSegmentKey(event.key) || isSegmentNavigationKey(event.key)) &&
        event.key !== 'a' &&
        event.key !== 'p') ||
      !('hour' in placeholder()) ||
      !('dayPeriod' in values())
    )
      return
    const hour = () => values().hour as number
    if (event.key === kbd.ARROW_UP || event.key === kbd.ARROW_DOWN) {
      if (values().dayPeriod === 'AM') {
        props.assign({ dayPeriod: 'PM', hour: hour() + 12 })
        return
      }
      props.assign({ dayPeriod: 'AM', hour: hour() - 12 })
      return
    }
    if (['a', 'A'].includes(event.key) && values().dayPeriod !== 'AM') {
      props.assign({ dayPeriod: 'AM', hour: hour() - 12 })
      return
    }
    if (['p', 'P'].includes(event.key) && values().dayPeriod !== 'PM')
      props.assign({ dayPeriod: 'PM', hour: hour() + 12 })
  }

  function handleSegmentClick(event: MouseEvent) {
    if (props.disabled()) event.preventDefault()
  }

  function commit() {
    if (Object.values(values()).every(item => item !== null)) {
      const dateRef = props.placeholder().set({ ...props.segmentValues() } as never)
      props.setModelValue(dateRef.copy())
    }
  }

  function handleSegmentKeydown(event: KeyboardEvent) {
    if (event.isComposing || event.key === 'Process') return
    if (props.disabled() || props.readonly()) return
    if (event.key !== kbd.TAB) event.preventDefault()
    switch (props.part) {
      case 'day':
      case 'month':
      case 'year':
        handleDateSegmentKeydown(event, props.part)
        break
      case 'hour':
        handleHourSegmentKeydown(event)
        break
      case 'minute':
      case 'second':
        handleMinuteOrSecondKeydown(event, props.part)
        break
      case 'dayPeriod':
        handleDayPeriodSegmentKeydown(event)
        break
    }
    if (
      !([kbd.ARROW_LEFT, kbd.ARROW_RIGHT] as string[]).includes(event.key) &&
      event.key !== kbd.TAB &&
      event.key !== kbd.SHIFT &&
      isAcceptableSegmentKey(event.key)
    )
      commit()
  }

  function handleSegmentFocusOut() {
    if (!props.stepSnapping()) return
    const current = values()
    const step = props.step()
    if (
      props.part === 'hour' &&
      'hour' in current &&
      current.hour !== null &&
      step.hour &&
      step.hour > 1
    ) {
      const hour = snapValueToStep(current.hour as number, 0, 23, step.hour)
      const next: Values = { hour }
      if ('dayPeriod' in current) {
        if (hour < 12) next.dayPeriod = 'AM'
        else if (hour) next.dayPeriod = 'PM'
      }
      props.assign(next)
    } else if (
      props.part === 'minute' &&
      'minute' in current &&
      current.minute !== null &&
      step.minute &&
      step.minute > 1
    )
      assign('minute', snapValueToStep(current.minute as number, 0, 59, step.minute))
    else if (
      props.part === 'second' &&
      'second' in current &&
      current.second !== null &&
      step.second &&
      step.second > 1
    )
      assign('second', snapValueToStep(current.second as number, 0, 59, step.second))
    commit()
  }

  let preCompositionNodes: { node: ChildNode; value: string | null }[] | null = null

  function handleSegmentBeforeInput(event: InputEvent) {
    if (!event.isComposing) event.preventDefault()
  }

  function handleSegmentCompositionStart(event: CompositionEvent) {
    const element = event.target as HTMLElement
    preCompositionNodes = Array.from(element.childNodes, node => ({ node, value: node.nodeValue }))
  }

  function handleSegmentCompositionEnd(event: CompositionEvent) {
    const element = event.target as HTMLElement
    const original = preCompositionNodes
    preCompositionNodes = null
    if (original) {
      for (const { node, value } of original) node.nodeValue = value
      element.replaceChildren(...original.map(entry => entry.node))
    }
    const data = event.data
    if (!data) return
    for (const char of data) {
      if (!DIGIT_REG.test(char)) continue
      const target = getActiveElement()
      if (!(target instanceof HTMLElement)) break
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key: char, bubbles: true, cancelable: true }),
      )
    }
  }

  return {
    handleSegmentClick,
    handleSegmentKeydown,
    handleSegmentBeforeInput,
    handleSegmentCompositionStart,
    handleSegmentCompositionEnd,
    handleSegmentFocusOut,
  }
}
