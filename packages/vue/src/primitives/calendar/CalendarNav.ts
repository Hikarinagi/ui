import {
  computed,
  createTextVNode,
  defineComponent,
  h,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import type { PageFunction } from '../../../../shared/src/primitives/date/calendar-view'
import { Primitive, type PrimitiveProps } from '../primitive'
import { injectCalendarRootContext } from './context'

interface PagingContext {
  disabled: { value: boolean }
  nextPage: (page?: PageFunction) => void
  prevPage: (page?: PageFunction) => void
  isNextButtonDisabled: (page?: PageFunction) => boolean
  isPrevButtonDisabled: (page?: PageFunction) => boolean
}

export function createPagingButton(
  name: string,
  direction: 'next' | 'prev',
  inject: () => PagingContext,
  unit: 'page' | 'year' = 'page',
) {
  const label = direction === 'next' ? `Next ${unit}` : `Previous ${unit}`
  const text = direction === 'next' ? ` Next ${unit} ` : ` Prev ${unit} `
  const propName = direction === 'next' ? 'nextPage' : 'prevPage'
  return defineComponent({
    name,
    props: {
      [propName]: { type: Function as PropType<PageFunction>, required: false },
      asChild: { type: Boolean, required: false },
      as: {
        type: null as unknown as PropType<PrimitiveProps['as']>,
        required: false,
        default: 'button',
      },
    } as {
      nextPage: { type: PropType<PageFunction>; required: false }
      prevPage: { type: PropType<PageFunction>; required: false }
      asChild: { type: BooleanConstructor; required: false }
      as: { type: PropType<PrimitiveProps['as']>; required: false; default: string }
    },
    setup(props, { slots }) {
      const rootContext = inject()
      const page = () => (props as unknown as Record<string, PageFunction | undefined>)[propName]
      const disabled = computed(
        () =>
          rootContext.disabled.value ||
          (direction === 'next'
            ? rootContext.isNextButtonDisabled(page())
            : rootContext.isPrevButtonDisabled(page())),
      )
      function handleClick() {
        if (disabled.value) return
        if (direction === 'next') rootContext.nextPage(page())
        else rootContext.prevPage(page())
      }
      return () =>
        h(
          Primitive,
          {
            as: props.as,
            'as-child': props.asChild,
            'aria-label': label,
            type: props.as === 'button' ? 'button' : undefined,
            'aria-disabled': disabled.value || undefined,
            'data-disabled': disabled.value || undefined,
            disabled: disabled.value,
            onClick: handleClick,
          },
          {
            default: withCtx(() => [
              renderSlot(slots, 'default', { disabled: disabled.value }, () => [
                createTextVNode(text),
              ]),
            ]),
          },
        )
    },
  })
}

export const CalendarNext = createPagingButton('CalendarNext', 'next', injectCalendarRootContext)
export const CalendarPrev = createPagingButton('CalendarPrev', 'prev', injectCalendarRootContext)
