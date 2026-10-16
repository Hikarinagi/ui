import type { Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import type { Month } from '../../../../shared/src/primitives/date/calendar'
import type {
  Matcher,
  PageFunction,
  WeekDayFormat,
} from '../../../../shared/src/primitives/date/calendar-view'
import type { Formatter } from '../../../../shared/src/primitives/date/formatter'
import type {
  CalendarRange,
  FixedDate,
} from '../../../../shared/src/primitives/date/range-calendar-view'
import { createContext } from '../utils/createContext'
import type { Direction } from '../utils/useDirection'

export interface RangeCalendarRootContext {
  modelValue: Ref<CalendarRange>
  startValue: Ref<DateValue | undefined>
  endValue: Ref<DateValue | undefined>
  locale: Ref<string>
  placeholder: Ref<DateValue>
  pagedNavigation: Ref<boolean>
  preventDeselect: Ref<boolean>
  grid: Ref<Month<DateValue>[]>
  weekDays: Ref<string[]>
  weekStartsOn: Ref<number>
  weekdayFormat: Ref<WeekDayFormat>
  fixedWeeks: Ref<boolean>
  numberOfMonths: Ref<number>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  initialFocus: Ref<boolean>
  onPlaceholderChange: (date: DateValue) => void
  fullCalendarLabel: Ref<string>
  parentElement: Ref<HTMLElement | undefined>
  headingValue: Ref<string>
  isInvalid: Ref<boolean>
  isDateDisabled: Matcher
  isDateUnavailable?: Matcher
  isDateHighlightable?: Matcher
  isOutsideVisibleView: (date: DateValue) => boolean
  allowNonContiguousRanges: Ref<boolean>
  highlightedRange: Ref<{ start: DateValue; end: DateValue } | null>
  focusedValue: Ref<DateValue | undefined>
  lastPressedDateValue: Ref<DateValue | undefined>
  isSelected: Matcher
  isSelectionStart: Matcher
  isSelectionEnd: Matcher
  isHighlightedStart: Matcher
  isHighlightedEnd: Matcher
  prevPage: (prevPageFunc?: PageFunction) => void
  nextPage: (nextPageFunc?: PageFunction) => void
  isNextButtonDisabled: (nextPageFunc?: PageFunction) => boolean
  isPrevButtonDisabled: (prevPageFunc?: PageFunction) => boolean
  formatter: Formatter
  dir: Ref<Direction>
  disableDaysOutsideCurrentView: Ref<boolean>
  fixedDate: Ref<FixedDate>
  maximumDays: Ref<number | undefined>
  minValue: Ref<DateValue | undefined>
  maxValue: Ref<DateValue | undefined>
  isPlaceholderFocusable: Ref<boolean>
  firstFocusableDate: Ref<DateValue | undefined>
  hasSelectedDate: Ref<boolean>
  isSelectedDisabled: Ref<boolean>
  selectedFocusableDate: Ref<DateValue | undefined>
}

export const [injectRangeCalendarRootContext, provideRangeCalendarRootContext] =
  createContext<RangeCalendarRootContext>('RangeCalendarRoot')
