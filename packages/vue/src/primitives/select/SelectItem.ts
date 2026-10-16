import {
  computed,
  createCommentVNode,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  renderSlot,
  toRefs,
  withCtx,
  withModifiers,
} from 'vue'
import { handleAndDispatchCustomEvent } from '../../../../shared/src/primitives/dismissable-layer'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import { valueComparator } from '../../../../shared/src/primitives/listbox'
import { SELECT_SELECT, SELECTION_KEYS } from '../../../../shared/src/primitives/select'
import { useCollection } from '../collection'
import { Primitive } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import {
  injectSelectContentContext,
  injectSelectItemContext,
  injectSelectRootContext,
  provideSelectItemContext,
} from './context'
import { primitive } from './SelectRoot'

export type SelectItemSelectEvent<T = unknown> = CustomEvent<{ originalEvent: Event; value?: T }>

export const SelectItem = defineComponent({
  name: 'SelectItem',
  props: {
    value: { type: null, required: true },
    disabled: { type: Boolean, required: false },
    textValue: { type: String, required: false },
    ...primitive(),
  },
  emits: ['select'],
  setup(props, { emit, slots }) {
    const { disabled } = toRefs(props)
    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext()
    const { forwardRef, currentElement } = useForwardExpose()
    const { CollectionItem } = useCollection()
    const isSelected = computed(() =>
      valueComparator(rootContext.modelValue?.value, props.value, rootContext.by),
    )
    const isFocused = ref(false)
    const textValue = ref(props.textValue ?? '')
    const textId = useId(undefined, 'reka-select-item-text')

    async function handleSelectCustomEvent(event: Event) {
      if (event.defaultPrevented) return
      const eventDetail = { originalEvent: event, value: props.value }
      handleAndDispatchCustomEvent(SELECT_SELECT, handleSelect, eventDetail)
    }

    async function handleSelect(event: SelectItemSelectEvent) {
      await nextTick()
      emit('select', event)
      if (event.defaultPrevented) return
      if (!disabled.value) {
        rootContext.onValueChange(props.value)
        if (!rootContext.multiple.value) rootContext.onOpenChange(false)
      }
    }

    async function handlePointerMove(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented) return
      if (disabled.value) contentContext.onItemLeave?.()
      else (event.currentTarget as HTMLElement | null)?.focus({ preventScroll: true })
    }

    async function handlePointerLeave(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented) return
      if (event.currentTarget === getActiveElement()) contentContext.onItemLeave?.()
    }

    async function handleKeyDown(event: KeyboardEvent) {
      await nextTick()
      if (event.defaultPrevented) return
      const isTypingAhead = contentContext.searchRef?.search !== ''
      if (isTypingAhead && event.key === ' ') return
      if (SELECTION_KEYS.includes(event.key)) handleSelectCustomEvent(event)
      if (event.key === ' ') event.preventDefault()
    }

    if (props.value === '')
      throw new Error(
        'A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
      )

    onMounted(() => {
      if (!currentElement.value) return
      contentContext.itemRefCallback(currentElement.value, props.value, props.disabled)
    })

    provideSelectItemContext({
      value: props.value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: node => {
        textValue.value = ((textValue.value || node?.textContent) ?? '').trim()
      },
    })

    return () =>
      h(
        CollectionItem,
        { value: { textValue: textValue.value } },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                role: 'option',
                'aria-labelledby': textId,
                'data-highlighted': isFocused.value ? '' : undefined,
                'aria-selected': isSelected.value,
                'data-state': isSelected.value ? 'checked' : 'unchecked',
                'aria-disabled': disabled.value || undefined,
                'data-disabled': disabled.value ? '' : undefined,
                tabindex: disabled.value ? undefined : -1,
                as: props.as,
                'as-child': props.asChild,
                onFocus: () => (isFocused.value = true),
                onBlur: () => (isFocused.value = false),
                onPointerup: handleSelectCustomEvent,
                onPointerdown: (event: PointerEvent) => {
                  ;(event.currentTarget as HTMLElement).focus({ preventScroll: true })
                },
                onTouchend: withModifiers(() => {}, ['prevent', 'stop']),
                onPointermove: handlePointerMove,
                onPointerleave: handlePointerLeave,
                onKeydown: handleKeyDown,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const SelectItemText = defineComponent({
  name: 'SelectItemText',
  inheritAttrs: false,
  props: primitive('span'),
  setup(props, { attrs, slots }) {
    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext()
    const itemContext = injectSelectItemContext()
    const { forwardRef, currentElement: itemTextElement } = useForwardExpose()
    const optionProps = computed(() => ({
      value: itemContext.value,
      disabled: itemContext.disabled.value,
      textContent: itemTextElement.value?.textContent ?? itemContext.value?.toString() ?? '',
    }))

    onMounted(() => {
      if (!itemTextElement.value) return
      itemContext.onItemTextChange(itemTextElement.value)
      contentContext.itemTextRefCallback(
        itemTextElement.value,
        itemContext.value,
        itemContext.disabled.value,
      )
      rootContext.onOptionAdd(optionProps.value)
    })

    onUnmounted(() => {
      rootContext.onOptionRemove(optionProps.value)
    })

    return () =>
      h(
        Primitive,
        mergeProps({ id: itemContext.textId, ref: forwardRef }, { ...props, ...attrs }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const SelectItemIndicator = defineComponent({
  name: 'SelectItemIndicator',
  props: primitive('span'),
  setup(props, { slots }) {
    const itemContext = injectSelectItemContext()
    return () =>
      itemContext.isSelected.value
        ? h(Primitive, mergeProps({ key: 0, 'aria-hidden': 'true' }, props), {
            default: withCtx(() => [renderSlot(slots, 'default')]),
          })
        : createCommentVNode('v-if', true)
  },
})
