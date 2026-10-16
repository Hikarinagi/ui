'use client'

import { useRef } from 'react'
import type { DateValue } from '@internationalized/date'
import type { Month } from '../../../../shared/src/primitives/date/calendar'
import {
  buildCalendarGrid,
  calendarHeading,
  calendarHeadingOptions,
  calendarLabel,
  calendarWeekdays,
  firstFocusableCalendarDate,
  hasCalendarSelection,
  isCalendarDateDisabled,
  isCalendarDateSelected,
  isCalendarNextDisabled,
  isCalendarPrevDisabled,
  isCalendarSelectionDisabled,
  isCalendarSelectionInvalid,
  isOutsideCalendarView,
  turnCalendarPage,
  type Matcher,
  type PageFunction,
  type WeekDayFormat,
} from '../../../../shared/src/primitives/date/calendar-view'
import {
  createDateFormatter,
  type Formatter,
} from '../../../../shared/src/primitives/date/formatter'
import { useStore, useWatch, type Model } from '../date-field/date/hooks'

export type { Matcher, PageFunction, WeekDayFormat }

export function useCalendarState(props: {
  date: DateValue | DateValue[] | undefined
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
}) {
  const date = props.date
  return {
    isDateSelected: (dateObj: DateValue) => isCalendarDateSelected(date, dateObj),
    isInvalid: isCalendarSelectionInvalid(date, props.isDateDisabled, props.isDateUnavailable),
    hasSelectedDate: hasCalendarSelection(date),
    isSelectedDateDisabled: isCalendarSelectionDisabled(date, props.isDateDisabled),
  }
}

export interface UseCalendarProps {
  locale: string
  placeholder: Model<DateValue>
  weekStartsOn: number
  fixedWeeks: boolean
  numberOfMonths: number
  minValue?: DateValue
  maxValue?: DateValue
  disabled: boolean
  weekdayFormat: WeekDayFormat
  pagedNavigation: boolean
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  calendarLabel?: string
  nextPage?: PageFunction
  prevPage?: PageFunction
}

export function useCalendar(props: UseCalendarProps) {
  const formatterRef = useRef<Formatter | null>(null)
  if (!formatterRef.current) formatterRef.current = createDateFormatter(props.locale)
  const formatter = formatterRef.current
  const latest = useRef(props)
  latest.current = props

  const placeholder = props.placeholder.value
  const gridOptions = () => ({
    weekStartsOn: latest.current.weekStartsOn,
    locale: latest.current.locale,
    fixedWeeks: latest.current.fixedWeeks,
    numberOfMonths: latest.current.numberOfMonths,
  })
  const bounds = () => ({
    minValue: latest.current.minValue,
    maxValue: latest.current.maxValue,
    disabled: latest.current.disabled,
  })

  const grid = useStore<Month<DateValue>[]>(() => buildCalendarGrid(placeholder, gridOptions()))
  const visibleView = grid.value.map(month => month.value)

  const isOutsideVisibleView = (date: DateValue) => isOutsideCalendarView(grid.get(), date)
  const isNextButtonDisabled = (nextPageFunc?: PageFunction) =>
    isCalendarNextDisabled(grid.get(), bounds(), latest.current.nextPage, nextPageFunc)
  const isPrevButtonDisabled = (prevPageFunc?: PageFunction) =>
    isCalendarPrevDisabled(grid.get(), bounds(), latest.current.prevPage, prevPageFunc)
  const isDateDisabled = (dateObj: DateValue) =>
    isCalendarDateDisabled(dateObj, bounds(), latest.current.isDateDisabled)
  const isDateUnavailable = (date: DateValue) => !!latest.current.isDateUnavailable?.(date)

  const weekdays = calendarWeekdays(grid.value, formatter, props.weekdayFormat)

  function turn(direction: 1 | -1, pageFunc?: PageFunction) {
    const current = latest.current
    const next = turnCalendarPage(
      direction,
      grid.get(),
      {
        ...gridOptions(),
        pagedNavigation: current.pagedNavigation,
        page: direction > 0 ? current.nextPage : current.prevPage,
      },
      pageFunc,
    )
    grid.set(next.grid)
    current.placeholder.set(next.placeholder)
  }

  const nextPage = (nextPageFunc?: PageFunction) => turn(1, nextPageFunc)
  const prevPage = (prevPageFunc?: PageFunction) => turn(-1, prevPageFunc)

  useWatch([placeholder] as const, ([value]) => {
    if (!isOutsideCalendarView(grid.get(), value)) return
    grid.set(buildCalendarGrid(value, gridOptions()))
  })

  useWatch(
    [props.locale, props.weekStartsOn, props.fixedWeeks, props.numberOfMonths] as const,
    () => {
      grid.set(buildCalendarGrid(latest.current.placeholder.get(), gridOptions()))
    },
  )

  const headingValue = calendarHeading(
    grid.value,
    formatter,
    props.locale,
    calendarHeadingOptions(placeholder),
  )
  const fullCalendarLabel = calendarLabel(props.calendarLabel, headingValue)

  const isPlaceholderFocusable = !(
    isDateDisabled(placeholder) ||
    isDateUnavailable(placeholder) ||
    isOutsideCalendarView(grid.value, placeholder)
  )

  const firstFocusableDate = firstFocusableCalendarDate(
    grid.value,
    props.minValue,
    date => isDateDisabled(date) || isDateUnavailable(date),
  )

  return {
    isDateDisabled,
    isDateUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    grid: grid.value,
    weekdays,
    visibleView,
    isOutsideVisibleView,
    formatter,
    nextPage,
    prevPage,
    headingValue,
    fullCalendarLabel,
    isPlaceholderFocusable,
    firstFocusableDate,
  }
}
