import {
  computed,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  withCtx,
  withKeys,
  withMemo,
  withModifiers,
  type PropType,
  type VNode,
} from 'vue'
import {
  dispatchListboxSelect,
  listboxItemTabIndex,
  valueComparator,
  type ListboxSelectEvent,
} from '../../../../shared/src/primitives/listbox'
import { useCollection } from '../collection'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { injectListboxRootContext, provideListboxItemContext } from './context'

export interface ListboxItemProps<T = unknown> {
  value: T
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type ListboxItemEmits<T = unknown> = {
  select: [event: ListboxSelectEvent<T>]
}

export const ListboxItem = defineComponent({
  name: 'ListboxItem',
  props: {
    value: { type: null, required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'div',
    },
  },
  emits: ['select'],
  setup(props, { emit, slots, attrs }) {
    const id = useId(undefined, 'reka-listbox-item')
    const { CollectionItem } = useCollection()
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectListboxRootContext()

    const isHighlighted = computed(
      () =>
        currentElement.value != null &&
        currentElement.value === rootContext.highlightedElement.value,
    )
    const isSelected = computed(() =>
      valueComparator(rootContext.modelValue.value, props.value, rootContext.by),
    )
    const disabled = computed(() => rootContext.disabled.value || props.disabled)

    function handleSelect(event: ListboxSelectEvent) {
      emit('select', event)
      if (event?.defaultPrevented) return
      if (!disabled.value && event) {
        rootContext.onValueChange(props.value)
        rootContext.changeHighlight(currentElement.value)
      }
    }

    function handleSelectCustomEvent(event: Event) {
      dispatchListboxSelect(event, props.value, handleSelect)
    }

    const onKeydown = withKeys(withModifiers(handleSelectCustomEvent, ['prevent']), ['space'])
    const onPointermove = () => {
      if (rootContext.highlightedElement.value === currentElement.value) return
      if (rootContext.highlightOnHover.value)
        rootContext.changeHighlight(currentElement.value, false, false)
    }

    provideListboxItemContext({ isSelected })

    const cache: VNode[] = []

    return () =>
      h(
        CollectionItem,
        { value: props.value },
        {
          default: withCtx(() => [
            withMemo(
              [isHighlighted.value, isSelected.value, disabled.value, rootContext.focusable.value],
              () =>
                h(
                  Primitive,
                  mergeProps({ id }, attrs, {
                    ref: forwardRef,
                    role: 'option',
                    tabindex: listboxItemTabIndex(rootContext.focusable.value, isHighlighted.value),
                    'aria-selected': isSelected.value,
                    as: props.as,
                    'as-child': props.asChild,
                    disabled: disabled.value ? '' : undefined,
                    'data-disabled': disabled.value ? '' : undefined,
                    'data-highlighted': isHighlighted.value ? '' : undefined,
                    'data-state': isSelected.value ? 'checked' : 'unchecked',
                    onClick: handleSelectCustomEvent,
                    onKeydown,
                    onPointermove,
                  }),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
              cache,
              1,
            ),
          ]),
        },
      )
  },
})
