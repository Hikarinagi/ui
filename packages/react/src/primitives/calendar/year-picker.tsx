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
  endOfYear,
  startOfYear,
  getLocalTimeZone,
  toCalendar,
  today,
  type DateValue,
} from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { createYearGrid, type Grid } from '../date-field/date/calendar'
import {
  getDefaultDate,
  isAfter,
  isBefore,
  isSameYear,
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

interface YearPickerContextValue {
  locale: string
  dir: 'ltr' | 'rtl'
  formatter: Formatter
  placeholder: DateValue
  disabled: boolean
  readonly: boolean
  headingId: string
  minValue?: DateValue
  maxValue?: DateValue
  isYearSelected: (date: DateValue) => boolean
  isYearDisabled: Matcher
  isYearUnavailable: Matcher
  isNextButtonDisabled: (nextPageFunc?: PageFunction) => boolean
  isPrevButtonDisabled: (prevPageFunc?: PageFunction) => boolean
  nextPage: (nextPageFunc?: PageFunction) => void
  prevPage: (prevPageFunc?: PageFunction) => void
  parentElement: RefObject<HTMLElement | null>
  onPlaceholderChange: (value: DateValue) => void
  onYearChange: (value: DateValue) => void
  nextTick: (callback: () => void) => void
  yearsPerPage: number
}

const YearPickerContext = createContext<YearPickerContextValue | null>(null)

function useYearPickerContext(consumer: string) {
  const context = useContext(YearPickerContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`YearPickerRoot\``)
  return context
}

export interface YearPickerSlotProps {
  date: DateValue
  grid: Grid<DateValue>
  locale: string
  modelValue: DateValue | DateValue[] | undefined
}

export interface YearPickerRootProps
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
  isYearDisabled?: Matcher
  isYearUnavailable?: Matcher
  dir?: 'ltr' | 'rtl'
  nextPage?: PageFunction
  prevPage?: PageFunction
  multiple?: boolean
  yearsPerPage?: number
  children?: (props: YearPickerSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function YearPickerRoot({
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
  isYearDisabled: isYearDisabledProp,
  isYearUnavailable: isYearUnavailableProp,
  dir: dirProp,
  nextPage: nextPageProp,
  prevPage: prevPageProp,
  multiple = false,
  yearsPerPage = 12,
  as = 'div',
  asChild,
  children,
  ref,
  ...attrs
}: YearPickerRootProps) {
  const parentElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parentElement)
  const locale = useLocale(localeProp)
  const dir = useDirection(dirProp)
  const headingId = `reka-year-picker-heading-${useId()}`
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
  const latest = useRef({ maxValue, minValue, disabled, nextPageProp, prevPageProp, yearsPerPage })
  latest.current = { maxValue, minValue, disabled, nextPageProp, prevPageProp, yearsPerPage }

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
  const grid = useStore<Grid<DateValue>>(() =>
    createYearGrid({ dateObj: placeholder.value, yearsPerPage }),
  )

  function isYearDisabled(dateObj: DateValue) {
    const current = latest.current
    if (isYearDisabledProp?.(dateObj) || current.disabled) return true
    if (current.maxValue && isAfter(startOfYear(dateObj), current.maxValue)) return true
    if (current.minValue && isBefore(endOfYear(dateObj), current.minValue)) return true
    return false
  }

  function isYearUnavailable(date: DateValue) {
    return !!isYearUnavailableProp?.(date)
  }

  function isNextButtonDisabled(nextPageFunc?: PageFunction) {
    const current = latest.current
    if (!current.maxValue) return false
    if (current.disabled) return true
    const lastYearInView = grid.get().cells.at(-1)!
    const page = nextPageFunc || current.nextPageProp
    if (page) return isAfter(startOfYear(page(lastYearInView)), current.maxValue)
    return isAfter(startOfYear(lastYearInView.add({ years: 1 })), current.maxValue)
  }

  function isPrevButtonDisabled(prevPageFunc?: PageFunction) {
    const current = latest.current
    if (!current.minValue) return false
    if (current.disabled) return true
    const firstYearInView = grid.get().value
    const page = prevPageFunc || current.prevPageProp
    if (page) return isBefore(endOfYear(page(firstYearInView)), current.minValue)
    return isBefore(endOfYear(firstYearInView.subtract({ years: 1 })), current.minValue)
  }

  function nextPage(nextPageFunc?: PageFunction) {
    const firstYearInGrid = grid.get().value
    const page = nextPageFunc || latest.current.nextPageProp
    const newDate = page
      ? page(firstYearInGrid)
      : firstYearInGrid.add({ years: latest.current.yearsPerPage })
    grid.set(
      createYearGrid({
        dateObj: newDate,
        yearsPerPage: latest.current.yearsPerPage,
        decadeAligned: false,
      }),
    )
    const current = placeholder.get()
    placeholder.set(newDate.set({ month: current.month, day: current.day }))
  }

  function prevPage(prevPageFunc?: PageFunction) {
    const firstYearInGrid = grid.get().value
    const page = prevPageFunc || latest.current.prevPageProp
    const newDate = page
      ? page(firstYearInGrid)
      : firstYearInGrid.subtract({ years: latest.current.yearsPerPage })
    grid.set(
      createYearGrid({
        dateObj: newDate,
        yearsPerPage: latest.current.yearsPerPage,
        decadeAligned: false,
      }),
    )
    const current = placeholder.get()
    placeholder.set(newDate.set({ month: current.month, day: current.day }))
  }

  useWatch([placeholder.value] as const, ([next]) => {
    const firstYearInGrid = grid.get().value
    const lastYearInGrid = grid.get().cells.at(-1)!
    if (next.year >= firstYearInGrid.year && next.year <= lastYearInGrid.year) return
    grid.set(createYearGrid({ dateObj: next, yearsPerPage: latest.current.yearsPerPage }))
  })

  useWatch([locale, yearsPerPage] as const, ([next]) => {
    formatter.setLocale(next)
    grid.set(
      createYearGrid({ dateObj: placeholder.get(), yearsPerPage: latest.current.yearsPerPage }),
    )
  })

  if (locale !== formatter.getLocale()) formatter.setLocale(locale)
  const headingValue = `${formatter.fullYear(toDate(grid.value.cells[0]!), headingFormatOptions)} - ${formatter.fullYear(toDate(grid.value.cells.at(-1)!), headingFormatOptions)}`
  const fullCalendarLabel = `${calendarLabel ?? 'Year Picker'}, ${headingValue}`

  const date = modelValue.value
  function isYearSelected(dateObj: DateValue) {
    if (Array.isArray(date)) return date.some(d => isSameYear(d, dateObj))
    if (!date) return false
    return isSameYear(date, dateObj)
  }
  let isInvalid = false
  if (Array.isArray(date)) {
    for (const dateObj of date)
      if (isYearDisabled(dateObj) || isYearUnavailable(dateObj)) isInvalid = true
  } else if (date) isInvalid = isYearDisabled(date) || isYearUnavailable(date)

  useWatch([date] as const, ([next]) => {
    if (Array.isArray(next) && next.length) {
      const lastValue = next.at(-1)
      if (lastValue && !isSameYear(placeholder.get(), lastValue)) onPlaceholderChange(lastValue)
    } else if (!Array.isArray(next) && next && !isSameYear(placeholder.get(), next))
      onPlaceholderChange(next)
  })

  function resolveYearValue(next: DateValue, reference?: DateValue) {
    if (!reference) return next.copy()
    return next.copy().set({ month: reference.month, day: reference.day })
  }

  function onYearChange(next: DateValue) {
    const current = modelValue.get()
    if (!multiple) {
      if (!current) {
        modelValue.set(resolveYearValue(next, placeholder.get()))
        return
      }
      if (!preventDeselect && isSameYear(current as DateValue, next)) {
        placeholder.set(resolveYearValue(next, current as DateValue))
        modelValue.set(undefined)
      } else modelValue.set(resolveYearValue(next, current as DateValue))
    } else if (!current) modelValue.set([resolveYearValue(next, placeholder.get())])
    else if (Array.isArray(current)) {
      const list = current
      const index = list.findIndex(item => isSameYear(item, next))
      if (index === -1) modelValue.set([...list, resolveYearValue(next, placeholder.get())])
      else if (!preventDeselect) {
        const rest = list.filter(item => !isSameYear(item, next))
        if (!rest.length) {
          placeholder.set(resolveYearValue(next, list[index]))
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

  const context: YearPickerContextValue = {
    locale,
    dir,
    formatter,
    placeholder: placeholder.value,
    disabled,
    readonly,
    headingId,
    minValue,
    maxValue,
    isYearSelected,
    isYearDisabled,
    isYearUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    nextPage,
    prevPage,
    parentElement,
    onPlaceholderChange,
    onYearChange,
    nextTick,
    yearsPerPage,
  }

  return (
    <YearPickerContext value={context}>
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
    </YearPickerContext>
  )
}

export function YearPickerGrid({ as = 'table', ...props }: CalendarPartProps) {
  const context = useYearPickerContext('YearPickerGrid')
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

export function YearPickerGridBody({ as = 'tbody', ...props }: CalendarPartProps) {
  return <Primitive as={as} {...props} />
}

export function YearPickerGridRow({ as = 'tr', ...props }: CalendarPartProps) {
  return <Primitive as={as} role="row" {...props} />
}

export interface YearPickerCellProps extends CalendarPartProps {
  date: DateValue
}

export function YearPickerCell({ date, as = 'td', ...props }: YearPickerCellProps) {
  const context = useYearPickerContext('YearPickerCell')
  return (
    <Primitive
      as={as}
      role="gridcell"
      aria-selected={context.isYearSelected(date) ? true : undefined}
      aria-disabled={context.isYearDisabled(date) || context.isYearUnavailable(date)}
      data-disabled={context.isYearDisabled(date) ? '' : undefined}
      {...props}
    />
  )
}

export interface YearPickerCellTriggerProps extends CalendarPartProps {
  year: DateValue
}

export function YearPickerCellTrigger({
  year,
  as = 'div',
  asChild,
  children,
  ...props
}: YearPickerCellTriggerProps) {
  const context = useYearPickerContext('YearPickerCellTrigger')
  const yearValue = context.formatter.fullYear(toDate(year))
  const labelText = context.formatter.custom(toDate(year), { year: 'numeric' })
  const isUnavailable = context.isYearUnavailable(year) ?? false
  const isCurrentYear = isSameYear(year, toCalendar(today(getLocalTimeZone()), year.calendar))
  const isDisabled = context.isYearDisabled(year)
  const isFocusedYear = !context.disabled && isSameYear(year, context.placeholder)
  const isSelectedYear = context.isYearSelected(year)

  function changeYear(date: DateValue) {
    if (context.readonly) return
    if (context.isYearDisabled(date) || context.isYearUnavailable(date)) return
    context.onYearChange(date)
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
        shiftFocus(year, sign)
        break
      case kbd.ARROW_LEFT:
        shiftFocus(year, -sign)
        break
      case kbd.ARROW_UP:
        shiftFocus(year, -4)
        break
      case kbd.ARROW_DOWN:
        shiftFocus(year, 4)
        break
      case kbd.PAGE_UP:
        shiftFocusPage(-1)
        break
      case kbd.PAGE_DOWN:
        shiftFocusPage(1)
        break
      case kbd.ENTER:
      case kbd.SPACE_CODE:
        changeYear(year)
    }

    function outOfBounds(candidate: DateValue) {
      return (
        (context.minValue && endOfYear(candidate).compare(context.minValue) < 0) ||
        (context.maxValue && startOfYear(candidate).compare(context.maxValue) > 0)
      )
    }

    function shiftFocus(currentYear: DateValue, add: number, depth = 0) {
      if (depth > 48) return
      const candidateYearValue = currentYear.add({ years: add })
      if (outOfBounds(candidateYearValue)) return
      const candidateYear = parentElement.querySelector<HTMLElement>(
        `[data-value='${candidateYearValue.toString()}']`,
      )
      if (!candidateYear) {
        if (add > 0) {
          if (context.isNextButtonDisabled()) return
          context.nextPage()
        } else {
          if (context.isPrevButtonDisabled()) return
          context.prevPage()
        }
        context.nextTick(() => shiftFocus(currentYear, add, depth + 1))
        return
      }
      if (candidateYear.hasAttribute('data-disabled'))
        return shiftFocus(candidateYearValue, add, depth + 1)
      context.onPlaceholderChange(candidateYearValue)
      candidateYear.focus()
    }

    function shiftFocusPage(direction: number) {
      const candidateYearValue = year.add({ years: direction * context.yearsPerPage })
      if (outOfBounds(candidateYearValue)) return
      if (direction > 0) {
        if (context.isNextButtonDisabled()) return
        context.nextPage()
      } else {
        if (context.isPrevButtonDisabled()) return
        context.prevPage()
      }
      context.nextTick(() => {
        const candidateYear = parentElement.querySelector<HTMLElement>(
          `[data-value='${candidateYearValue.toString()}']`,
        )
        if (candidateYear && !candidateYear.hasAttribute('data-disabled')) {
          context.onPlaceholderChange(candidateYearValue)
          candidateYear.focus()
          return
        }
        if (!candidateYear || candidateYear.hasAttribute('data-disabled'))
          shiftFocus(candidateYearValue, direction > 0 ? 1 : -1, 1)
      })
    }
  }

  return (
    <Primitive
      as={as}
      asChild={asChild}
      role="button"
      aria-label={labelText}
      data-radix-year-picker-cell-trigger=""
      aria-disabled={isDisabled || isUnavailable ? true : undefined}
      data-selected={isSelectedYear ? '' : undefined}
      data-value={year.toString()}
      data-disabled={isDisabled ? '' : undefined}
      data-unavailable={isUnavailable ? '' : undefined}
      data-today={isCurrentYear ? '' : undefined}
      data-focused={isFocusedYear ? '' : undefined}
      tabIndex={isFocusedYear ? 0 : isDisabled ? undefined : -1}
      onClick={() => {
        if (isDisabled) return
        changeYear(year)
      }}
      onKeyDown={handleArrowKey}
      {...props}
    >
      {children ?? yearValue}
    </Primitive>
  )
}

export function YearPickerNext({
  nextPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useYearPickerContext('YearPickerNext')
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

export function YearPickerPrev({
  prevPage,
  as = 'button',
  asChild,
  children,
  ...props
}: CalendarPagingProps) {
  const context = useYearPickerContext('YearPickerPrev')
  const disabled = context.disabled || context.isPrevButtonDisabled(prevPage)
  return (
    <Primitive
      aria-label="Previous page"
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
      {children ?? 'Prev page'}
    </Primitive>
  )
}
