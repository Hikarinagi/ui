'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { useComposedRefs } from 'radix-ui/internal'
import {
  getLocalTimeZone,
  isEqualDay,
  isSameDay,
  isSameMonth,
  isToday,
  type DateValue,
} from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { getDaysBetween, getWeekStartsOn, type Month } from '../date-field/date/calendar'
import {
  areAllDaysBetweenValid,
  getDefaultDate,
  isBefore,
  isBetween,
  isBetweenInclusive,
  toDate,
} from '../date-field/date/comparators'
import type { Formatter } from '../date-field/date/formatter'
import {
  useDirection,
  useLocale,
  useNextTick,
  useStore,
  useVModel,
  useWatch,
} from '../date-field/date/hooks'
import { handleCalendarInitialFocus, kbd } from '../date-field/date/utils'
import {
  GridTable,
  HiddenHeading,
  matchesGridKey,
  type CalendarPagingProps,
  type CalendarPartProps,
} from '../calendar/shared'
import {
  useCalendar,
  type Matcher,
  type PageFunction,
  type WeekDayFormat,
} from '../calendar/use-calendar'

export {
  CalendarGridBody as RangeCalendarGridBody,
  CalendarGridHead as RangeCalendarGridHead,
  CalendarGridRow as RangeCalendarGridRow,
  CalendarHeadCell as RangeCalendarHeadCell,
} from '../calendar'

export interface DateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

type FixedDate = 'start' | 'end'

interface HighlightedRange {
  start: DateValue
  end: DateValue
}

function useRangeCalendarState(props: {
  start: DateValue | undefined
  end: DateValue | undefined
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
  isDateHighlightable?: Matcher
  focusedValue: DateValue | undefined
  allowNonContiguousRanges: boolean
  fixedDate?: FixedDate
  maximumDays?: number
}) {
  const { start, end } = props
  const isStartInvalid = !!start && props.isDateDisabled(start)
  const isEndInvalid = !!end && props.isDateDisabled(end)
  const isInvalid = isStartInvalid || isEndInvalid || (!!start && !!end && isBefore(end, start))

  const isSelectionStart = (date: DateValue) => !!start && isSameDay(start, date)
  const isSelectionEnd = (date: DateValue) => !!end && isSameDay(end, date)
  const isSelected = (date: DateValue) => {
    if (start && isSameDay(start, date)) return true
    if (end && isSameDay(end, date)) return true
    if (end && start) return isBetween(date, start, end)
    return false
  }

  const rangeIsDateDisabled = (date: DateValue) => {
    if (props.isDateDisabled(date)) return true
    if (props.maximumDays) {
      if (start && end) {
        if (props.fixedDate) {
          const diff = getDaysBetween(start, end).length
          if (diff <= props.maximumDays) {
            const daysLeft = props.maximumDays - diff - 1
            const startLimit = start.subtract({ days: daysLeft })
            const endLimit = end.add({ days: daysLeft })
            return !isBetween(date, startLimit, endLimit)
          }
        }
        return false
      }
      if (start) {
        const maxDate = start.add({ days: props.maximumDays })
        const minDate = start.subtract({ days: props.maximumDays })
        return !isBetween(date, minDate, maxDate)
      }
    }
    return false
  }

  const isDateHighlightable = (date: DateValue) => !!props.isDateHighlightable?.(date)

  function computeHighlightedRange(): HighlightedRange | null {
    if (start && end && !props.fixedDate) return null
    if (!start || !props.focusedValue) return null
    const focused = props.focusedValue
    const isStartBeforeFocused = isBefore(start, focused)
    const rangeStart = isStartBeforeFocused ? start : focused
    const rangeEnd = isStartBeforeFocused ? focused : start
    if (isSameDay(rangeStart, rangeEnd)) return { start: rangeStart, end: rangeEnd }
    if (props.maximumDays && !end) {
      const maximumDays = props.maximumDays
      const anchor = start
      if (!isBefore(focused, anchor))
        return { start: anchor, end: anchor.add({ days: maximumDays - 1 }) }
      return { start: anchor.subtract({ days: maximumDays - 1 }), end: anchor }
    }
    const isValid = areAllDaysBetweenValid(
      rangeStart,
      rangeEnd,
      props.allowNonContiguousRanges ? () => false : props.isDateUnavailable,
      rangeIsDateDisabled,
      props.isDateHighlightable,
    )
    if (isValid) return { start: rangeStart, end: rangeEnd }
    return null
  }
  const highlightedRange = computeHighlightedRange()

  const isHighlightedStart = (date: DateValue) =>
    !!highlightedRange?.start && isSameDay(highlightedRange.start, date)
  const isHighlightedEnd = (date: DateValue) =>
    !!highlightedRange?.end && isSameDay(highlightedRange.end, date)
  const hasSelectedDate = !!(start || end)
  const isStartDateDisabled = !!(start && props.isDateDisabled(start))
  const isEndDateDisabled = !!(end && props.isDateDisabled(end))
  let isSelectedDisabled = false
  if (start || end) {
    if (start && end) isSelectedDisabled = isStartDateDisabled && isEndDateDisabled
    else isSelectedDisabled = (!!start && isStartDateDisabled) || (!!end && isEndDateDisabled)
  }
  let selectedFocusableDate: DateValue | undefined
  if (start && !isStartDateDisabled) selectedFocusableDate = start
  else if (end && !isEndDateDisabled) selectedFocusableDate = end

  return {
    isInvalid,
    isSelected,
    isDateHighlightable,
    highlightedRange,
    isSelectionStart,
    isSelectionEnd,
    isHighlightedStart,
    isHighlightedEnd,
    isDateDisabled: rangeIsDateDisabled,
    hasSelectedDate,
    isSelectedDisabled,
    selectedFocusableDate,
  }
}

interface Holder<T> {
  get: () => T
  set: (next: T) => void
}

interface RangeCalendarRootContextValue {
  locale: string
  dir: 'ltr' | 'rtl'
  formatter: Formatter
  placeholder: DateValue
  disabled: boolean
  readonly: boolean
  preventDeselect: boolean
  disableDaysOutsideCurrentView: boolean
  allowNonContiguousRanges: boolean
  fixedDate?: FixedDate
  minValue?: DateValue
  maxValue?: DateValue
  startValue: Holder<DateValue | undefined>
  endValue: Holder<DateValue | undefined>
  focusedValue: Holder<DateValue | undefined>
  lastPressedDateValue: RefObject<DateValue | undefined>
  highlightedRange: HighlightedRange | null
  isSelected: (date: DateValue) => boolean
  isSelectionStart: (date: DateValue) => boolean
  isSelectionEnd: (date: DateValue) => boolean
  isHighlightedStart: (date: DateValue) => boolean
  isHighlightedEnd: (date: DateValue) => boolean
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
  isNextButtonDisabled: (nextPageFunc?: PageFunction) => boolean
  isPrevButtonDisabled: (prevPageFunc?: PageFunction) => boolean
  isOutsideVisibleView: (date: DateValue) => boolean
  nextPage: (nextPageFunc?: PageFunction) => void
  prevPage: (prevPageFunc?: PageFunction) => void
  parentElement: RefObject<HTMLElement | null>
  onPlaceholderChange: (value: DateValue) => void
  isPlaceholderFocusable: boolean
  firstFocusableDate: DateValue | undefined
  hasSelectedDate: boolean
  isSelectedDisabled: boolean
  selectedFocusableDate: DateValue | undefined
  nextTick: (callback: () => void) => void
}

const RangeCalendarRootContext = createContext<RangeCalendarRootContextValue | null>(null)

function useRangeCalendarRootContext(consumer: string) {
  const context = useContext(RangeCalendarRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`RangeCalendarRoot\``)
  return context
}

export interface RangeCalendarSlotProps {
  date: DateValue
  grid: Month<DateValue>[]
  weekDays: string[]
  weekStartsOn: number
  locale: string
  fixedWeeks: boolean
  modelValue: DateRange
}

export interface RangeCalendarRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'placeholder' | 'children' | 'dir'> {
  defaultValue?: DateRange
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  onPlaceholderChange?: (value: DateValue) => void
  value?: DateRange | null
  onValueChange?: (value: DateRange) => void
  onValidModelValueChange?: (value: DateRange) => void
  onStartValueChange?: (value: DateValue | undefined) => void
  allowNonContiguousRanges?: boolean
  pagedNavigation?: boolean
  preventDeselect?: boolean
  maximumDays?: number
  weekStartsOn?: number
  weekdayFormat?: WeekDayFormat
  calendarLabel?: string
  fixedWeeks?: boolean
  maxValue?: DateValue
  minValue?: DateValue
  locale?: string
  numberOfMonths?: number
  disabled?: boolean
  readonly?: boolean
  initialFocus?: boolean
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  isDateHighlightable?: Matcher
  dir?: 'ltr' | 'rtl'
  nextPage?: PageFunction
  prevPage?: PageFunction
  disableDaysOutsideCurrentView?: boolean
  fixedDate?: FixedDate
  children?: (props: RangeCalendarSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

const EMPTY: DateRange = { start: undefined, end: undefined }

export function RangeCalendarRoot({
  defaultValue,
  defaultPlaceholder,
  placeholder: placeholderProp,
  onPlaceholderChange: onPlaceholderChangeProp,
  value,
  onValueChange,
  onValidModelValueChange,
  onStartValueChange,
  allowNonContiguousRanges = false,
  pagedNavigation = false,
  preventDeselect = false,
  maximumDays,
  weekStartsOn: weekStartsOnProp,
  weekdayFormat = 'narrow',
  calendarLabel,
  fixedWeeks = false,
  maxValue,
  minValue,
  locale: localeProp,
  numberOfMonths = 1,
  disabled = false,
  readonly = false,
  initialFocus = false,
  isDateDisabled: isDateDisabledProp,
  isDateUnavailable: isDateUnavailableProp,
  isDateHighlightable,
  dir: dirProp,
  nextPage: nextPageProp,
  prevPage: prevPageProp,
  disableDaysOutsideCurrentView = false,
  fixedDate,
  as = 'div',
  asChild,
  children,
  ref,
  ...attrs
}: RangeCalendarRootProps) {
  const parentElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parentElement)
  const dir = useDirection(dirProp)
  const locale = useLocale(localeProp)
  const nextTick = useNextTick()
  const weekStartsOn = weekStartsOnProp ?? getWeekStartsOn(locale)
  const lastPressedDateValue = useRef<DateValue | undefined>(undefined)
  const focusedValue = useStore<DateValue | undefined>(undefined)
  const isEditing = useRef(false)

  const modelValue = useVModel<DateRange | null | undefined>(
    value,
    onValueChange as (value: DateRange | null | undefined) => void,
    () => defaultValue ?? { start: undefined, end: undefined },
  )
  const normalizeRange = (range: DateRange | null | undefined) => range ?? EMPTY
  const normalizedModelValue = normalizeRange(modelValue.value)
  const validModelValue = useStore<DateRange>(() => normalizeRange(modelValue.value))
  const startValue = useStore<DateValue | undefined>(() => normalizeRange(modelValue.value).start)
  const endValue = useStore<DateValue | undefined>(() => normalizeRange(modelValue.value).end)
  const placeholder = useVModel<DateValue>(
    placeholderProp,
    onPlaceholderChangeProp as (value: DateValue) => void,
    () =>
      defaultPlaceholder ??
      getDefaultDate({
        defaultPlaceholder: placeholderProp,
        defaultValue: normalizeRange(modelValue.value).start,
        locale: localeProp,
      }).copy(),
  )

  function onPlaceholderChange(next: DateValue) {
    placeholder.set(next.copy())
  }

  const calendar = useCalendar({
    locale,
    placeholder,
    weekStartsOn,
    fixedWeeks,
    numberOfMonths,
    minValue,
    maxValue,
    disabled,
    weekdayFormat,
    pagedNavigation,
    isDateDisabled: isDateDisabledProp,
    isDateUnavailable: isDateUnavailableProp,
    calendarLabel,
    nextPage: nextPageProp,
    prevPage: prevPageProp,
  })

  const range = useRangeCalendarState({
    start: startValue.value,
    end: endValue.value,
    isDateDisabled: calendar.isDateDisabled,
    isDateUnavailable: calendar.isDateUnavailable,
    isDateHighlightable,
    focusedValue: focusedValue.value,
    allowNonContiguousRanges,
    fixedDate,
    maximumDays,
  })

  useWatch([validModelValue.value] as const, ([next]) => {
    onValidModelValueChange?.(next)
  })

  useWatch([modelValue.value] as const, ([value]) => {
    const next = normalizeRange(value)
    const start = startValue.get()
    const isStartSynced =
      (!next.start && !start) || (!!next.start && !!start && isEqualDay(next.start, start))
    if (!isStartSynced) startValue.set(next.start?.copy?.())
    const end = endValue.get()
    const isEndSynced = (!next.end && !end) || (!!next.end && !!end && isEqualDay(next.end, end))
    if (!isEndSynced) endValue.set(next.end?.copy?.())
  })

  useWatch([startValue.value] as const, ([start]) => {
    if (start && !isEqualDay(start, placeholder.get())) onPlaceholderChange(start)
    onStartValueChange?.(start)
  })

  useWatch([startValue.value, endValue.value] as const, ([start, end]) => {
    const current = modelValue.get()
    if (
      current &&
      current.start &&
      current.end &&
      start &&
      end &&
      isEqualDay(current.start, start) &&
      isEqualDay(current.end, end)
    )
      return
    isEditing.current = true
    if (end && start) {
      const nextValue = isBefore(end, start)
        ? { start: end.copy(), end: start.copy() }
        : { start: start.copy(), end: end.copy() }
      modelValue.set({ start: nextValue.start, end: nextValue.end })
      isEditing.current = false
      validModelValue.set({ start: nextValue.start.copy(), end: nextValue.end.copy() })
    } else
      modelValue.set(
        start ? { start: start.copy(), end: undefined } : { start: end?.copy(), end: undefined },
      )
  })

  useEffect(() => {
    const element = parentElement.current
    if (!element) return
    const listener = (event: globalThis.KeyboardEvent) => {
      if (event.key === kbd.ESCAPE && isEditing.current) {
        startValue.set(validModelValue.get().start?.copy())
        endValue.set(validModelValue.get().end?.copy())
      }
    }
    element.addEventListener('keydown', listener)
    return () => element.removeEventListener('keydown', listener)
  }, [startValue, endValue, validModelValue])

  useEffect(() => {
    if (initialFocus) handleCalendarInitialFocus(parentElement.current)
  }, [])

  const context: RangeCalendarRootContextValue = {
    locale,
    dir,
    formatter: calendar.formatter,
    placeholder: placeholder.value,
    disabled,
    readonly,
    preventDeselect,
    disableDaysOutsideCurrentView,
    allowNonContiguousRanges,
    fixedDate,
    minValue,
    maxValue,
    startValue,
    endValue,
    focusedValue,
    lastPressedDateValue,
    highlightedRange: range.highlightedRange,
    isSelected: range.isSelected,
    isSelectionStart: range.isSelectionStart,
    isSelectionEnd: range.isSelectionEnd,
    isHighlightedStart: range.isHighlightedStart,
    isHighlightedEnd: range.isHighlightedEnd,
    isDateDisabled: range.isDateDisabled,
    isDateUnavailable: calendar.isDateUnavailable,
    isNextButtonDisabled: calendar.isNextButtonDisabled,
    isPrevButtonDisabled: calendar.isPrevButtonDisabled,
    isOutsideVisibleView: calendar.isOutsideVisibleView,
    nextPage: calendar.nextPage,
    prevPage: calendar.prevPage,
    parentElement,
    onPlaceholderChange,
    isPlaceholderFocusable: calendar.isPlaceholderFocusable,
    firstFocusableDate: calendar.firstFocusableDate,
    hasSelectedDate: range.hasSelectedDate,
    isSelectedDisabled: range.isSelectedDisabled,
    selectedFocusableDate: range.selectedFocusableDate,
    nextTick,
  }

  return (
    <RangeCalendarRootContext value={context}>
      <Primitive
        as={as}
        asChild={asChild}
        aria-label={calendar.fullCalendarLabel}
        data-readonly={readonly ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-invalid={range.isInvalid ? '' : undefined}
        dir={dir}
        {...attrs}
        ref={composedRef}
      >
        <HiddenHeading label={calendar.fullCalendarLabel} />
        {children?.({
          date: placeholder.value,
          grid: calendar.grid,
          weekDays: calendar.weekdays,
          weekStartsOn,
          locale,
          fixedWeeks,
          modelValue: normalizedModelValue,
        })}
      </Primitive>
    </RangeCalendarRootContext>
  )
}

export function RangeCalendarGrid({ as = 'table', onMouseLeave, ...props }: CalendarPartProps) {
  const context = useRangeCalendarRootContext('RangeCalendarGrid')
  return (
    <GridTable
      as={as}
      disabled={context.disabled}
      readonly={context.readonly}
      onMouseLeave={(event: MouseEvent<HTMLElement>) => {
        context.focusedValue.set(undefined)
        onMouseLeave?.(event)
      }}
      {...props}
    />
  )
}

export interface RangeCalendarCellProps extends CalendarPartProps {
  date: DateValue
}

export function RangeCalendarCell({ date, as = 'td', ...props }: RangeCalendarCellProps) {
  const context = useRangeCalendarRootContext('RangeCalendarCell')
  return (
    <Primitive
      as={as}
      role="gridcell"
      aria-selected={context.isSelected(date) ? true : undefined}
      aria-disabled={
        context.isDateDisabled(date) ||
        context.isDateUnavailable(date) ||
        context.disableDaysOutsideCurrentView
      }
      data-disabled={
        context.isDateDisabled(date) || context.disableDaysOutsideCurrentView ? '' : undefined
      }
      {...props}
    />
  )
}

export interface RangeCalendarCellTriggerProps extends CalendarPartProps {
  day: DateValue
  month: DateValue
}

export function RangeCalendarCellTrigger({
  day,
  month,
  as = 'div',
  asChild,
  children,
  ...props
}: RangeCalendarCellTriggerProps) {
  const context = useRangeCalendarRootContext('RangeCalendarCellTrigger')
  const labelText = context.formatter.custom(toDate(day), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const isUnavailable = context.isDateUnavailable(day) ?? false
  const isSelectedDate = context.isSelected(day)
  const isSelectionStart = context.isSelectionStart(day)
  const isSelectionEnd = context.isSelectionEnd(day)
  const isHighlightStart = context.isHighlightedStart(day)
  const isHighlightEnd = context.isHighlightedEnd(day)
  const isHighlighted = context.highlightedRange
    ? isBetweenInclusive(day, context.highlightedRange.start, context.highlightedRange.end)
    : false
  const allowNonContiguousRanges = context.allowNonContiguousRanges
  const isDateToday = isToday(day, getLocalTimeZone())
  const isOutsideView = !isSameMonth(day, month)
  const isOutsideVisibleView = context.isOutsideVisibleView(day)
  const isDisabled =
    context.isDateDisabled(day) || (context.disableDaysOutsideCurrentView && isOutsideView)
  const dayValue = day.day.toLocaleString(context.locale)
  let isFocusedDate = false
  if (!isOutsideView && !isDisabled) {
    if (!context.disabled && context.isPlaceholderFocusable && isSameDay(day, context.placeholder))
      isFocusedDate = true
    else if (!context.disabled && context.selectedFocusableDate && !context.isPlaceholderFocusable)
      isFocusedDate = isSameDay(day, context.selectedFocusableDate)
    else if (
      !context.disabled &&
      (!context.hasSelectedDate || context.isSelectedDisabled) &&
      !context.isPlaceholderFocusable
    )
      isFocusedDate = !!context.firstFocusableDate && isSameDay(day, context.firstFocusableDate)
  }

  function changeDate(event: { preventDefault: () => void }, date: DateValue) {
    if (context.readonly) return
    if (context.isDateDisabled(date) || context.isDateUnavailable(date)) return
    const start = context.startValue.get()
    const end = context.endValue.get()
    if (start && context.highlightedRange === null) {
      if (isSameDay(date, start) && !context.preventDeselect && !end) {
        context.startValue.set(undefined)
        context.onPlaceholderChange(date)
        context.lastPressedDateValue.current = date.copy()
        return
      } else if (!end) {
        event.preventDefault()
        if (
          context.lastPressedDateValue.current &&
          isSameDay(context.lastPressedDateValue.current, date)
        )
          context.startValue.set(date.copy())
        context.lastPressedDateValue.current = date.copy()
        return
      }
    }
    context.lastPressedDateValue.current = date.copy()
    if (
      start &&
      end &&
      isSameDay(start, end) &&
      isSameDay(start, date) &&
      !context.preventDeselect
    ) {
      context.startValue.set(undefined)
      context.endValue.set(undefined)
      context.onPlaceholderChange(date)
      return
    }
    if (!start) context.startValue.set(date.copy())
    else if (!end) context.endValue.set(date.copy())
    else if (end && start) {
      if (!context.fixedDate) {
        context.endValue.set(undefined)
        context.startValue.set(date.copy())
      } else if (context.fixedDate === 'start') {
        if (date.compare(start) < 0) context.startValue.set(date.copy())
        else context.endValue.set(date.copy())
      } else if (context.fixedDate === 'end') {
        if (date.compare(end) > 0) context.endValue.set(date.copy())
        else context.startValue.set(date.copy())
      }
    }
  }

  function handleFocus() {
    if (isDisabled || context.isDateUnavailable(day)) return
    context.focusedValue.set(day.copy())
  }

  function handleArrowKey(event: KeyboardEvent<HTMLElement>) {
    if (!matchesGridKey(event)) return
    if (isDisabled) return
    if (
      (event.code === kbd.ENTER || event.code === kbd.SPACE_CODE) &&
      (event.ctrlKey || event.metaKey || event.altKey)
    )
      return
    event.preventDefault()
    event.stopPropagation()
    const parentElement = context.parentElement.current!
    const sign = context.dir === 'rtl' ? -1 : 1
    switch (event.code) {
      case kbd.ARROW_RIGHT:
        shiftFocus(day, sign)
        break
      case kbd.ARROW_LEFT:
        shiftFocus(day, -sign)
        break
      case kbd.ARROW_UP:
        shiftFocus(day, -7)
        break
      case kbd.ARROW_DOWN:
        shiftFocus(day, 7)
        break
      case kbd.ENTER:
      case kbd.SPACE_CODE:
        changeDate(event, day)
    }

    function shiftFocus(from: DateValue, add: number) {
      const candidateDayValue = from.add({ days: add })
      if (
        (context.minValue && candidateDayValue.compare(context.minValue) < 0) ||
        (context.maxValue && candidateDayValue.compare(context.maxValue) > 0)
      )
        return
      const candidateDay = parentElement.querySelector<HTMLElement>(
        `[data-value='${candidateDayValue.toString()}']:not([data-outside-view])`,
      )
      if (!candidateDay) {
        if (add > 0) {
          if (context.isNextButtonDisabled()) return
          context.nextPage()
        } else {
          if (context.isPrevButtonDisabled()) return
          context.prevPage()
        }
        context.nextTick(() => shiftFocus(from, add))
        return
      }
      if (candidateDay.hasAttribute('data-disabled')) return shiftFocus(candidateDayValue, add)
      context.onPlaceholderChange(candidateDayValue)
      candidateDay.focus()
    }
  }

  const highlighted = isHighlighted && (allowNonContiguousRanges || !isUnavailable)
  const selected = isSelectedDate && (allowNonContiguousRanges || !isUnavailable)

  return (
    <Primitive
      as={as}
      asChild={asChild}
      role="button"
      aria-label={labelText}
      data-radix-calendar-cell-trigger=""
      aria-pressed={selected ? true : undefined}
      aria-disabled={isDisabled || isUnavailable ? true : undefined}
      data-highlighted={highlighted ? '' : undefined}
      data-selection-start={isSelectionStart ? true : undefined}
      data-selection-end={isSelectionEnd ? true : undefined}
      data-highlighted-start={isHighlightStart ? true : undefined}
      data-highlighted-end={isHighlightEnd ? true : undefined}
      data-selected={selected ? true : undefined}
      data-outside-visible-view={isOutsideVisibleView ? '' : undefined}
      data-value={day.toString()}
      data-disabled={isDisabled ? '' : undefined}
      data-unavailable={isUnavailable ? '' : undefined}
      data-today={isDateToday ? '' : undefined}
      data-outside-view={isOutsideView ? '' : undefined}
      data-focused={isFocusedDate ? '' : undefined}
      tabIndex={isFocusedDate ? 0 : isOutsideView || isDisabled ? undefined : -1}
      onClick={(event: MouseEvent<HTMLElement>) => {
        if (isDisabled) return
        changeDate(event, day)
      }}
      onFocus={handleFocus}
      onMouseEnter={handleFocus}
      onKeyDown={handleArrowKey}
      {...props}
    >
      {children ?? dayValue}
    </Primitive>
  )
}

export function RangeCalendarNext({
  nextPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useRangeCalendarRootContext('RangeCalendarNext')
  const disabled = context.disabled || context.isNextButtonDisabled(nextPage)
  return (
    <Primitive
      as={as}
      asChild={asChild}
      aria-label="Next page"
      aria-disabled={disabled || undefined}
      data-disabled={(disabled || undefined) as never}
      {...({ disabled } as Record<string, unknown>)}
      onClick={() => {
        if (disabled) return
        context.nextPage(nextPage)
      }}
      {...props}
    >
      {children ?? 'Next page'}
    </Primitive>
  )
}

export function RangeCalendarPrev({
  prevPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useRangeCalendarRootContext('RangeCalendarPrev')
  const disabled = context.disabled || context.isPrevButtonDisabled(prevPage)
  return (
    <Primitive
      as={as}
      asChild={asChild}
      aria-label="Previous page"
      aria-disabled={disabled || undefined}
      data-disabled={(disabled || undefined) as never}
      {...({ disabled } as Record<string, unknown>)}
      onClick={() => {
        if (disabled) return
        context.prevPage(prevPage)
      }}
      {...props}
    >
      {children ?? 'Prev page'}
    </Primitive>
  )
}
