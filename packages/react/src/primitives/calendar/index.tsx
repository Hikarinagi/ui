'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import {
  getLocalTimeZone,
  isEqualDay,
  isSameDay,
  isSameMonth,
  isToday,
  type DateValue,
} from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import {
  GridTable,
  HiddenHeading,
  matchesGridKey,
  type CalendarPagingProps,
  type CalendarPartProps,
} from './shared'
import { getWeekStartsOn, type Month } from '../date-field/date/calendar'
import { getDefaultDate, toDate } from '../date-field/date/comparators'
import type { Formatter } from '../date-field/date/formatter'
import { useDirection, useLocale, useNextTick, useVModel, useWatch } from '../date-field/date/hooks'
import { handleCalendarInitialFocus, kbd } from '../date-field/date/utils'
import {
  useCalendar,
  useCalendarState,
  type Matcher,
  type PageFunction,
  type WeekDayFormat,
} from './use-calendar'

export type { Matcher, PageFunction, WeekDayFormat } from './use-calendar'
export type { CalendarPagingProps, CalendarPartProps } from './shared'

interface CalendarRootContextValue {
  locale: string
  dir: 'ltr' | 'rtl'
  formatter: Formatter
  modelValue: DateValue | DateValue[] | undefined
  placeholder: DateValue
  disabled: boolean
  readonly: boolean
  preventDeselect: boolean
  disableDaysOutsideCurrentView: boolean
  minValue?: DateValue
  maxValue?: DateValue
  isInvalid: boolean
  isDateSelected: (date: DateValue) => boolean
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
  isNextButtonDisabled: (nextPageFunc?: PageFunction) => boolean
  isPrevButtonDisabled: (prevPageFunc?: PageFunction) => boolean
  isOutsideVisibleView: (date: DateValue) => boolean
  nextPage: (nextPageFunc?: PageFunction) => void
  prevPage: (prevPageFunc?: PageFunction) => void
  parentElement: RefObject<HTMLElement | null>
  onPlaceholderChange: (value: DateValue) => void
  onDateChange: (value: DateValue) => void
  isPlaceholderFocusable: boolean
  firstFocusableDate: DateValue | undefined
  hasSelectedDate: boolean
  isSelectedDateDisabled: boolean
  nextTick: (callback: () => void) => void
}

const CalendarRootContext = createContext<CalendarRootContextValue | null>(null)

function useCalendarRootContext(consumer: string) {
  const context = useContext(CalendarRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`CalendarRoot\``)
  return context
}

export interface CalendarSlotProps {
  date: DateValue
  grid: Month<DateValue>[]
  weekDays: string[]
  weekStartsOn: number
  locale: string
  fixedWeeks: boolean
  modelValue: DateValue | DateValue[] | undefined
}

export interface CalendarRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'placeholder' | 'children' | 'dir'> {
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  onPlaceholderChange?: (value: DateValue) => void
  value?: DateValue | DateValue[]
  onValueChange?: (value: DateValue | DateValue[] | undefined) => void
  pagedNavigation?: boolean
  preventDeselect?: boolean
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
  dir?: 'ltr' | 'rtl'
  nextPage?: PageFunction
  prevPage?: PageFunction
  multiple?: boolean
  disableDaysOutsideCurrentView?: boolean
  children?: (props: CalendarSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function CalendarRoot({
  defaultValue,
  defaultPlaceholder,
  placeholder: placeholderProp,
  onPlaceholderChange: onPlaceholderChangeProp,
  value,
  onValueChange,
  pagedNavigation = false,
  preventDeselect = false,
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
  dir: dirProp,
  nextPage: nextPageProp,
  prevPage: prevPageProp,
  multiple = false,
  disableDaysOutsideCurrentView = false,
  as = 'div',
  asChild,
  children,
  ref,
  ...attrs
}: CalendarRootProps) {
  const parentElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parentElement)
  const locale = useLocale(localeProp)
  const dir = useDirection(dirProp)
  const nextTick = useNextTick()
  const weekStartsOn = weekStartsOnProp ?? getWeekStartsOn(locale)

  const modelValue = useVModel<DateValue | DateValue[] | undefined>(
    value,
    onValueChange,
    () => defaultValue,
  )
  const placeholder = useVModel<DateValue>(
    placeholderProp,
    onPlaceholderChangeProp as (value: DateValue) => void,
    () =>
      defaultPlaceholder ??
      getDefaultDate({
        defaultPlaceholder: placeholderProp,
        defaultValue: modelValue.value,
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

  const state = useCalendarState({
    date: modelValue.value,
    isDateDisabled: calendar.isDateDisabled,
    isDateUnavailable: calendar.isDateUnavailable,
  })

  useWatch([modelValue.value] as const, ([next]) => {
    if (Array.isArray(next) && next.length) {
      const lastValue = next.at(-1)
      if (lastValue && !isEqualDay(placeholder.get(), lastValue)) onPlaceholderChange(lastValue)
    } else if (!Array.isArray(next) && next && !isEqualDay(placeholder.get(), next))
      onPlaceholderChange(next)
  })

  function onDateChange(next: DateValue) {
    const current = modelValue.get()
    if (!multiple) {
      if (!current) {
        modelValue.set(next.copy())
        return
      }
      if (!preventDeselect && isEqualDay(current as DateValue, next)) {
        placeholder.set(next.copy())
        modelValue.set(undefined)
      } else modelValue.set(next.copy())
    } else if (!current) modelValue.set([next.copy()])
    else if (Array.isArray(current)) {
      const index = current.findIndex(date => isSameDay(date, next))
      if (index === -1) modelValue.set([...current, next])
      else if (!preventDeselect) {
        const rest = current.filter(date => !isSameDay(date, next))
        if (!rest.length) {
          placeholder.set(next.copy())
          modelValue.set(undefined)
          return
        }
        modelValue.set(rest.map(date => date.copy()))
      }
    }
  }

  useEffect(() => {
    if (initialFocus) handleCalendarInitialFocus(parentElement.current)
  }, [])

  const context: CalendarRootContextValue = {
    locale,
    dir,
    formatter: calendar.formatter,
    modelValue: modelValue.value,
    placeholder: placeholder.value,
    disabled,
    readonly,
    preventDeselect,
    disableDaysOutsideCurrentView,
    minValue,
    maxValue,
    isInvalid: state.isInvalid,
    isDateSelected: state.isDateSelected,
    isDateDisabled: calendar.isDateDisabled,
    isDateUnavailable: calendar.isDateUnavailable,
    isNextButtonDisabled: calendar.isNextButtonDisabled,
    isPrevButtonDisabled: calendar.isPrevButtonDisabled,
    isOutsideVisibleView: calendar.isOutsideVisibleView,
    nextPage: calendar.nextPage,
    prevPage: calendar.prevPage,
    parentElement,
    onPlaceholderChange,
    onDateChange,
    isPlaceholderFocusable: calendar.isPlaceholderFocusable,
    firstFocusableDate: calendar.firstFocusableDate,
    hasSelectedDate: state.hasSelectedDate,
    isSelectedDateDisabled: state.isSelectedDateDisabled,
    nextTick,
  }

  return (
    <CalendarRootContext value={context}>
      <Primitive
        as={as}
        asChild={asChild}
        aria-label={calendar.fullCalendarLabel}
        data-readonly={readonly ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-invalid={state.isInvalid ? '' : undefined}
        dir={dir}
        {...attrs}
        ref={composedRef}
      >
        {children?.({
          date: placeholder.value,
          grid: calendar.grid,
          weekDays: calendar.weekdays,
          weekStartsOn,
          locale,
          fixedWeeks,
          modelValue: modelValue.value,
        })}
        <HiddenHeading label={calendar.fullCalendarLabel} />
      </Primitive>
    </CalendarRootContext>
  )
}

export function CalendarGrid({ as = 'table', ...props }: CalendarPartProps) {
  const context = useCalendarRootContext('CalendarGrid')
  return <GridTable as={as} disabled={context.disabled} readonly={context.readonly} {...props} />
}

export function CalendarGridHead({ as = 'thead', ...props }: CalendarPartProps) {
  return <Primitive as={as} aria-hidden="true" {...props} />
}

export function CalendarGridBody({ as = 'tbody', ...props }: CalendarPartProps) {
  return <Primitive as={as} {...props} />
}

export function CalendarGridRow({ as = 'tr', ...props }: CalendarPartProps) {
  return <Primitive as={as} {...props} />
}

export function CalendarHeadCell({ as = 'th', ...props }: CalendarPartProps) {
  return <Primitive as={as} {...props} />
}

export interface CalendarCellProps extends CalendarPartProps {
  date: DateValue
}

export function CalendarCell({ date, as = 'td', ...props }: CalendarCellProps) {
  const context = useCalendarRootContext('CalendarCell')
  return (
    <Primitive
      as={as}
      role="gridcell"
      aria-selected={context.isDateSelected(date) ? true : undefined}
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

export interface CalendarCellTriggerProps extends CalendarPartProps {
  day: DateValue
  month: DateValue
}

export function CalendarCellTrigger({
  day,
  month,
  as = 'div',
  asChild,
  children,
  ...props
}: CalendarCellTriggerProps) {
  const context = useCalendarRootContext('CalendarCellTrigger')
  const dayValue = day.day.toLocaleString(context.locale)
  const labelText = context.formatter.custom(toDate(day), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const isUnavailable = context.isDateUnavailable(day) ?? false
  const isDateToday = isToday(day, getLocalTimeZone())
  const isOutsideView = !isSameMonth(day, month)
  const isOutsideVisibleView = context.isOutsideVisibleView(day)
  const isDisabled =
    context.isDateDisabled(day) || (context.disableDaysOutsideCurrentView && isOutsideView)
  let isFocusedDate = false
  if (!isOutsideView && !isDisabled) {
    if (!context.disabled && context.isPlaceholderFocusable && isSameDay(day, context.placeholder))
      isFocusedDate = true
    else if (
      (!context.hasSelectedDate || context.isSelectedDateDisabled) &&
      !context.isPlaceholderFocusable
    )
      isFocusedDate = !!context.firstFocusableDate && isSameDay(day, context.firstFocusableDate)
  }
  const isSelectedDate = context.isDateSelected(day)

  function changeDate(date: DateValue) {
    if (context.readonly) return
    if (context.isDateDisabled(date) || context.isDateUnavailable(date)) return
    context.onDateChange(date)
  }

  function handleClick() {
    if (isDisabled) return
    changeDate(day)
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
        changeDate(day)
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

  return (
    <Primitive
      as={as}
      asChild={asChild}
      role="button"
      aria-label={labelText}
      data-radix-calendar-cell-trigger=""
      aria-disabled={isDisabled || isUnavailable ? true : undefined}
      data-selected={isSelectedDate ? true : undefined}
      data-value={day.toString()}
      data-disabled={isDisabled ? '' : undefined}
      data-unavailable={isUnavailable ? '' : undefined}
      data-today={isDateToday ? '' : undefined}
      data-outside-view={isOutsideView ? '' : undefined}
      data-outside-visible-view={isOutsideVisibleView ? '' : undefined}
      data-focused={isFocusedDate ? '' : undefined}
      tabIndex={isFocusedDate ? 0 : isOutsideView || isDisabled ? undefined : -1}
      onClick={handleClick}
      onKeyDown={handleArrowKey}
      {...props}
    >
      {children ?? dayValue}
    </Primitive>
  )
}

export function CalendarNext({
  nextPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useCalendarRootContext('CalendarNext')
  const disabled = context.disabled || context.isNextButtonDisabled(nextPage)
  return (
    <Primitive
      as={as}
      asChild={asChild}
      aria-label="Next page"
      {...({ type: as === 'button' ? 'button' : undefined } as Record<string, unknown>)}
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

export function CalendarPrev({
  prevPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useCalendarRootContext('CalendarPrev')
  const disabled = context.disabled || context.isPrevButtonDisabled(prevPage)
  return (
    <Primitive
      aria-label="Previous page"
      as={as}
      asChild={asChild}
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

export {
  MonthPickerRoot,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerNext,
  MonthPickerPrev,
} from './month-picker'
export type { MonthPickerRootProps, MonthPickerSlotProps } from './month-picker'
export {
  YearPickerRoot,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerNext,
  YearPickerPrev,
} from './year-picker'
export type { YearPickerRootProps, YearPickerSlotProps } from './year-picker'
import { useComposedRefs } from '../utils/compose-refs'
