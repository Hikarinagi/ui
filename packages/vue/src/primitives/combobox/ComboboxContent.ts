import {
  computed,
  defineComponent,
  h,
  mergeProps,
  onMounted,
  onUnmounted,
  ref,
  renderSlot,
  toHandlers,
  toRefs,
  watch,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
} from 'vue'
import { isTargetWithinCombobox } from '../../../../shared/src/primitives/combobox'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import { ListboxContent } from '../listbox'
import { PopperContent, popperContentProps } from '../popper'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { DismissableLayer, FocusScope, useBodyScrollLock, useFocusGuards } from '../utils/layers'
import type { Direction } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardProps } from '../utils/useForwardProps'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useHideOthers } from '../utils/useHideOthers'
import { useId } from '../utils/useId'
import {
  injectComboboxRootContext,
  provideComboboxContentContext,
  type ComboboxContentPosition,
} from './context'

const contentEmits = ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside']

const contentProps = {
  position: { type: String as PropType<ComboboxContentPosition>, required: false },
  bodyLock: { type: Boolean, required: false },
  hideWhenEmpty: { type: Boolean, required: false },
  ...propsWithoutDefaults(popperContentProps),
  dir: { type: String as PropType<Direction>, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  disableOutsidePointerEvents: { type: Boolean, required: false },
}

const popperStyle = {
  boxSizing: 'border-box',
  '--reka-combobox-content-transform-origin': 'var(--reka-popper-transform-origin)',
  '--reka-combobox-content-available-width': 'var(--reka-popper-available-width)',
  '--reka-combobox-content-available-height': 'var(--reka-popper-available-height)',
  '--reka-combobox-trigger-width': 'var(--reka-popper-anchor-width)',
  '--reka-combobox-trigger-height': 'var(--reka-popper-anchor-height)',
}

const ComboboxContentImpl = defineComponent({
  name: 'ComboboxContentImpl',
  props: { ...contentProps, position: { ...contentProps.position, default: 'inline' } },
  emits: contentEmits,
  setup(props, { attrs, emit, slots }) {
    const { position } = toRefs(props)
    const rootContext = injectComboboxRootContext()
    const contentId = Symbol('ComboboxContent')
    watch(position, value => rootContext.onContentPositionChange(contentId, value), {
      immediate: true,
    })
    const isEmpty = computed(() =>
      rootContext.ignoreFilter.value
        ? rootContext.allItems.value.size === 0
        : rootContext.filterState.value.count === 0,
    )
    const { forwardRef, currentElement } = useForwardExpose()
    useBodyScrollLock(props.bodyLock)
    useFocusGuards()
    useHideOthers(rootContext.parentElement)

    const forwardedProps = useForwardProps(props.position === 'popper' ? props : {})

    provideComboboxContentContext({ position })

    const isInputWithinContent = ref(false)

    onMounted(() => {
      if (rootContext.inputElement.value) {
        isInputWithinContent.value = currentElement.value!.contains(rootContext.inputElement.value)
        if (isInputWithinContent.value) rootContext.inputElement.value.focus()
      }
    })

    onUnmounted(() => {
      rootContext.onContentUnmount(contentId)
      const activeElement = getActiveElement()
      if (isInputWithinContent.value && (!activeElement || activeElement === document.body))
        rootContext.triggerElement.value?.focus()
    })

    const popperContentEvents = { placed: () => rootContext.onContentPlaced(contentId) }

    return () =>
      h(
        ListboxContent as Component,
        { 'as-child': '' },
        {
          default: withCtx(() => [
            h(
              FocusScope as Component,
              {
                'as-child': '',
                onMountAutoFocus: withModifiers(() => {}, ['prevent']),
                onUnmountAutoFocus: withModifiers(() => {}, ['prevent']),
              },
              {
                default: withCtx(() => [
                  h(
                    DismissableLayer as Component,
                    {
                      'as-child': '',
                      'disable-outside-pointer-events': props.disableOutsidePointerEvents,
                      onDismiss: () => rootContext.onOpenChange(false),
                      onFocusOutside: (event: Event) => {
                        if (isTargetWithinCombobox(rootContext.parentElement.value, event.target))
                          event.preventDefault()
                        emit('focusOutside', event)
                      },
                      onInteractOutside: (event: Event) => emit('interactOutside', event),
                      onEscapeKeyDown: (event: Event) => emit('escapeKeyDown', event),
                      onPointerDownOutside: (event: Event) => {
                        if (isTargetWithinCombobox(rootContext.parentElement.value, event.target))
                          event.preventDefault()
                        emit('pointerDownOutside', event)
                      },
                    },
                    {
                      default: withCtx(() => [
                        h(
                          (position.value === 'popper' ? PopperContent : Primitive) as Component,
                          mergeProps(
                            { ...attrs, ...forwardedProps.value },
                            {
                              id: rootContext.contentId,
                              ref: forwardRef,
                              'memo-dependencies':
                                position.value === 'popper'
                                  ? [rootContext.filterSearch.value, rootContext.filterState.value]
                                  : undefined,
                              'data-state': rootContext.open.value ? 'open' : 'closed',
                              'data-empty': isEmpty.value ? '' : undefined,
                              style: {
                                display: props.hideWhenEmpty && isEmpty.value ? 'none' : 'flex',
                                flexDirection: 'column',
                                outline: 'none',
                                ...(position.value === 'popper' ? popperStyle : {}),
                              },
                            },
                            toHandlers(position.value === 'popper' ? popperContentEvents : {}),
                          ),
                          { default: withCtx(() => [renderSlot(slots, 'default')]) },
                        ),
                      ]),
                    },
                  ),
                ]),
              },
            ),
          ]),
        },
      )
  },
})

export const ComboboxContent = defineComponent({
  name: 'ComboboxContent',
  props: { forceMount: { type: Boolean, required: false }, ...contentProps },
  emits: contentEmits,
  setup(props, { attrs, emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const { forwardRef } = useForwardExpose()
    const rootContext = injectComboboxRootContext()
    rootContext.contentId ||= useId(undefined, 'reka-combobox-content')
    return () =>
      h(
        Presence,
        { present: props.forceMount || rootContext.open.value },
        {
          default: withCtx(() => [
            h(
              ComboboxContentImpl as Component,
              mergeProps({ ...forwarded.value, ...attrs }, { ref: forwardRef }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
