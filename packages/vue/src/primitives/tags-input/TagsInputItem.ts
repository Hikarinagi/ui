import {
  computed,
  createTextVNode,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  toDisplayString,
  toRefs,
  withCtx,
  type PropType,
} from 'vue'
import type { AcceptableInputValue } from '../../../../shared/src/primitives/tags-input'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import {
  injectTagsInputItemContext,
  injectTagsInputRootContext,
  provideTagsInputItemContext,
} from './context'

export interface TagsInputItemProps {
  value: AcceptableInputValue
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const TagsInputItem = defineComponent({
  name: 'TagsInputItem',
  props: {
    value: { type: null as unknown as PropType<AcceptableInputValue>, required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { value } = toRefs(props)
    const context = injectTagsInputRootContext()
    const { forwardRef, currentElement } = useForwardExpose()
    const { CollectionItem } = useCollection()

    const isSelected = computed(() => context.selectedElement.value === currentElement.value)
    const disabled = computed(() => props.disabled || context.disabled.value)

    const itemContext = provideTagsInputItemContext({
      value,
      isSelected,
      disabled,
      textId: '',
      displayValue: computed(() => context.displayValue(value.value)),
    })

    return () =>
      h(
        CollectionItem,
        { value: value.value },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                as: props.as,
                'as-child': props.asChild,
                'aria-labelledby': itemContext.textId,
                'aria-current': isSelected.value,
                'data-disabled': disabled.value ? '' : undefined,
                'data-state': isSelected.value ? 'active' : 'inactive',
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const TagsInputItemText = defineComponent({
  name: 'TagsInputItemText',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'span',
    },
  },
  setup(props, { slots }) {
    const itemContext = injectTagsInputItemContext()
    useForwardExpose()
    itemContext.textId ||= useId(undefined, 'reka-tags-input-item-text')

    return () =>
      h(Primitive, mergeProps(props, { id: itemContext.textId }), {
        default: withCtx(() => [
          renderSlot(slots, 'default', {}, () => [
            createTextVNode(toDisplayString(itemContext.displayValue.value), 1),
          ]),
        ]),
      })
  },
})
