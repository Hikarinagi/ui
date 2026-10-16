import { computed, ref, watch, type Ref } from 'vue'
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
import { createDateFormatter } from '../../../../shared/src/primitives/date/formatter'

export interface UseCalendarProps {
  locale: Ref<string>
  placeholder: Ref<DateValue>
  weekStartsOn: Ref<number>
  fixedWeeks: Ref<boolean>
  numberOfMonths: Ref<number>
  minValue: Ref<DateValue | undefined>
  maxValue: Ref<DateValue | undefined>
  disabled: Ref<boolean>
  weekdayFormat: Ref<WeekDayFormat>
  pagedNavigation: Ref<boolean>
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  calendarLabel: Ref<string | undefined>
  nextPage: Ref<PageFunction | undefined>
  prevPage: Ref<PageFunction | undefined>
}

export function useCalendarState(props: {
  isDateDisabled: Matcher
  isDateUnavailable: Matcher
  date: Ref<DateValue | DateValue[] | undefined>
}) {
  return {
    isDateSelected: (dateObj: DateValue) => isCalendarDateSelected(props.date.value, dateObj),
    isInvalid: computed(() =>
      isCalendarSelectionInvalid(props.date.value, props.isDateDisabled, props.isDateUnavailable),
    ),
    hasSelectedDate: computed(() => hasCalendarSelection(props.date.value)),
    isSelectedDateDisabled: computed(() =>
      isCalendarSelectionDisabled(props.date.value, props.isDateDisabled),
    ),
  }
}

export function useCalendar(props: UseCalendarProps) {
  const formatter = createDateFormatter(props.locale.value)
  const headingFormatOptions = computed(() => calendarHeadingOptions(props.placeholder.value))

  const gridOptions = () => ({
    weekStartsOn: props.weekStartsOn.value,
    locale: props.locale.value,
    fixedWeeks: props.fixedWeeks.value,
    numberOfMonths: props.numberOfMonths.value,
  })
  const bounds = () => ({
    minValue: props.minValue.value,
    maxValue: props.maxValue.value,
    disabled: props.disabled.value,
  })

  const grid = ref(buildCalendarGrid(props.placeholder.value, gridOptions())) as Ref<
    Month<DateValue>[]
  >
  const visibleView = computed(() => grid.value.map(month => month.value))

  const isOutsideVisibleView = (date: DateValue) => isOutsideCalendarView(grid.value, date)
  const isNextButtonDisabled = (nextPageFunc?: PageFunction) =>
    isCalendarNextDisabled(grid.value, bounds(), props.nextPage.value, nextPageFunc)
  const isPrevButtonDisabled = (prevPageFunc?: PageFunction) =>
    isCalendarPrevDisabled(grid.value, bounds(), props.prevPage.value, prevPageFunc)
  const isDateDisabled = (dateObj: DateValue) =>
    isCalendarDateDisabled(dateObj, bounds(), props.isDateDisabled)
  const isDateUnavailable = (date: DateValue) => !!props.isDateUnavailable?.(date)

  const weekdays = computed(() =>
    calendarWeekdays(grid.value, formatter, props.weekdayFormat.value),
  )

  function turn(direction: 1 | -1, pageFunc?: PageFunction) {
    const next = turnCalendarPage(
      direction,
      grid.value,
      {
        ...gridOptions(),
        pagedNavigation: props.pagedNavigation.value,
        page: direction > 0 ? props.nextPage.value : props.prevPage.value,
      },
      pageFunc,
    )
    grid.value = next.grid
    props.placeholder.value = next.placeholder
  }

  const nextPage = (nextPageFunc?: PageFunction) => turn(1, nextPageFunc)
  const prevPage = (prevPageFunc?: PageFunction) => turn(-1, prevPageFunc)

  watch(props.placeholder, value => {
    if (!isOutsideCalendarView(grid.value, value)) return
    grid.value = buildCalendarGrid(value, gridOptions())
  })

  watch([props.locale, props.weekStartsOn, props.fixedWeeks, props.numberOfMonths], () => {
    grid.value = buildCalendarGrid(props.placeholder.value, gridOptions())
  })

  const headingValue = computed(() =>
    calendarHeading(grid.value, formatter, props.locale.value, headingFormatOptions.value),
  )

  const fullCalendarLabel = computed(() =>
    calendarLabel(props.calendarLabel.value, headingValue.value),
  )

  const isPlaceholderFocusable = computed(
    () =>
      !(
        isDateDisabled(props.placeholder.value) ||
        isDateUnavailable(props.placeholder.value) ||
        isOutsideVisibleView(props.placeholder.value)
      ),
  )

  const firstFocusableDate = computed(() =>
    firstFocusableCalendarDate(
      grid.value,
      props.minValue.value,
      date => isDateDisabled(date) || isDateUnavailable(date),
    ),
  )

  return {
    isDateDisabled,
    isDateUnavailable,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    grid,
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
