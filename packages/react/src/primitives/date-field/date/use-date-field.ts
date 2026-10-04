import type {
  CSSProperties,
  CompositionEvent as ReactCompositionEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from 'react'
import { DateFormatter, type DateValue } from '@internationalized/date'
import { getDaysInMonth, toDate, type HourCycle } from './comparators'
import type { Formatter } from './formatter'
import type { SegmentValueObj } from './parser'
import { isAcceptableSegmentKey, isNumberString, isSegmentNavigationKey } from './segment'
import { getActiveElement, kbd, snapValueToStep, type DateStep } from './utils'

const DIGIT_REG = /^\d$/

type Part = keyof SegmentValueObj | 'literal' | 'timeZoneName' | 'era'
type Values = Record<string, number | string | null | undefined>
type CyclePart = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
interface Cyclable {
  set: (fields: Record<string, number>) => Cyclable
  cycle: (field: CyclePart, amount: number) => Cyclable
  [key: string]: unknown
}

export type SegmentAttributes = Record<
  string,
  string | number | boolean | CSSProperties | undefined
>

interface AttrsProps {
  disabled: boolean
  placeholder: DateValue
  hourCycle: HourCycle
  segmentValues: SegmentValueObj
  formatter: Formatter
}

const caret: CSSProperties = { caretColor: 'transparent' }

function commonSegmentAttrs(props: AttrsProps): SegmentAttributes {
  return {
    role: 'spinbutton',
    contentEditable: true,
    tabIndex: props.disabled ? undefined : 0,
    spellCheck: false,
    inputMode: 'numeric',
    autoCorrect: 'off',
    enterKeyHint: 'next',
    style: caret,
  }
}

function daySegmentAttrs(props: AttrsProps): SegmentAttributes {
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

function monthSegmentAttrs(props: AttrsProps): SegmentAttributes {
  const { segmentValues, placeholder, formatter } = props
  const isEmpty = segmentValues.month === null
  const date = segmentValues.month ? placeholder.set({ month: segmentValues.month }) : placeholder
  const valueNow = date.month
  return {
    ...commonSegmentAttrs(props),
    'aria-label': 'month, ',
    contentEditable: true,
    'aria-valuemin': 1,
    'aria-valuemax': 12,
    'aria-valuenow': valueNow,
    'aria-valuetext': isEmpty ? 'Empty' : `${valueNow} - ${formatter.fullMonth(toDate(date))}`,
    'data-placeholder': isEmpty ? '' : undefined,
  }
}

function yearSegmentAttrs(props: AttrsProps): SegmentAttributes {
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

function hourSegmentAttrs(props: AttrsProps): SegmentAttributes {
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
  return (props: AttrsProps): SegmentAttributes => {
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

function dayPeriodSegmentAttrs(props: AttrsProps): SegmentAttributes {
  const { segmentValues } = props
  if (!('dayPeriod' in segmentValues)) return {}
  const hour = segmentValues.hour
  return {
    ...commonSegmentAttrs(props),
    inputMode: 'text',
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

function timeZoneSegmentAttrs(props: AttrsProps): SegmentAttributes {
  return {
    role: 'textbox',
    'aria-label': 'timezone, ',
    'data-readonly': true,
    'data-segment': 'timeZoneName',
    tabIndex: props.disabled ? undefined : 0,
    style: caret,
  }
}

function eraSegmentAttrs(props: AttrsProps): SegmentAttributes {
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

const segmentBuilders: Record<string, (props: AttrsProps) => SegmentAttributes> = {
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

export interface SegmentStore {
  get: () => SegmentValueObj
  set: (next: SegmentValueObj) => void
}

export interface UseDateFieldProps {
  hasLeftFocus: RefObject<boolean>
  lastKeyZero: RefObject<boolean>
  placeholder: () => DateValue
  hourCycle: HourCycle
  step: Required<DateStep>
  stepSnapping?: boolean
  segmentValues: SegmentStore
  formatter: Formatter
  part: Part
  disabled: boolean
  readonly: boolean
  focusNext: () => void
  modelValue: { set: (value: DateValue | undefined) => void }
}

export function useDateField(props: UseDateFieldProps) {
  const values = () => props.segmentValues.get() as Values
  const assign = (part: string, value: number | string | null) =>
    props.segmentValues.set({ ...props.segmentValues.get(), [part]: value })
  const placeholder = () => props.placeholder() as unknown as Cyclable

  function minuteSecondIncrementation({
    e,
    part,
    dateRef,
    prevValue,
  }: {
    e: KeyboardEvent | ReactKeyboardEvent
    part: 'minute' | 'second'
    dateRef: Cyclable
    prevValue: number | null
  }) {
    const step = props.step[part] ?? 1
    const sign = e.key === kbd.ARROW_UP ? step : -step
    if (prevValue === null) return sign > 0 ? 0 : 59
    return dateRef.set({ [part]: prevValue }).cycle(part, sign)[part] as number
  }

  function deleteValue(prevValue: number | null) {
    props.hasLeftFocus.current = false
    if (prevValue === null) return prevValue
    const str = prevValue.toString()
    if (str.length === 1) {
      props.modelValue.set(undefined)
      return null
    }
    return Number.parseInt(str.slice(0, -1))
  }

  function dateTimeValueIncrementation({
    e,
    part,
    dateRef,
    prevValue,
  }: {
    e: KeyboardEvent | ReactKeyboardEvent
    part: 'day' | 'month' | 'year' | 'hour'
    dateRef: Cyclable
    prevValue: number | null
  }) {
    const step = props.step[part] ?? 1
    const sign = e.key === kbd.ARROW_UP ? step : -step
    if (prevValue === null) return dateRef[part] as number
    if (part === 'hour' && 'hour' in dateRef)
      return dateRef.set({ [part]: prevValue }).cycle(part, sign)[part] as number
    if (part === 'day')
      return dateRef
        .set({ [part]: prevValue, month: (values().month as number | null) ?? 1 })
        .cycle(part, sign)[part] as number
    return dateRef.set({ [part]: prevValue }).cycle(part, sign)[part] as number
  }

  function updateDayOrMonth(max: number, num: number, prevValue: number | null) {
    let prev = prevValue
    let moveToNext = false
    const maxStart = Math.floor(max / 10)
    if (props.hasLeftFocus.current) {
      props.hasLeftFocus.current = false
      props.lastKeyZero.current = false
      prev = null
    }
    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.current = true
        return { value: null, moveToNext }
      }
      if (props.lastKeyZero.current || num > maxStart) moveToNext = true
      props.lastKeyZero.current = false
      return { value: num, moveToNext }
    }
    const digits = prev.toString().length
    const total = Number.parseInt(prev.toString() + num.toString())
    if (digits === 2 || total > max) {
      if (num > maxStart || total > max) moveToNext = true
      return { value: num, moveToNext }
    }
    moveToNext = true
    return { value: total, moveToNext }
  }

  function updateMinuteOrSecond(num: number, prevValue: number | null) {
    let prev = prevValue
    const max = 59
    let moveToNext = false
    const maxStart = Math.floor(max / 10)
    if (props.hasLeftFocus.current) {
      props.hasLeftFocus.current = false
      props.lastKeyZero.current = false
      prev = null
    }
    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.current = true
        return { value: 0, moveToNext }
      }
      if (props.lastKeyZero.current || num > maxStart) moveToNext = true
      props.lastKeyZero.current = false
      return { value: num, moveToNext }
    }
    const digits = prev.toString().length
    const total = Number.parseInt(prev.toString() + num.toString())
    if (digits === 2 || total > max) {
      if (num > maxStart) moveToNext = true
      return { value: num, moveToNext }
    }
    moveToNext = true
    return { value: total, moveToNext }
  }

  function updateHour(max: number, num: number, prevValue: number | null) {
    let prev = prevValue
    let moveToNext = false
    const maxStart = Math.floor(max / 10)
    if (props.hasLeftFocus.current) {
      props.hasLeftFocus.current = false
      props.lastKeyZero.current = false
      prev = null
    }
    if (prev === null) {
      if (num === 0) {
        props.lastKeyZero.current = true
        return { value: 0, moveToNext }
      }
      if (props.lastKeyZero.current || num > maxStart) moveToNext = true
      props.lastKeyZero.current = false
      return { value: num, moveToNext }
    }
    const digits = prev.toString().length
    const total = Number.parseInt(prev.toString() + num.toString())
    if (digits === 2 || total > max) {
      if (num > maxStart) moveToNext = true
      return { value: num, moveToNext }
    }
    moveToNext = true
    return { value: total, moveToNext }
  }

  function updateYear(num: number, prevValue: number | null) {
    let prev = prevValue
    let moveToNext = false
    if (props.hasLeftFocus.current) {
      props.hasLeftFocus.current = false
      prev = null
    }
    if (prev === null) return { value: num === 0 ? 1 : num, moveToNext }
    const str = prev.toString() + num.toString()
    if (str.length > 4) return { value: num === 0 ? 1 : num, moveToNext }
    if (str.length === 4) moveToNext = true
    return { value: Number.parseInt(str), moveToNext }
  }

  const attributes =
    segmentBuilders[props.part]?.({
      disabled: props.disabled,
      placeholder: props.placeholder(),
      hourCycle: props.hourCycle,
      segmentValues: props.segmentValues.get(),
      formatter: props.formatter,
    }) ?? {}

  function handleDateSegmentKeydown(e: ReactKeyboardEvent, part: 'day' | 'month' | 'year') {
    if (!isAcceptableSegmentKey(e.key) || isSegmentNavigationKey(e.key)) return
    const prevValue = values()[part] as number | null
    if (e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
      assign(part, dateTimeValueIncrementation({ e, part, dateRef: placeholder(), prevValue }))
      return
    }
    if (isNumberString(e.key)) {
      const num = Number.parseInt(e.key)
      let result: { value: number | null; moveToNext: boolean }
      if (part === 'day') {
        const segmentMonthValue = values().month as number | null
        const daysInMonth = segmentMonthValue
          ? getDaysInMonth(props.placeholder().set({ month: segmentMonthValue }))
          : 31
        result = updateDayOrMonth(daysInMonth, num, prevValue)
      } else if (part === 'month') result = updateDayOrMonth(12, num, prevValue)
      else result = updateYear(num, prevValue)
      assign(part, result.value)
      if (result.moveToNext) props.focusNext()
    }
    if (e.key === kbd.BACKSPACE) {
      props.hasLeftFocus.current = false
      assign(part, deleteValue(prevValue))
    }
  }

  function uses12HourFormat(locale: string) {
    const hourCycle = new DateFormatter(locale, { hour: 'numeric' }).resolvedOptions().hourCycle
    return hourCycle === 'h11' || hourCycle === 'h12'
  }

  function handleHourSegmentKeydown(e: ReactKeyboardEvent) {
    const dateRef = placeholder()
    if (
      !isAcceptableSegmentKey(e.key) ||
      isSegmentNavigationKey(e.key) ||
      !('hour' in dateRef) ||
      !('hour' in values())
    )
      return
    const prevValue = values().hour as number | null
    if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) {
      const newHour = dateTimeValueIncrementation({
        e,
        part: 'hour',
        dateRef: placeholder(),
        prevValue,
      })
      assign('hour', newHour)
      if ('dayPeriod' in values() && newHour !== null)
        assign('dayPeriod', newHour >= 12 ? 'PM' : 'AM')
      return
    }
    if (isNumberString(e.key)) {
      const num = Number.parseInt(e.key)
      const is12Hour =
        props.hourCycle !== undefined
          ? props.hourCycle === 12
          : uses12HourFormat(props.formatter.getLocale())
      const max = is12Hour ? 12 : 24
      let displayPrev = prevValue
      if (is12Hour && prevValue !== null)
        displayPrev = prevValue % 12 === 0 ? 0 : prevValue > 12 ? prevValue - 12 : prevValue
      const { value, moveToNext } = updateHour(max, num, displayPrev)
      let internalValue = value
      if (is12Hour && value !== null) {
        const period = (values().dayPeriod as string | null) || 'AM'
        if (value === 12) internalValue = period === 'AM' ? 0 : 12
        else internalValue = period === 'PM' ? value + 12 : value
      }
      assign('hour', internalValue)
      if (moveToNext) props.focusNext()
    }
    if (e.key === kbd.BACKSPACE) {
      props.hasLeftFocus.current = false
      assign('hour', deleteValue(prevValue))
    }
  }

  function handleMinuteOrSecondKeydown(e: ReactKeyboardEvent, part: 'minute' | 'second') {
    const dateRef = placeholder()
    if (
      !isAcceptableSegmentKey(e.key) ||
      isSegmentNavigationKey(e.key) ||
      !(part in dateRef) ||
      !(part in values())
    )
      return
    const prevValue = values()[part] as number | null
    if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN)
      assign(part, minuteSecondIncrementation({ e, part, dateRef: placeholder(), prevValue }))
    if (isNumberString(e.key)) {
      const num = Number.parseInt(e.key)
      const { value, moveToNext } = updateMinuteOrSecond(num, prevValue)
      assign(part, value)
      if (moveToNext) props.focusNext()
    }
    if (e.key === kbd.BACKSPACE) {
      props.hasLeftFocus.current = false
      assign(part, deleteValue(prevValue))
    }
  }

  function handleDayPeriodSegmentKeydown(e: ReactKeyboardEvent) {
    if (
      ((!isAcceptableSegmentKey(e.key) || isSegmentNavigationKey(e.key)) &&
        e.key !== 'a' &&
        e.key !== 'p') ||
      !('hour' in placeholder()) ||
      !('dayPeriod' in values())
    )
      return
    const hour = values().hour as number
    if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) {
      if (values().dayPeriod === 'AM') {
        props.segmentValues.set({ ...props.segmentValues.get(), dayPeriod: 'PM', hour: hour + 12 })
        return
      }
      props.segmentValues.set({ ...props.segmentValues.get(), dayPeriod: 'AM', hour: hour - 12 })
      return
    }
    if (['a', 'A'].includes(e.key) && values().dayPeriod !== 'AM') {
      props.segmentValues.set({ ...props.segmentValues.get(), dayPeriod: 'AM', hour: hour - 12 })
      return
    }
    if (['p', 'P'].includes(e.key) && values().dayPeriod !== 'PM')
      props.segmentValues.set({ ...props.segmentValues.get(), dayPeriod: 'PM', hour: hour + 12 })
  }

  function handleSegmentClick(e: ReactMouseEvent) {
    if (props.disabled) e.preventDefault()
  }

  function commit() {
    if (Object.values(values()).every(item => item !== null)) {
      const dateRef = props.placeholder().set({ ...props.segmentValues.get() } as never)
      props.modelValue.set(dateRef.copy())
    }
  }

  function handleSegmentKeydown(e: ReactKeyboardEvent) {
    if (e.nativeEvent.isComposing || e.key === 'Process') return
    if (props.disabled || props.readonly) return
    if (e.key !== kbd.TAB) e.preventDefault()
    switch (props.part) {
      case 'day':
      case 'month':
      case 'year':
        handleDateSegmentKeydown(e, props.part)
        break
      case 'hour':
        handleHourSegmentKeydown(e)
        break
      case 'minute':
      case 'second':
        handleMinuteOrSecondKeydown(e, props.part)
        break
      case 'dayPeriod':
        handleDayPeriodSegmentKeydown(e)
        break
    }
    if (
      !([kbd.ARROW_LEFT, kbd.ARROW_RIGHT] as string[]).includes(e.key) &&
      e.key !== kbd.TAB &&
      e.key !== kbd.SHIFT &&
      isAcceptableSegmentKey(e.key)
    )
      commit()
  }

  function handleSegmentFocusOut() {
    if (!props.stepSnapping) return
    const current = values()
    const step = props.step
    if (
      props.part === 'hour' &&
      'hour' in current &&
      current.hour !== null &&
      step.hour &&
      step.hour > 1
    ) {
      const hour = snapValueToStep(current.hour as number, 0, 23, step.hour)
      const next: Values = { ...current, hour }
      if ('dayPeriod' in current) {
        if (hour < 12) next.dayPeriod = 'AM'
        else if (hour) next.dayPeriod = 'PM'
      }
      props.segmentValues.set(next as SegmentValueObj)
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

  function handleSegmentBeforeInput(e: InputEvent) {
    if (!e.isComposing) e.preventDefault()
  }

  function handleSegmentCompositionStart(e: ReactCompositionEvent) {
    const el = e.target as HTMLElement
    preCompositionNodes = Array.from(el.childNodes, node => ({ node, value: node.nodeValue }))
  }

  function handleSegmentCompositionEnd(e: ReactCompositionEvent) {
    const el = e.target as HTMLElement
    const original = preCompositionNodes
    preCompositionNodes = null
    if (original) {
      for (const { node, value } of original) node.nodeValue = value
      el.replaceChildren(...original.map(o => o.node))
    }
    const data = e.data
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
    attributes,
  }
}
