'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import {
  endOfMonth,
  getLocalTimeZone,
  toCalendar,
  today,
  type DateValue,
} from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { createMonthGrid, type Grid } from '../date-field/date/calendar'
import {
  getDefaultDate,
  isAfter,
  isBefore,
  isSameYearMonth,
  toDate,
} from '../date-field/date/comparators'
import { createDateFormatter, type Formatter } from '../date-field/date/formatter'
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
  type CalendarPartProps,
  type CalendarPagingProps,
} from './shared'
import type { Matcher, PageFunction } from './use-calendar'
import { useComposedRefs } from '../utils/compose-refs'

interface MonthPickerContextValue {
  locale: string
  dir: 'ltr' | 'rtl'
  formatter: Formatter
  placeholder: DateValue
  disabled: boolean
  readonly: boolean
  headingId: string
  minValue?: DateValue
  maxValue?: DateValue
  isMonthSelected: (date: DateValue) => boolean
  isMonthDisabled: Matcher
  isMonthUnavailable: Matcher
  isNextButtonDisabled: (nextPageFunc?: PageFunction) => boolean
  isPrevButtonDisabled: (prevPageFunc?: PageFunction) => boolean
  nextPage: (nextPageFunc?: PageFunction) => void
  prevPage: (prevPageFunc?: PageFunction) => void
  parentElement: RefObject<HTMLElement | null>
  onPlaceholderChange: (value: DateValue) => void
  onMonthChange: (value: DateValue) => void
  nextTick: (callback: () => void) => void
}

const MonthPickerContext = createContext<MonthPickerContextValue | null>(null)

function useMonthPickerContext(consumer: string) {
  const context = useContext(MonthPickerContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`MonthPickerRoot\``)
  return context
}

export interface MonthPickerSlotProps {
  date: DateValue
  grid: Grid<DateValue>
  locale: string
  modelValue: DateValue | DateValue[] | undefined
}

export interface MonthPickerRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'placeholder' | 'children' | 'dir'> {
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  onPlaceholderChange?: (value: DateValue) => void
  value?: DateValue | DateValue[]
  onValueChange?: (value: DateValue | DateValue[] | undefined) => void
  preventDeselect?: boolean
  calendarLabel?: string
  maxValue?: DateValue
  minValue?: DateValue
  locale?: string
  disabled?: boolean
  readonly?: boolean
  initialFocus?: boolean
  isMonthDisabled?: Matcher
  isMonthUnavailable?: Matcher
  dir?: 'ltr' | 'rtl'
  nextPage?: PageFunction
  prevPage?: PageFunction
  multiple?: boolean
  children?: (props: MonthPickerSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MonthPickerRoot({
  defaultValue,
  defaultPlaceholder,
  placeholder: placeholderProp,
  onPlaceholderChange: onPlaceholderChangeProp,
  value,
  onValueChange,
  preventDeselect = false,
  calendarLabel,
  maxValue,
  minValue,
  locale: localeProp,
  disabled = false,
  readonly = false,
  initialFocus = false,
  isMonthDisabled: isMonthDisabledProp,
  isMonthUnavailable: isMonthUnavailableProp,
  dir: dirProp,
  nextPage: nextPageProp,
  prevPage: prevPageProp,
  multiple = false,
  as = 'div',
  asChild,
  children,
  ref,
  ...attrs
}: MonthPickerRootProps) {
  const parentElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parentElement)
  const locale = useLocale(localeProp)
  const dir = useDirection(dirProp)
  const headingId = `reka-month-picker-heading-${useId()}`
  const nextTick = useNextTick()

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
  const latest = useRef({ maxValue, minValue, disabled, nextPageProp, prevPageProp })
  latest.current = { maxValue, minValue, disabled, nextPageProp, prevPageProp }

  function onPlaceholderChange(next: DateValue) {
    placeholder.set(next.copy())
  }

  const formatterRef = useRef<Formatter | null>(null)
  if (!formatterRef.current) formatterRef.current = createDateFormatter(locale)
  const formatter = formatterRef.current
  const headingFormatOptions: Intl.DateTimeFormatOptions = {
    calendar: placeholder.value.calendar.identifier,
  }
  if (placeholder.value.calendar.identifier === 'gregory' && placeholder.value.era === 'BC')
    headingFormatOptions.era = 'short'
  const grid = useStore<Grid<DateValue>>(() => createMonthGrid({ dateObj: placeholder.value }))

  function isMonthDisabled(dateObj: DateValue) {
    const current = latest.current
    if (isMonthDisabledProp?.(dateObj) || current.disabled) return true
    if (current.maxValue && isAfter(dateObj.set({ day: 1 }), current.maxValue)) return true
    if (current.minValue && isBefore(endOfMonth(dateObj), current.minValue)) return true
    return false
  }

  function isMonthUnavailable(date: DateValue) {
    return !!isMonthUnavailableProp?.(date)
  }

  function isNextButtonDisabled(nextPageFunc?: PageFunction) {
    const current = latest.current
    if (!current.maxValue) return false
    if (current.disabled) return true
    const currentDate = grid.get().value
    const page = nextPageFunc || current.nextPageProp
    if (page) return isAfter(page(currentDate).set({ month: 1, day: 1 }), current.maxValue)
    return isAfter(currentDate.add({ years: 1 }).set({ month: 1, day: 1 }), current.maxValue)
  }

  function isPrevButtonDisabled(prevPageFunc?: PageFunction) {
    const current = latest.current
    if (!current.minValue) return false
    if (current.disabled) return true
    const currentDate = grid.get().value
    const page = prevPageFunc || current.prevPageProp
    if (page) return isBefore(endOfMonth(page(currentDate).set({ month: 12 })), current.minValue)
    return isBefore(
      currentDate.subtract({ years: 1 }).set({ month: 12, day: 31 }),
      current.minValue,
    )
  }

  function nextPage(nextPageFunc?: PageFunction) {
    const currentDate = grid.get().value
    const page = nextPageFunc || latest.current.nextPageProp
    const newDate = page ? page(currentDate) : currentDate.add({ years: 1 })
    grid.set(createMonthGrid({ dateObj: newDate }))
    const current = placeholder.get()
    placeholder.set(newDate.set({ month: current.month, day: current.day }))
  }

  function prevPage(prevPageFunc?: PageFunction) {
    const currentDate = grid.get().value
    const page = prevPageFunc || latest.current.prevPageProp
    const newDate = page ? page(currentDate) : currentDate.subtract({ years: 1 })
    grid.set(createMonthGrid({ dateObj: newDate }))
    const current = placeholder.get()
    placeholder.set(newDate.set({ month: current.month, day: current.day }))
  }

  useWatch([placeholder.value] as const, ([next]) => {
    if (next.year === grid.get().value.year) return
    grid.set(createMonthGrid({ dateObj: next }))
  })

  useWatch([locale] as const, ([next]) => {
    formatter.setLocale(next)
    grid.set(createMonthGrid({ dateObj: placeholder.get() }))
  })

  if (locale !== formatter.getLocale()) formatter.setLocale(locale)
  const headingValue = formatter.fullYear(toDate(grid.value.value), headingFormatOptions)
  const fullCalendarLabel = `${calendarLabel ?? 'Month Picker'}, ${headingValue}`

  const date = modelValue.value
  function isMonthSelected(dateObj: DateValue) {
    if (Array.isArray(date)) return date.some(d => isSameYearMonth(d, dateObj))
    if (!date) return false
    return isSameYearMonth(date, dateObj)
  }
  let isInvalid = false
  if (Array.isArray(date)) {
    for (const dateObj of date)
      if (isMonthDisabled(dateObj) || isMonthUnavailable(dateObj)) isInvalid = true
  } else if (date) isInvalid = isMonthDisabled(date) || isMonthUnavailable(date)

  useWatch([date] as const, ([next]) => {
    if (Array.isArray(next) && next.length) {
      const lastValue = next.at(-1)
      if (lastValue && !isSameYearMonth(placeholder.get(), lastValue))
        onPlaceholderChange(lastValue)
    } else if (!Array.isArray(next) && next && !isSameYearMonth(placeholder.get(), next))
      onPlaceholderChange(next)
  })

  function resolveMonthValue(next: DateValue, reference?: DateValue) {
    if (!reference) return next.copy()
    return next.copy().set({ day: reference.day })
  }

  function onMonthChange(next: DateValue) {
    const current = modelValue.get()
    if (!multiple) {
      if (!current) {
        modelValue.set(resolveMonthValue(next, placeholder.get()))
        return
      }
      if (!preventDeselect && isSameYearMonth(current as DateValue, next)) {
        placeholder.set(resolveMonthValue(next, current as DateValue))
        modelValue.set(undefined)
      } else modelValue.set(resolveMonthValue(next, current as DateValue))
    } else if (!current) modelValue.set([resolveMonthValue(next, placeholder.get())])
    else {
      const list = Array.isArray(current) ? current : [current]
      const index = list.findIndex(item => isSameYearMonth(item, next))
      if (index === -1) modelValue.set([...list, resolveMonthValue(next, placeholder.get())])
      else if (!preventDeselect) {
        const rest = list.filter(item => !isSameYearMonth(item, next))
        if (!rest.length) {
          placeholder.set(resolveMonthValue(next, list[index]))
          modelValue.set(undefined)
          return
        }
        modelValue.set(rest.map(item => item.copy()))
      }
    }
  }

  useEffect(() => {
    if (initialFocus) handleCalendarInitialFocus(parentElement.current)
  }, [])

  const context: MonthPickerContextValue = {
    locale,
    dir,
    formatter,
    placeholder: placeholder.value,
    disabled,
    readonly,
    headingId,
    minValue,
    maxValue,
    isMonthSelected,
    isMonthDisabled,
    isMonthUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    nextPage,
    prevPage,
    parentElement,
    onPlaceholderChange,
    onMonthChange,
    nextTick,
  }

  return (
    <MonthPickerContext value={context}>
      <Primitive
        as={as}
        asChild={asChild}
        aria-label={fullCalendarLabel}
        data-readonly={readonly ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-invalid={isInvalid ? '' : undefined}
        dir={dir}
        {...attrs}
        ref={composedRef}
      >
        {children?.({ date: placeholder.value, grid: grid.value, locale, modelValue: date })}
        <HiddenHeading label={fullCalendarLabel} />
      </Primitive>
    </MonthPickerContext>
  )
}

export function MonthPickerGrid({ as = 'table', ...props }: CalendarPartProps) {
  const context = useMonthPickerContext('MonthPickerGrid')
  return (
    <GridTable
      as={as}
      aria-labelledby={context.headingId}
      disabled={context.disabled}
      readonly={context.readonly}
      {...props}
    />
  )
}

export function MonthPickerGridBody({ as = 'tbody', ...props }: CalendarPartProps) {
  return <Primitive as={as} {...props} />
}

export function MonthPickerGridRow({ as = 'tr', ...props }: CalendarPartProps) {
  return <Primitive as={as} role="row" {...props} />
}

export interface MonthPickerCellProps extends CalendarPartProps {
  date: DateValue
}

export function MonthPickerCell({ date, as = 'td', ...props }: MonthPickerCellProps) {
  const context = useMonthPickerContext('MonthPickerCell')
  return (
    <Primitive
      as={as}
      role="gridcell"
      aria-selected={context.isMonthSelected(date) ? true : undefined}
      aria-disabled={context.isMonthDisabled(date) || context.isMonthUnavailable(date)}
      data-disabled={context.isMonthDisabled(date) ? '' : undefined}
      {...props}
    />
  )
}

export interface MonthPickerCellTriggerProps extends CalendarPartProps {
  month: DateValue
}

export function MonthPickerCellTrigger({
  month,
  as = 'div',
  asChild,
  children,
  ...props
}: MonthPickerCellTriggerProps) {
  const context = useMonthPickerContext('MonthPickerCellTrigger')
  const shortMonthValue = context.formatter.custom(toDate(month), { month: 'short' })
  const labelText = context.formatter.custom(toDate(month), { month: 'long', year: 'numeric' })
  const isUnavailable = context.isMonthUnavailable(month) ?? false
  const isCurrentMonth = isSameYearMonth(
    month,
    toCalendar(today(getLocalTimeZone()), month.calendar),
  )
  const isDisabled = context.isMonthDisabled(month)
  const isFocusedMonth = !context.disabled && isSameYearMonth(month, context.placeholder)
  const isSelectedMonth = context.isMonthSelected(month)

  function changeMonth(date: DateValue) {
    if (context.readonly) return
    if (context.isMonthDisabled(date) || context.isMonthUnavailable(date)) return
    context.onMonthChange(date)
  }

  function handleArrowKey(event: KeyboardEvent<HTMLElement>) {
    if (!matchesGridKey(event, ['PageUp', 'PageDown'])) return
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
        shiftFocus(month, sign)
        break
      case kbd.ARROW_LEFT:
        shiftFocus(month, -sign)
        break
      case kbd.ARROW_UP:
        shiftFocus(month, -4)
        break
      case kbd.ARROW_DOWN:
        shiftFocus(month, 4)
        break
      case kbd.PAGE_UP:
        shiftFocusYear(-1)
        break
      case kbd.PAGE_DOWN:
        shiftFocusYear(1)
        break
      case kbd.ENTER:
      case kbd.SPACE_CODE:
        changeMonth(month)
    }

    function outOfBounds(candidate: DateValue) {
      return (
        (context.minValue && endOfMonth(candidate).compare(context.minValue) < 0) ||
        (context.maxValue && candidate.set({ day: 1 }).compare(context.maxValue) > 0)
      )
    }

    function shiftFocus(currentMonth: DateValue, add: number, depth = 0) {
      if (depth > 48) return
      const candidateMonthValue = currentMonth.add({ months: add })
      if (outOfBounds(candidateMonthValue)) return
      const candidateMonth = parentElement.querySelector<HTMLElement>(
        `[data-value='${candidateMonthValue.toString()}']`,
      )
      if (!candidateMonth) {
        if (add > 0) {
          if (context.isNextButtonDisabled()) return
          context.nextPage()
        } else {
          if (context.isPrevButtonDisabled()) return
          context.prevPage()
        }
        context.nextTick(() => shiftFocus(currentMonth, add, depth + 1))
        return
      }
      if (candidateMonth.hasAttribute('data-disabled'))
        return shiftFocus(candidateMonthValue, add, depth + 1)
      context.onPlaceholderChange(candidateMonthValue)
      candidateMonth.focus()
    }

    function shiftFocusYear(years: number) {
      const candidateMonthValue = month.add({ years })
      if (outOfBounds(candidateMonthValue)) return
      if (years > 0) {
        if (context.isNextButtonDisabled()) return
        context.nextPage()
      } else {
        if (context.isPrevButtonDisabled()) return
        context.prevPage()
      }
      context.nextTick(() => {
        const candidateMonth = parentElement.querySelector<HTMLElement>(
          `[data-value='${candidateMonthValue.toString()}']`,
        )
        if (candidateMonth && !candidateMonth.hasAttribute('data-disabled')) {
          context.onPlaceholderChange(candidateMonthValue)
          candidateMonth.focus()
        }
      })
    }
  }

  return (
    <Primitive
      as={as}
      asChild={asChild}
      role="button"
      aria-label={labelText}
      data-radix-month-picker-cell-trigger=""
      aria-disabled={isDisabled || isUnavailable ? true : undefined}
      data-selected={isSelectedMonth ? true : undefined}
      data-value={month.toString()}
      data-disabled={isDisabled ? '' : undefined}
      data-unavailable={isUnavailable ? '' : undefined}
      data-today={isCurrentMonth ? '' : undefined}
      data-focused={isFocusedMonth ? '' : undefined}
      tabIndex={isFocusedMonth ? 0 : isDisabled ? undefined : -1}
      onClick={() => {
        if (isDisabled) return
        changeMonth(month)
      }}
      onKeyDown={handleArrowKey}
      {...props}
    >
      {children ?? shortMonthValue}
    </Primitive>
  )
}

export function MonthPickerNext({
  nextPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useMonthPickerContext('MonthPickerNext')
  const disabled = context.disabled || context.isNextButtonDisabled(nextPage)
  return (
    <Primitive
      as={as}
      asChild={asChild}
      aria-label="Next year"
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
      {children ?? 'Next year'}
    </Primitive>
  )
}

export function MonthPickerPrev({
  prevPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useMonthPickerContext('MonthPickerPrev')
  const disabled = context.disabled || context.isPrevButtonDisabled(prevPage)
  return (
    <Primitive
      aria-label="Previous year"
      as={as}
      asChild={asChild}
      {...({ type: as === 'button' ? 'button' : undefined } as Record<string, unknown>)}
      aria-disabled={disabled || undefined}
      data-disabled={(disabled || undefined) as never}
      {...({ disabled } as Record<string, unknown>)}
      onClick={() => {
        if (disabled) return
        context.prevPage(prevPage)
      }}
      {...props}
    >
      {children ?? 'Prev year'}
    </Primitive>
  )
}
