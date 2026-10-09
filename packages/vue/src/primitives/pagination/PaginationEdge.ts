import {
  computed,
  createTextVNode,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import {
  PAGINATION_EDGES,
  paginationEdgeDisabled,
  paginationEdgeTarget,
  type PaginationEdge,
} from '../../../../shared/src/primitives/pagination'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectPaginationRootContext } from './context'

export interface PaginationEdgeProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

function definePaginationEdge(edge: PaginationEdge, name: string) {
  const { label, fallback } = PAGINATION_EDGES[edge]
  return defineComponent({
    name,
    props: {
      asChild: { type: Boolean, required: false },
      as: {
        type: null as unknown as PropType<PrimitiveProps['as']>,
        required: false,
        default: 'button',
      },
    },
    setup(props, { slots }) {
      const rootContext = injectPaginationRootContext()
      useForwardExpose()
      const disabled = computed(() =>
        paginationEdgeDisabled(
          edge,
          rootContext.page.value,
          rootContext.pageCount.value,
          rootContext.disabled.value,
        ),
      )
      const onClick = () =>
        !disabled.value &&
        rootContext.onPageChange(
          paginationEdgeTarget(edge, rootContext.page.value, rootContext.pageCount.value),
        )

      return () =>
        h(
          Primitive,
          mergeProps(props, {
            'aria-label': label,
            type: props.as === 'button' ? 'button' : undefined,
            disabled: disabled.value,
            onClick,
          }),
          {
            default: withCtx(() => [
              renderSlot(slots, 'default', {}, () => [createTextVNode(fallback)]),
            ]),
          },
        )
    },
  })
}

export const PaginationFirst = definePaginationEdge('first', 'PaginationFirst')
export const PaginationPrev = definePaginationEdge('prev', 'PaginationPrev')
export const PaginationNext = definePaginationEdge('next', 'PaginationNext')
export const PaginationLast = definePaginationEdge('last', 'PaginationLast')
