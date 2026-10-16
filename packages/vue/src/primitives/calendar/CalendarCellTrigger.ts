import {
  computed,
  createTextVNode,
  defineComponent,
  h,
  nextTick,
  renderSlot,
  toDisplayString,
  withCtx,
  withKeys,
  type PropType,
} from 'vue'
import { getLocalTimeZone, isSameMonth, isToday, type DateValue } from '@internationalized/date'
import {
  calendarArrowShift,
  calendarCellTabIndex,
  calendarShiftCandidate,
  isCalendarFocusedDate,
} from '../../../../shared/src/primitives/date/calendar-view'
import { toDate } from '../../../../shared/src/primitives/date/comparators'
import { kbd } from '../../../../shared/src/primitives/date/utils'
import { Primitive, type PrimitiveProps } from '../primitive'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { injectCalendarRootContext } from './context'

export interface CalendarCellTriggerProps {
  day: DateValue
  month: DateValue
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const CalendarCellTrigger = defineComponent({
  name: 'CalendarCellTrigger',
  props: {
    day: { type: null as unknown as PropType<DateValue>, required: true },
    month: { type: null as unknown as PropType<DateValue>, required: true },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'div',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectCalendarRootContext()
    const { primitiveElement } = usePrimitiveElement()

    const dayValue = computed(() => props.day.day.toLocaleString(rootContext.locale.value))
    const labelText = computed(() =>
      rootContext.formatter.custom(toDate(props.day), {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
    const isUnavailable = computed(() => rootContext.isDateUnavailable?.(props.day) ?? false)
    const isDateToday = computed(() => isToday(props.day, getLocalTimeZone()))
    const isOutsideView = computed(() => !isSameMonth(props.day, props.month))
    const isOutsideVisibleView = computed(() => rootContext.isOutsideVisibleView(props.day))
    const isDisabled = computed(
      () =>
        rootContext.isDateDisabled(props.day) ||
        (rootContext.disableDaysOutsideCurrentView.value && isOutsideView.value),
    )
    const isFocusedDate = computed(() =>
      isCalendarFocusedDate({
        day: props.day,
        outsideView: isOutsideView.value,
        disabled: isDisabled.value,
        rootDisabled: rootContext.disabled.value,
        placeholderFocusable: rootContext.isPlaceholderFocusable.value,
        placeholder: rootContext.placeholder.value,
        hasSelectedDate: rootContext.hasSelectedDate.value,
        selectedDateDisabled: rootContext.isSelectedDateDisabled.value,
        firstFocusableDate: rootContext.firstFocusableDate.value,
      }),
    )
    const isSelectedDate = computed(() => rootContext.isDateSelected(props.day))

    function changeDate(date: DateValue) {
      if (rootContext.readonly.value) return
      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date)) return
      rootContext.onDateChange(date)
    }

    function handleClick() {
      if (isDisabled.value) return
      changeDate(props.day)
    }

    function shiftFocus(day: DateValue, add: number) {
      const candidateDayValue = calendarShiftCandidate(
        day,
        add,
        rootContext.minValue.value,
        rootContext.maxValue.value,
      )
      if (!candidateDayValue) return
      const candidateDay = rootContext.parentElement.value!.querySelector<HTMLElement>(
        `[data-value='${candidateDayValue.toString()}']:not([data-outside-view])`,
      )
      if (!candidateDay) {
        if (add > 0) {
          if (rootContext.isNextButtonDisabled()) return
          rootContext.nextPage()
        } else {
          if (rootContext.isPrevButtonDisabled()) return
          rootContext.prevPage()
        }
        void nextTick(() => shiftFocus(day, add))
        return
      }
      if (candidateDay.hasAttribute('data-disabled')) return shiftFocus(candidateDayValue, add)
      rootContext.onPlaceholderChange(candidateDayValue)
      candidateDay.focus()
    }

    function handleArrowKey(event: KeyboardEvent) {
      if (isDisabled.value) return
      if (
        (event.code === kbd.ENTER || event.code === kbd.SPACE_CODE) &&
        (event.ctrlKey || event.metaKey || event.altKey)
      )
        return
      event.preventDefault()
      event.stopPropagation()
      const shift = calendarArrowShift(event.code, rootContext.dir.value)
      if (shift !== undefined) shiftFocus(props.day, shift)
      else if (event.code === kbd.ENTER || event.code === kbd.SPACE_CODE) changeDate(props.day)
    }

    const onKeydown = withKeys(handleArrowKey as (event: Event) => void, [
      'up',
      'down',
      'left',
      'right',
      'space',
      'enter',
    ])

    return () =>
      h(
        Primitive,
        {
          ref: primitiveElement,
          as: props.as,
          'as-child': props.asChild,
          role: 'button',
          'aria-label': labelText.value,
          'data-reka-calendar-cell-trigger': '',
          'aria-disabled': isDisabled.value || isUnavailable.value ? true : undefined,
          'data-selected': isSelectedDate.value ? true : undefined,
          'data-value': props.day.toString(),
          'data-disabled': isDisabled.value ? '' : undefined,
          'data-unavailable': isUnavailable.value ? '' : undefined,
          'data-today': isDateToday.value ? '' : undefined,
          'data-outside-view': isOutsideView.value ? '' : undefined,
          'data-outside-visible-view': isOutsideVisibleView.value ? '' : undefined,
          'data-focused': isFocusedDate.value ? '' : undefined,
          tabindex: calendarCellTabIndex(
            isFocusedDate.value,
            isOutsideView.value,
            isDisabled.value,
          ),
          onClick: handleClick,
          onKeydown,
        },
        {
          default: withCtx(() => [
            renderSlot(
              slots,
              'default',
              {
                dayValue: dayValue.value,
                disabled: isDisabled.value,
                today: isDateToday.value,
                selected: isSelectedDate.value,
                outsideView: isOutsideView.value,
                outsideVisibleView: isOutsideVisibleView.value,
                unavailable: isUnavailable.value,
              },
              () => [createTextVNode(toDisplayString(dayValue.value), 1)],
            ),
          ]),
        },
      )
  },
})
