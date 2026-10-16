import type { Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import type { Month } from '../../../../shared/src/primitives/date/calendar'
import type {
  Matcher,
  PageFunction,
  WeekDayFormat,
} from '../../../../shared/src/primitives/date/calendar-view'
import type { Formatter } from '../../../../shared/src/primitives/date/formatter'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface CalendarRootContext {
  locale: Ref<string>
  modelValue: Ref<DateValue | DateValue[] | undefined>
  placeholder: Ref<DateValue>
  pagedNavigation: Ref<boolean>
  preventDeselect: Ref<boolean>
  grid: Ref<Month<DateValue>[]>
  weekDays: Ref<string[]>
  weekStartsOn: Ref<number>
  weekdayFormat: Ref<WeekDayFormat>
  fixedWeeks: Ref<boolean>
  multiple: Ref<boolean>
  numberOfMonths: Ref<number>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  initialFocus: Ref<boolean>
  onDateChange: (date: DateValue) => void
  onPlaceholderChange: (date: DateValue) => void
  fullCalendarLabel: Ref<string>
  parentElement: Ref<HTMLElement | undefined>
  headingValue: Ref<string>
  isInvalid: Ref<boolean>
  isDateDisabled: Matcher
  isDateSelected: Matcher
  isDateUnavailable?: Matcher
  isOutsideVisibleView: (date: DateValue) => boolean
  prevPage: (prevPageFunc?: PageFunction) => void
  nextPage: (nextPageFunc?: PageFunction) => void
  isNextButtonDisabled: (nextPageFunc?: PageFunction) => boolean
  isPrevButtonDisabled: (prevPageFunc?: PageFunction) => boolean
  formatter: Formatter
  dir: Ref<Direction>
  disableDaysOutsideCurrentView: Ref<boolean>
  minValue: Ref<DateValue | undefined>
  maxValue: Ref<DateValue | undefined>
  isPlaceholderFocusable: Ref<boolean>
  firstFocusableDate: Ref<DateValue | undefined>
  hasSelectedDate: Ref<boolean>
  isSelectedDateDisabled: Ref<boolean>
}

export const [injectCalendarRootContext, provideCalendarRootContext] =
  createContext<CalendarRootContext>('CalendarRoot')
