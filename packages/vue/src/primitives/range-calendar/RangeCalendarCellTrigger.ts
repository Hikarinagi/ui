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
} from '../../../../shared/src/primitives/date/calendar-view'
import { isBetweenInclusive, toDate } from '../../../../shared/src/primitives/date/comparators'
import {
  isRangeFocusedDate,
  nextRangeSelection,
} from '../../../../shared/src/primitives/date/range-calendar-view'
import { kbd } from '../../../../shared/src/primitives/date/utils'
import { Primitive, type PrimitiveProps } from '../primitive'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { injectRangeCalendarRootContext } from './context'

export interface RangeCalendarCellTriggerProps {
  day: DateValue
  month: DateValue
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const RangeCalendarCellTrigger = defineComponent({
  name: 'RangeCalendarCellTrigger',
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
    const rootContext = injectRangeCalendarRootContext()
    const { primitiveElement } = usePrimitiveElement()

    const labelText = computed(() =>
      rootContext.formatter.custom(toDate(props.day), {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
    const isUnavailable = computed(() => rootContext.isDateUnavailable?.(props.day) ?? false)
    const isSelectedDate = computed(() => rootContext.isSelected(props.day))
    const isSelectionStart = computed(() => rootContext.isSelectionStart(props.day))
    const isSelectionEnd = computed(() => rootContext.isSelectionEnd(props.day))
    const isHighlightStart = computed(() => rootContext.isHighlightedStart(props.day))
    const isHighlightEnd = computed(() => rootContext.isHighlightedEnd(props.day))
    const isHighlighted = computed(() =>
      rootContext.highlightedRange.value
        ? isBetweenInclusive(
            props.day,
            rootContext.highlightedRange.value.start,
            rootContext.highlightedRange.value.end,
          )
        : false,
    )
    const allowNonContiguousRanges = computed(() => rootContext.allowNonContiguousRanges.value)
    const isDateToday = computed(() => isToday(props.day, getLocalTimeZone()))
    const isOutsideView = computed(() => !isSameMonth(props.day, props.month))
    const isOutsideVisibleView = computed(() => rootContext.isOutsideVisibleView(props.day))
    const isDisabled = computed(
      () =>
        rootContext.isDateDisabled(props.day) ||
        (rootContext.disableDaysOutsideCurrentView.value && isOutsideView.value),
    )
    const dayValue = computed(() => props.day.day.toLocaleString(rootContext.locale.value))
    const isFocusedDate = computed(() =>
      isRangeFocusedDate({
        day: props.day,
        outsideView: isOutsideView.value,
        disabled: isDisabled.value,
        rootDisabled: rootContext.disabled.value,
        placeholderFocusable: rootContext.isPlaceholderFocusable.value,
        placeholder: rootContext.placeholder.value,
        selectedFocusableDate: rootContext.selectedFocusableDate.value,
        hasSelectedDate: rootContext.hasSelectedDate.value,
        selectedDisabled: rootContext.isSelectedDisabled.value,
        firstFocusableDate: rootContext.firstFocusableDate.value,
      }),
    )
    const shown = (value: boolean) =>
      value && (allowNonContiguousRanges.value || !isUnavailable.value)

    function changeDate(event: Event, date: DateValue) {
      if (rootContext.readonly.value) return
      if (rootContext.isDateDisabled(date) || rootContext.isDateUnavailable?.(date)) return
      const change = nextRangeSelection(date, {
        start: rootContext.startValue.value,
        end: rootContext.endValue.value,
        highlighted: rootContext.highlightedRange.value !== null,
        lastPressed: rootContext.lastPressedDateValue.value,
        preventDeselect: rootContext.preventDeselect.value,
        fixedDate: rootContext.fixedDate.value,
      })
      if (change.preventDefault) event.preventDefault()
      if (change.start) rootContext.startValue.value = change.start.value
      if (change.end) rootContext.endValue.value = change.end.value
      if (change.placeholder) rootContext.onPlaceholderChange(change.placeholder)
      if (change.lastPressed) rootContext.lastPressedDateValue.value = change.lastPressed
    }

    function handleClick(event: MouseEvent) {
      if (isDisabled.value) return
      changeDate(event, props.day)
    }

    function handleFocus() {
      if (isDisabled.value || rootContext.isDateUnavailable?.(props.day)) return
      rootContext.focusedValue.value = props.day.copy()
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
      else if (event.code === kbd.ENTER || event.code === kbd.SPACE_CODE)
        changeDate(event, props.day)
    }

    const onKeydown = withKeys(handleArrowKey as (event: Event) => void, [
      'up',
      'down',
      'left',
      'right',
      'enter',
      'space',
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
          'aria-pressed': shown(isSelectedDate.value) ? true : undefined,
          'aria-disabled': isDisabled.value || isUnavailable.value ? true : undefined,
          'data-highlighted': shown(isHighlighted.value) ? '' : undefined,
          'data-selection-start': isSelectionStart.value ? true : undefined,
          'data-selection-end': isSelectionEnd.value ? true : undefined,
          'data-highlighted-start': isHighlightStart.value ? true : undefined,
          'data-highlighted-end': isHighlightEnd.value ? true : undefined,
          'data-selected': shown(isSelectedDate.value) ? true : undefined,
          'data-outside-visible-view': isOutsideVisibleView.value ? '' : undefined,
          'data-value': props.day.toString(),
          'data-disabled': isDisabled.value ? '' : undefined,
          'data-unavailable': isUnavailable.value ? '' : undefined,
          'data-today': isDateToday.value ? '' : undefined,
          'data-outside-view': isOutsideView.value ? '' : undefined,
          'data-focused': isFocusedDate.value ? '' : undefined,
          tabindex: calendarCellTabIndex(
            isFocusedDate.value,
            isOutsideView.value,
            isDisabled.value,
          ),
          onClick: handleClick,
          onFocusin: handleFocus,
          onMouseenter: handleFocus,
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
                highlighted: shown(isHighlighted.value),
                highlightedStart: isHighlightStart.value,
                highlightedEnd: isHighlightEnd.value,
                selectionStart: isSelectionStart.value,
                selectionEnd: isSelectionEnd.value,
              },
              () => [createTextVNode(toDisplayString(dayValue.value), 1)],
            ),
          ]),
        },
      )
  },
})
