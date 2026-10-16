import {
  createCommentVNode,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import {
  injectListboxGroupContext,
  injectListboxItemContext,
  provideListboxGroupContext,
} from './context'

export interface ListboxGroupProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

const primitiveProps = {
  asChild: { type: Boolean, required: false },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
} as const

export const ListboxGroup = defineComponent({
  name: 'ListboxGroup',
  props: primitiveProps,
  setup(props, { slots }) {
    const id = useId(undefined, 'reka-listbox-group')
    provideListboxGroupContext({ id })
    return () =>
      h(Primitive, mergeProps({ role: 'group' }, props, { 'aria-labelledby': id }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const ListboxGroupLabel = defineComponent({
  name: 'ListboxGroupLabel',
  props: { ...primitiveProps, as: { ...primitiveProps.as, default: 'div' } },
  setup(props, { slots }) {
    const groupContext = injectListboxGroupContext({ id: '' })
    return () =>
      h(Primitive, mergeProps(props, { id: groupContext.id }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const ListboxItemIndicator = defineComponent({
  name: 'ListboxItemIndicator',
  props: { ...primitiveProps, as: { ...primitiveProps.as, default: 'span' } },
  setup(props, { slots }) {
    useForwardExpose()
    const itemContext = injectListboxItemContext()
    return () =>
      itemContext.isSelected.value
        ? h(Primitive, mergeProps({ key: 0, 'aria-hidden': 'true' }, props), {
            default: withCtx(() => [renderSlot(slots, 'default')]),
          })
        : createCommentVNode('v-if', true)
  },
})
