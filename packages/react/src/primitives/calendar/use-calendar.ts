'use client'

import { useRef } from 'react'
import { isEqualMonth, isSameDay, isSameMonth, type DateValue } from '@internationalized/date'
import { createMonths, type Month } from '../date-field/date/calendar'
import { getDaysInMonth, isAfter, isBefore, toDate } from '../date-field/date/comparators'
import { createDateFormatter, type Formatter } from '../date-field/date/formatter'
import { useStore, useWatch, type Model } from '../date-field/date/hooks'

export type Matcher = (date: DateValue) => boolean
export type PageFunction = (date: DateValue) => DateValue
export type WeekDayFormat = 'narrow' | 'short' | 'long'

export function useCalendarState(props: {
  date: DateValue | DateValue[] | undefined
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
}) {
  const date = props.date
  function isDateSelected(dateObj: DateValue) {
    if (Array.isArray(date)) return date.some(d => isSameDay(d, dateObj))
    if (!date) return false
    return isSameDay(date, dateObj)
  }
  let isInvalid = false
  if (Array.isArray(date)) {
    for (const dateObj of date)
      if (props.isDateDisabled(dateObj) || props.isDateUnavailable(dateObj)) isInvalid = true
  } else if (date) isInvalid = props.isDateDisabled(date) || props.isDateUnavailable(date)
  const hasSelectedDate = Array.isArray(date) ? date.length > 0 : !!date
  const isSelectedDateDisabled = Array.isArray(date)
    ? date.some(dateObj => props.isDateDisabled(dateObj))
    : !!date && !!props.isDateDisabled(date)
  return { isDateSelected, isInvalid, hasSelectedDate, isSelectedDateDisabled }
}

function handleNextDisabled(lastPeriodInView: DateValue, nextPageFunc: PageFunction) {
  const firstPeriodOfNextPage = nextPageFunc(lastPeriodInView)
  const diff = firstPeriodOfNextPage.compare(lastPeriodInView)
  const duration: { day?: number; month?: number } = {}
  if (diff >= 7) duration.day = 1
  if (diff >= getDaysInMonth(lastPeriodInView)) duration.month = 1
  return firstPeriodOfNextPage.set({ ...duration })
}

function handlePrevDisabled(firstPeriodInView: DateValue, prevPageFunc: PageFunction) {
  const lastPeriodOfPrevPage = prevPageFunc(firstPeriodInView)
  const diff = firstPeriodInView.compare(lastPeriodOfPrevPage)
  const duration: { day?: number; month?: number } = {}
  if (diff >= 7) duration.day = 35
  if (diff >= getDaysInMonth(firstPeriodInView)) duration.month = 13
  return lastPeriodOfPrevPage.set({ ...duration })
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
  const headingFormatOptions: Intl.DateTimeFormatOptions = {
    calendar: placeholder.calendar.identifier,
  }
  if (placeholder.calendar.identifier === 'gregory' && placeholder.era === 'BC')
    headingFormatOptions.era = 'short'

  const build = (dateObj: DateValue) =>
    createMonths({
      dateObj,
      weekStartsOn: latest.current.weekStartsOn,
      locale: latest.current.locale,
      fixedWeeks: latest.current.fixedWeeks,
      numberOfMonths: latest.current.numberOfMonths,
    })

  const grid = useStore<Month<DateValue>[]>(() => build(placeholder))
  const visibleView = grid.value.map(month => month.value)

  function isOutsideVisibleView(date: DateValue) {
    return !grid.get().some(month => isEqualMonth(date, month.value))
  }

  function isNextButtonDisabled(nextPageFunc?: PageFunction) {
    const current = latest.current
    const months = grid.get()
    if (!current.maxValue || !months.length) return false
    if (current.disabled) return true
    const lastPeriodInView = months.at(-1)!.value
    if (!nextPageFunc && !current.nextPage) {
      const firstPeriodOfNextPage = lastPeriodInView.add({ months: 1 }).set({ day: 1 })
      return isAfter(firstPeriodOfNextPage, current.maxValue)
    }
    const firstPeriodOfNextPage = handleNextDisabled(
      lastPeriodInView,
      (nextPageFunc || current.nextPage)!,
    )
    return isAfter(firstPeriodOfNextPage, current.maxValue)
  }

  function isPrevButtonDisabled(prevPageFunc?: PageFunction) {
    const current = latest.current
    const months = grid.get()
    if (!current.minValue || !months.length) return false
    if (current.disabled) return true
    const firstPeriodInView = months[0]!.value
    if (!prevPageFunc && !current.prevPage) {
      const lastPeriodOfPrevPage = firstPeriodInView.subtract({ months: 1 }).set({ day: 35 })
      return isBefore(lastPeriodOfPrevPage, current.minValue)
    }
    const lastPeriodOfPrevPage = handlePrevDisabled(
      firstPeriodInView,
      (prevPageFunc || current.prevPage)!,
    )
    return isBefore(lastPeriodOfPrevPage, current.minValue)
  }

  function isDateDisabled(dateObj: DateValue) {
    const current = latest.current
    if (current.isDateDisabled?.(dateObj) || current.disabled) return true
    if (current.maxValue && isAfter(dateObj, current.maxValue)) return true
    if (current.minValue && isBefore(dateObj, current.minValue)) return true
    return false
  }

  function isDateUnavailable(date: DateValue) {
    return !!latest.current.isDateUnavailable?.(date)
  }

  const weekdays = grid.value.length
    ? grid.value[0]!.rows[0]!.map(date => formatter.dayOfWeek(toDate(date), props.weekdayFormat))
    : []

  function nextPage(nextPageFunc?: PageFunction) {
    const current = latest.current
    const firstDate = grid.get()[0]!.value
    if (!nextPageFunc && !current.nextPage) {
      const newDate = firstDate.add({
        months: current.pagedNavigation ? current.numberOfMonths : 1,
      })
      const newGrid = build(newDate)
      grid.set(newGrid)
      current.placeholder.set(newGrid[0]!.value.set({ day: 1 }))
      return
    }
    const newDate = (nextPageFunc || current.nextPage)!(firstDate)
    const newGrid = build(newDate)
    grid.set(newGrid)
    const duration: { day?: number; month?: number } = {}
    if (!nextPageFunc) {
      const diff = newGrid[0]!.value.compare(firstDate)
      if (diff >= getDaysInMonth(firstDate)) duration.day = 1
      if (diff >= 365) duration.month = 1
    }
    current.placeholder.set(newGrid[0]!.value.set({ ...duration }))
  }

  function prevPage(prevPageFunc?: PageFunction) {
    const current = latest.current
    const firstDate = grid.get()[0]!.value
    if (!prevPageFunc && !current.prevPage) {
      const newDate = firstDate.subtract({
        months: current.pagedNavigation ? current.numberOfMonths : 1,
      })
      const newGrid = build(newDate)
      grid.set(newGrid)
      current.placeholder.set(newGrid[0]!.value.set({ day: 1 }))
      return
    }
    const newDate = (prevPageFunc || current.prevPage)!(firstDate)
    const newGrid = build(newDate)
    grid.set(newGrid)
    const duration: { day?: number; month?: number } = {}
    if (!prevPageFunc) {
      const diff = firstDate.compare(newGrid[0]!.value)
      if (diff >= getDaysInMonth(firstDate)) duration.day = 1
      if (diff >= 365) duration.month = 1
    }
    current.placeholder.set(newGrid[0]!.value.set({ ...duration }))
  }

  useWatch([placeholder] as const, ([value]) => {
    if (grid.get().some(month => isEqualMonth(month.value, value))) return
    grid.set(build(value))
  })

  useWatch(
    [props.locale, props.weekStartsOn, props.fixedWeeks, props.numberOfMonths] as const,
    () => {
      grid.set(build(latest.current.placeholder.get()))
    },
  )

  let headingValue = ''
  if (grid.value.length) {
    if (props.locale !== formatter.getLocale()) formatter.setLocale(props.locale)
    if (grid.value.length === 1) {
      headingValue = `${formatter.fullMonthAndYear(toDate(grid.value[0]!.value), headingFormatOptions)}`
    } else {
      const startMonth = toDate(grid.value[0]!.value)
      const endMonth = toDate(grid.value.at(-1)!.value)
      const startMonthName = formatter.fullMonth(startMonth, headingFormatOptions)
      const endMonthName = formatter.fullMonth(endMonth, headingFormatOptions)
      const startMonthYear = formatter.fullYear(startMonth, headingFormatOptions)
      const endMonthYear = formatter.fullYear(endMonth, headingFormatOptions)
      headingValue =
        startMonthYear === endMonthYear
          ? `${startMonthName} - ${endMonthName} ${endMonthYear}`
          : `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`
    }
  }
  const fullCalendarLabel = `${props.calendarLabel ?? 'Event Date'}, ${headingValue}`

  const isPlaceholderFocusable = !(
    isDateDisabled(placeholder) ||
    isDateUnavailable(placeholder) ||
    !visibleView.some(month => isEqualMonth(placeholder, month))
  )

  let firstFocusableDate: DateValue | undefined
  search: for (const month of grid.value) {
    if (props.minValue && isBefore(month.value, props.minValue)) continue
    const daysInMonth = getDaysInMonth(month.value)
    const startDay =
      props.minValue && isSameMonth(props.minValue, month.value) ? props.minValue.day : 1
    for (let day = startDay; day <= daysInMonth; day++) {
      const date = month.value.set({ day })
      if (isDateDisabled(date) || isDateUnavailable(date)) continue
      firstFocusableDate = date
      break search
    }
  }

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
