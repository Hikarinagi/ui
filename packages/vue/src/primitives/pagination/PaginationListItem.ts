import {
  computed,
  createTextVNode,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  toDisplayString,
  withCtx,
  type PropType,
} from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectPaginationRootContext } from './context'

export interface PaginationListItemProps {
  value: number
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const PaginationListItem = defineComponent({
  name: 'PaginationListItem',
  props: {
    value: { type: Number, required: true },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectPaginationRootContext()
    const isSelected = computed(() => rootContext.page.value === props.value)
    const disabled = computed(() => rootContext.disabled.value)
    const onClick = () => !disabled.value && rootContext.onPageChange(props.value)

    return () =>
      h(
        Primitive,
        mergeProps(props, {
          'data-type': 'page',
          'aria-label': `Page ${props.value}`,
          'aria-current': isSelected.value ? 'page' : undefined,
          'data-selected': isSelected.value ? 'true' : undefined,
          disabled: disabled.value,
          type: props.as === 'button' ? 'button' : undefined,
          onClick,
        }),
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', {}, () => [
              createTextVNode(toDisplayString(props.value), 1),
            ]),
          ]),
        },
      )
  },
})
