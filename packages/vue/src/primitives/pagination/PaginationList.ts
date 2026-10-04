import {
  computed,
  defineComponent,
  guardReactiveProps,
  h,
  normalizeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { getRange, transform } from '../../../../shared/src/primitives/pagination'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectPaginationRootContext } from './context'

export interface PaginationListProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const PaginationList = defineComponent({
  name: 'PaginationList',
  props: {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectPaginationRootContext()
    const transformedRange = computed(() =>
      transform(
        getRange(
          rootContext.page.value,
          rootContext.pageCount.value,
          rootContext.siblingCount.value,
          rootContext.showEdges.value,
        ),
      ),
    )

    return () =>
      h(Primitive, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default', { items: transformedRange.value })]),
      })
  },
})
