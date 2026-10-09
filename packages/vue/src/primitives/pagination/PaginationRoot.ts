import { computed, defineComponent, h, renderSlot, toRefs, withCtx, type PropType } from 'vue'
import { paginationPageCount } from '../../../../shared/src/primitives/pagination'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { providePaginationRootContext } from './context'

export interface PaginationRootProps {
  page?: number
  defaultPage?: number
  itemsPerPage: number
  total?: number
  siblingCount?: number
  disabled?: boolean
  showEdges?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type PaginationRootEmits = {
  'update:page': [value: number]
}

export const PaginationRoot = defineComponent({
  name: 'PaginationRoot',
  props: {
    page: { type: Number, required: false },
    defaultPage: { type: Number, required: false, default: 1 },
    itemsPerPage: { type: Number, required: true },
    total: { type: Number, required: false, default: 0 },
    siblingCount: { type: Number, required: false, default: 2 },
    disabled: { type: Boolean, required: false },
    showEdges: { type: Boolean, required: false, default: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'nav',
    },
  },
  emits: ['update:page'],
  setup(props, { emit, slots }) {
    const { siblingCount, disabled, showEdges } = toRefs(props)
    useForwardExpose()
    const page = useVModel(props, 'page', emit, {
      defaultValue: props.defaultPage,
      passive: props.page === undefined,
    })
    const pageCount = computed(() => paginationPageCount(props.total, props.itemsPerPage))

    providePaginationRootContext({
      page: page as never,
      onPageChange(value) {
        page.value = value
      },
      pageCount,
      siblingCount,
      disabled,
      showEdges,
    })

    return () =>
      h(
        Primitive,
        { as: props.as, 'as-child': props.asChild },
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', { page: page.value, pageCount: pageCount.value }),
          ]),
        },
      )
  },
})
