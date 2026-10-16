import { computed, defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import type { DateValue } from '@internationalized/date'
import { createPagingButton } from '../calendar/CalendarNav'
import { createGridGroup } from '../calendar/CalendarGrid'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectRangeCalendarRootContext } from './context'

export const RangeCalendarGrid = defineComponent({
  name: 'RangeCalendarGrid',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'table',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectRangeCalendarRootContext()
    const disabled = computed(() => (rootContext.disabled.value ? true : undefined))
    const readonly = computed(() => (rootContext.readonly.value ? true : undefined))
    const onMouseleave = () => {
      rootContext.focusedValue.value = undefined
    }
    return () =>
      h(
        Primitive,
        mergeProps(props, {
          tabindex: '-1',
          role: 'application',
          'aria-readonly': readonly.value,
          'aria-disabled': disabled.value,
          'data-readonly': readonly.value && '',
          'data-disabled': disabled.value && '',
          onMouseleave,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const RangeCalendarGridHead = createGridGroup('RangeCalendarGridHead', 'thead', {
  'aria-hidden': 'true',
})
export const RangeCalendarGridBody = createGridGroup('RangeCalendarGridBody', 'tbody')
export const RangeCalendarGridRow = createGridGroup('RangeCalendarGridRow', 'tr')
export const RangeCalendarHeadCell = createGridGroup('RangeCalendarHeadCell', 'th')

export const RangeCalendarCell = defineComponent({
  name: 'RangeCalendarCell',
  props: {
    date: { type: null as unknown as PropType<DateValue>, required: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false, default: 'td' },
  },
  setup(props, { slots }) {
    const rootContext = injectRangeCalendarRootContext()
    return () =>
      h(
        Primitive,
        {
          as: props.as,
          'as-child': props.asChild,
          role: 'gridcell',
          'aria-selected': rootContext.isSelected(props.date) ? true : undefined,
          'aria-disabled':
            rootContext.isDateDisabled(props.date) ||
            rootContext.isDateUnavailable?.(props.date) ||
            rootContext.disableDaysOutsideCurrentView.value,
          'data-disabled':
            rootContext.isDateDisabled(props.date) ||
            rootContext.disableDaysOutsideCurrentView.value
              ? ''
              : undefined,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const RangeCalendarNext = createPagingButton(
  'RangeCalendarNext',
  'next',
  injectRangeCalendarRootContext,
)
export const RangeCalendarPrev = createPagingButton(
  'RangeCalendarPrev',
  'prev',
  injectRangeCalendarRootContext,
)
