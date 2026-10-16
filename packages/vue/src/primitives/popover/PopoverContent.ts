import {
  computed,
  defineComponent,
  h,
  mergeProps,
  ref,
  renderSlot,
  withCtx,
  withModifiers,
  type Component,
} from 'vue'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '../dismissable-layer'
import { PopperContent, popperContentProps, type PopperContentProps } from '../popper'
import { Presence } from '../presence'
import { DismissableLayer, FocusScope, useBodyScrollLock, useFocusGuards } from '../utils/layers'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardProps } from '../utils/useForwardProps'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useHideOthers } from '../utils/useHideOthers'
import { useId } from '../utils/useId'
import { injectPopoverRootContext } from './context'

type OutsideEvent = CustomEvent<{ originalEvent: PointerEvent | FocusEvent }>

const contentEmits = [
  'escapeKeyDown',
  'pointerDownOutside',
  'focusOutside',
  'interactOutside',
  'openAutoFocus',
  'closeAutoFocus',
]

const contentProps = {
  ...propsWithoutDefaults(popperContentProps),
  disableOutsidePointerEvents: { type: Boolean, required: false },
} as const

const PopoverContentImpl = defineComponent({
  name: 'PopoverContentImpl',
  props: { trapFocus: { type: Boolean, required: false }, ...contentProps },
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardProps(
      computed(() => {
        const { trapFocus: _, disableOutsidePointerEvents: __, ...rest } = props
        return rest
      }),
    )
    const { forwardRef } = useForwardExpose()
    const rootContext = injectPopoverRootContext()
    useFocusGuards()

    return () =>
      h(
        FocusScope as Component,
        {
          'as-child': '',
          loop: '',
          trapped: props.trapFocus,
          onMountAutoFocus: (event: Event) => emit('openAutoFocus', event),
          onUnmountAutoFocus: (event: Event) => emit('closeAutoFocus', event),
        },
        {
          default: withCtx(() => [
            h(
              DismissableLayer as Component,
              {
                'as-child': '',
                'disable-outside-pointer-events': props.disableOutsidePointerEvents,
                onPointerDownOutside: (event: Event) => emit('pointerDownOutside', event),
                onInteractOutside: (event: Event) => emit('interactOutside', event),
                onEscapeKeyDown: (event: Event) => emit('escapeKeyDown', event),
                onFocusOutside: (event: Event) => emit('focusOutside', event),
                onDismiss: () => rootContext.onOpenChange(false),
              },
              {
                default: withCtx(() => [
                  h(
                    PopperContent as Component,
                    mergeProps(forwarded.value, {
                      id: rootContext.contentId,
                      ref: forwardRef,
                      'data-state': rootContext.open.value ? 'open' : 'closed',
                      'aria-labelledby': rootContext.triggerId,
                      style: {
                        '--reka-popover-content-transform-origin':
                          'var(--reka-popper-transform-origin)',
                        '--reka-popover-content-available-width':
                          'var(--reka-popper-available-width)',
                        '--reka-popover-content-available-height':
                          'var(--reka-popper-available-height)',
                        '--reka-popover-trigger-width': 'var(--reka-popper-anchor-width)',
                        '--reka-popover-trigger-height': 'var(--reka-popper-anchor-height)',
                      },
                      role: 'dialog',
                    }),
                    { default: withCtx(() => [renderSlot(slots, 'default')]) },
                  ),
                ]),
              },
            ),
          ]),
        },
      )
  },
})

const PopoverContentModal = defineComponent({
  name: 'PopoverContentModal',
  props: contentProps,
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const rootContext = injectPopoverRootContext()
    const isRightClickOutside = ref(false)
    useBodyScrollLock(true)
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const { forwardRef, currentElement } = useForwardExpose()
    useHideOthers(currentElement)

    const onCloseAutoFocus = withModifiers(
      ((event: Event) => {
        emit('closeAutoFocus', event)
        if (!isRightClickOutside.value) rootContext.triggerElement.value?.focus()
      }) as (event: Event) => void,
      ['prevent'],
    )
    const onPointerDownOutside = (event: OutsideEvent) => {
      emit('pointerDownOutside', event)
      const originalEvent = event.detail.originalEvent as PointerEvent
      const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
      isRightClickOutside.value = originalEvent.button === 2 || ctrlLeftClick
    }
    const onFocusOutside = withModifiers(() => {}, ['prevent'])

    return () =>
      h(
        PopoverContentImpl as Component,
        mergeProps(forwarded.value, {
          ref: forwardRef,
          'trap-focus': rootContext.open.value,
          'disable-outside-pointer-events': '',
          onCloseAutoFocus,
          onPointerDownOutside,
          onFocusOutside,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

const PopoverContentNonModal = defineComponent({
  name: 'PopoverContentNonModal',
  props: contentProps,
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const rootContext = injectPopoverRootContext()
    const hasInteractedOutside = ref(false)
    const hasPointerDownOutside = ref(false)
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)

    const onCloseAutoFocus = (event: Event) => {
      emit('closeAutoFocus', event)
      if (!event.defaultPrevented) {
        if (!hasInteractedOutside.value) rootContext.triggerElement.value?.focus()
        event.preventDefault()
      }
      hasInteractedOutside.value = false
      hasPointerDownOutside.value = false
    }
    const onInteractOutside = async (event: OutsideEvent) => {
      emit('interactOutside', event)
      if (!event.defaultPrevented) {
        hasInteractedOutside.value = true
        if (event.detail.originalEvent.type === 'pointerdown') hasPointerDownOutside.value = true
      }
      const target = event.target as HTMLElement
      if (rootContext.triggerElement.value?.contains(target)) event.preventDefault()
      if (event.detail.originalEvent.type === 'focusin' && hasPointerDownOutside.value)
        event.preventDefault()
    }

    return () =>
      h(
        PopoverContentImpl as Component,
        mergeProps(forwarded.value, {
          'trap-focus': false,
          'disable-outside-pointer-events': false,
          onCloseAutoFocus,
          onInteractOutside,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const PopoverContent = defineComponent({
  name: 'PopoverContent',
  props: { forceMount: { type: Boolean, required: false }, ...contentProps },
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const rootContext = injectPopoverRootContext()
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const { forwardRef } = useForwardExpose()
    rootContext.contentId ||= useId(undefined, 'reka-popover-content')

    return () =>
      h(
        Presence,
        { present: props.forceMount || rootContext.open.value },
        {
          default: withCtx(() => [
            rootContext.modal.value
              ? h(
                  PopoverContentModal as Component,
                  mergeProps({ key: 0 }, forwarded.value, { ref: forwardRef }),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                )
              : h(
                  PopoverContentNonModal as Component,
                  mergeProps({ key: 1 }, forwarded.value, { ref: forwardRef }),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
          ]),
        },
      )
  },
})

export interface PopoverContentProps extends PopperContentProps {
  forceMount?: boolean
  disableOutsidePointerEvents?: boolean
}

export type PopoverContentEmits = {
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: PointerDownOutsideEvent]
  focusOutside: [event: FocusOutsideEvent]
  interactOutside: [event: PointerDownOutsideEvent | FocusOutsideEvent]
  openAutoFocus: [event: Event]
  closeAutoFocus: [event: Event]
}
