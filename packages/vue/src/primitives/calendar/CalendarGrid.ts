import {
  computed,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import type { DateValue } from '@internationalized/date'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectCalendarRootContext } from './context'

function primitiveProps(as: string) {
  return {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false, default: as },
  } as const
}

export function createGridGroup(name: string, as: string, extra?: Record<string, string>) {
  return defineComponent({
    name,
    props: primitiveProps(as),
    setup(props, { slots }) {
      return () =>
        h(Primitive, extra ? mergeProps(props, extra) : normalizeProps(guardReactiveProps(props)), {
          default: withCtx(() => [renderSlot(slots, 'default')]),
        })
    },
  })
}

export function createGrid(
  name: string,
  inject: () => { disabled: { value: boolean }; readonly: { value: boolean } },
) {
  return defineComponent({
    name,
    props: primitiveProps('table'),
    setup(props, { slots }) {
      const rootContext = inject()
      const disabled = computed(() => (rootContext.disabled.value ? true : undefined))
      const readonly = computed(() => (rootContext.readonly.value ? true : undefined))
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
          }),
          { default: withCtx(() => [renderSlot(slots, 'default')]) },
        )
    },
  })
}

export const CalendarGrid = createGrid('CalendarGrid', injectCalendarRootContext)
export const CalendarGridHead = createGridGroup('CalendarGridHead', 'thead', {
  'aria-hidden': 'true',
})
export const CalendarGridBody = createGridGroup('CalendarGridBody', 'tbody')
export const CalendarGridRow = createGridGroup('CalendarGridRow', 'tr')
export const CalendarHeadCell = createGridGroup('CalendarHeadCell', 'th')

export const CalendarCell = defineComponent({
  name: 'CalendarCell',
  props: {
    date: { type: null as unknown as PropType<DateValue>, required: true },
    ...primitiveProps('td'),
  },
  setup(props, { slots }) {
    const rootContext = injectCalendarRootContext()
    return () =>
      h(
        Primitive,
        {
          as: props.as,
          'as-child': props.asChild,
          role: 'gridcell',
          'aria-selected': rootContext.isDateSelected(props.date) ? true : undefined,
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
