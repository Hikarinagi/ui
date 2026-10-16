import {
  computed,
  createCommentVNode,
  createTextVNode,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  onMounted,
  onUnmounted,
  renderSlot,
  toDisplayString,
  withCtx,
  withMemo,
  type Component,
  type VNode,
} from 'vue'
import { ListboxGroup, ListboxItem, ListboxItemIndicator } from '../listbox'
import { Primitive } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import {
  injectComboboxGroupContext,
  injectComboboxRootContext,
  provideComboboxGroupContext,
} from './context'
import { primitive } from './ComboboxRoot'

export type ComboboxItemSelectEvent<T = unknown> = CustomEvent<{ originalEvent: Event; value?: T }>

export const ComboboxEmpty = defineComponent({
  name: 'ComboboxEmpty',
  props: primitive(),
  setup(props, { slots }) {
    const rootContext = injectComboboxRootContext()
    const isRender = computed(() =>
      rootContext.ignoreFilter.value
        ? rootContext.allItems.value.size === 0
        : rootContext.filterState.value.count === 0,
    )
    return () =>
      isRender.value
        ? h(Primitive, normalizeProps(mergeProps({ key: 0 }, props)), {
            default: withCtx(() => [
              renderSlot(slots, 'default', {}, () => [createTextVNode('No options')]),
            ]),
          })
        : createCommentVNode('v-if', true)
  },
})

export const ComboboxGroup = defineComponent({
  name: 'ComboboxGroup',
  props: primitive(),
  setup(props, { slots }) {
    const id = useId(undefined, 'reka-combobox-group')
    const rootContext = injectComboboxRootContext()
    const isRender = computed(() =>
      rootContext.ignoreFilter.value
        ? true
        : !rootContext.filterSearch.value
          ? true
          : rootContext.filterState.value.groups.has(id),
    )
    const context = provideComboboxGroupContext({ id, labelId: '' })

    onMounted(() => {
      if (!rootContext.allGroups.value.has(id)) rootContext.allGroups.value.set(id, new Set())
    })

    onUnmounted(() => {
      rootContext.allGroups.value.delete(id)
    })

    return () =>
      h(
        ListboxGroup as Component,
        mergeProps({ id, 'aria-labelledby': context.labelId }, props, {
          hidden: isRender.value ? undefined : true,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ComboboxLabel = defineComponent({
  name: 'ComboboxLabel',
  props: { for: { type: String, required: false }, ...primitive('div') },
  setup(props, { slots }) {
    useForwardExpose()
    const groupContext = injectComboboxGroupContext({ id: '', labelId: '' })
    groupContext.labelId ||= useId(undefined, 'reka-combobox-group-label')
    return () =>
      h(Primitive, mergeProps(props, { id: groupContext.labelId }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const ComboboxItem = defineComponent({
  name: 'ComboboxItem',
  props: {
    textValue: { type: String, required: false },
    value: { type: null, required: true },
    disabled: { type: Boolean, required: false },
    ...primitive(),
  },
  emits: ['select'],
  setup(props, { attrs, emit, slots }) {
    const id = useId(undefined, 'reka-combobox-item')
    const rootContext = injectComboboxRootContext()
    const groupContext = injectComboboxGroupContext(null)
    const { primitiveElement, currentElement } = usePrimitiveElement()

    if (props.value === '')
      throw new Error(
        'A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.',
      )

    const isRender = computed(() => {
      if (
        rootContext.isVirtual.value ||
        rootContext.ignoreFilter.value ||
        !rootContext.filterSearch.value
      )
        return true
      const filteredCurrentItem = rootContext.filterState.value.items.get(id)
      if (filteredCurrentItem === undefined) return true
      return filteredCurrentItem > 0
    })

    onMounted(() => {
      rootContext.allItems.value.set(
        id,
        props.textValue || currentElement.value!.textContent || currentElement.value!.innerText,
      )
      const groupId = groupContext?.id
      if (groupId) {
        if (!rootContext.allGroups.value.has(groupId))
          rootContext.allGroups.value.set(groupId, new Set([id]))
        else rootContext.allGroups.value.get(groupId)?.add(id)
      }
    })

    onUnmounted(() => {
      rootContext.allItems.value.delete(id)
    })

    const onSelect = (event: ComboboxItemSelectEvent) => {
      emit('select', event)
      if (event.defaultPrevented) return
      if (!rootContext.multiple.value && !props.disabled && !rootContext.disabled.value) {
        event.preventDefault()
        rootContext.onOpenChange(false)
        rootContext.modelValue.value = props.value
      } else if (rootContext.multiple.value) rootContext.inputElement.value?.focus()
    }

    const cache: VNode[] = []

    return () =>
      isRender.value
        ? withMemo(
            [
              isRender.value,
              rootContext.filterSearch.value,
              rootContext.disabled.value,
              props.disabled,
              props.value,
              props.as,
              props.asChild,
              ...Object.values(attrs),
            ],
            () =>
              h(
                ListboxItem as Component,
                mergeProps({ key: 0 }, props, {
                  id,
                  ref: primitiveElement,
                  disabled: rootContext.disabled.value || props.disabled,
                  onSelect,
                }),
                {
                  default: withCtx(() => [
                    renderSlot(slots, 'default', {}, () => [
                      createTextVNode(toDisplayString(props.value), 1),
                    ]),
                  ]),
                },
              ),
            cache,
            1,
          )
        : createCommentVNode('v-if', true)
  },
})

export const ComboboxItemIndicator = defineComponent({
  name: 'ComboboxItemIndicator',
  props: primitive('span'),
  setup(props, { slots }) {
    return () =>
      h(ListboxItemIndicator as Component, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
