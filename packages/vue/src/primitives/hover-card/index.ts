import {
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  nextTick,
  normalizeProps,
  onMounted,
  onUnmounted,
  ref,
  renderSlot,
  toRefs,
  watchEffect,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import { syncRef, useEventListener } from '@vueuse/core'
import { PopperAnchor, PopperArrow, PopperContent, PopperRoot, popperContentProps } from '../popper'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { createContext } from '../utils/createContext'
import { DismissableLayer } from '../utils/layers'
import { propsWithoutDefaults } from '../utils/propsWithoutDefaults'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardProps } from '../utils/useForwardProps'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useGraceArea } from '../utils/useGraceArea'
import { useVModel } from '../utils/useVModel'

export interface HoverCardRootContext {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  onOpen: () => void
  onClose: () => void
  onDismiss: () => void
  hasSelectionRef: Ref<boolean>
  isPointerDownOnContentRef: Ref<boolean>
  isPointerInTransitRef: Ref<boolean>
  triggerElement: Ref<HTMLElement | undefined>
  enableTouch: Ref<boolean>
}

export const [injectHoverCardRootContext, provideHoverCardRootContext] =
  createContext<HoverCardRootContext>('HoverCardRoot')

function excludeTouch(eventHandler: () => void) {
  return (event: PointerEvent) => (event.pointerType === 'touch' ? undefined : eventHandler())
}

function getTabbableNodes(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) =>
      (node as HTMLElement).tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  return nodes
}

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

const contentEmits = ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside']
const contentProps = propsWithoutDefaults(popperContentProps)

export const HoverCardRoot = defineComponent({
  name: 'HoverCardRoot',
  props: {
    defaultOpen: { type: Boolean, required: false, default: false },
    open: { type: Boolean, required: false, default: undefined },
    openDelay: { type: Number, required: false, default: 700 },
    closeDelay: { type: Number, required: false, default: 300 },
    enableTouch: { type: Boolean, required: false, default: false },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const { openDelay, closeDelay, enableTouch } = toRefs(props)
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>
    const openTimer = ref(0)
    const closeTimer = ref(0)
    const hasSelectionRef = ref(false)
    const isPointerDownOnContentRef = ref(false)
    const isPointerInTransitRef = ref(false)
    const triggerElement = ref<HTMLElement>()

    function handleOpen() {
      clearTimeout(closeTimer.value)
      openTimer.value = window.setTimeout(() => (open.value = true), openDelay.value)
    }
    function handleClose() {
      clearTimeout(openTimer.value)
      if (!hasSelectionRef.value && !isPointerDownOnContentRef.value)
        closeTimer.value = window.setTimeout(() => (open.value = false), closeDelay.value)
    }
    function handleDismiss() {
      clearTimeout(openTimer.value)
      open.value = false
    }

    provideHoverCardRootContext({
      open,
      onOpenChange(value) {
        open.value = value
      },
      onOpen: handleOpen,
      onClose: handleClose,
      onDismiss: handleDismiss,
      hasSelectionRef,
      isPointerDownOnContentRef,
      isPointerInTransitRef,
      triggerElement,
      enableTouch,
    })

    return () =>
      h(PopperRoot, null, {
        default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]),
      })
  },
})

export const HoverCardTrigger = defineComponent({
  name: 'HoverCardTrigger',
  props: { reference: { type: null, required: false }, ...primitive('a') },
  setup(props, { slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectHoverCardRootContext()
    rootContext.triggerElement = currentElement as Ref<HTMLElement | undefined>

    function handleLeave() {
      setTimeout(() => {
        if (!rootContext.isPointerInTransitRef.value && !rootContext.open.value)
          rootContext.onClose()
      }, 0)
    }
    function handleTouch(event: PointerEvent) {
      if (!rootContext.enableTouch.value || event.pointerType !== 'touch') return
      if (rootContext.open.value) rootContext.onDismiss()
      else rootContext.onOpenChange(true)
    }

    return () =>
      h(
        PopperAnchor as Component,
        { 'as-child': '', reference: props.reference },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                ref: forwardRef,
                'as-child': props.asChild,
                as: props.as,
                'data-state': rootContext.open.value ? 'open' : 'closed',
                'data-grace-area-trigger': '',
                onPointerenter: (event: PointerEvent) => excludeTouch(rootContext.onOpen)(event),
                onPointerleave: (event: PointerEvent) => excludeTouch(handleLeave)(event),
                onPointerup: handleTouch,
                onFocus: () => rootContext.onOpen(),
                onBlur: () => rootContext.onClose(),
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

const HoverCardContentImpl = defineComponent({
  name: 'HoverCardContentImpl',
  props: contentProps,
  emits: contentEmits,
  setup(props, { emit, slots, attrs }) {
    const forwarded = useForwardProps(props)
    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    const rootContext = injectHoverCardRootContext()
    const { isPointerInTransit, onPointerExit } = useGraceArea(
      rootContext.triggerElement,
      contentElement as Ref<HTMLElement | undefined>,
    )
    syncRef(rootContext.isPointerInTransitRef, isPointerInTransit, { direction: 'rtl' })
    onPointerExit(() => rootContext.onClose())

    const containSelection = ref(false)
    let originalBodyUserSelect: string
    watchEffect(onCleanup => {
      if (!containSelection.value) return
      const body = document.body
      originalBodyUserSelect = body.style.userSelect || body.style.webkitUserSelect
      body.style.userSelect = 'none'
      body.style.webkitUserSelect = 'none'
      onCleanup(() => {
        body.style.userSelect = originalBodyUserSelect
        body.style.webkitUserSelect = originalBodyUserSelect
      })
    })

    function handlePointerUp() {
      containSelection.value = false
      rootContext.isPointerDownOnContentRef.value = false
      void nextTick(() => {
        if (document.getSelection()?.toString() !== '') rootContext.hasSelectionRef.value = true
      })
    }

    onMounted(() => {
      if (contentElement.value) {
        document.addEventListener('pointerup', handlePointerUp)
        for (const tabbable of getTabbableNodes(contentElement.value))
          tabbable.setAttribute('tabindex', '-1')
      }
      useEventListener(
        window,
        'scroll',
        (event: Event) => {
          const target = event.target as HTMLElement
          if (target?.contains(rootContext.triggerElement.value!)) rootContext.onDismiss()
        },
        { capture: true },
      )
    })

    onUnmounted(() => {
      document.removeEventListener('pointerup', handlePointerUp)
      rootContext.hasSelectionRef.value = false
      rootContext.isPointerDownOnContentRef.value = false
    })

    const onPointerdown = (event: PointerEvent) => {
      if ((event.currentTarget as HTMLElement).contains(event.target as HTMLElement))
        containSelection.value = true
      rootContext.hasSelectionRef.value = false
      rootContext.isPointerDownOnContentRef.value = true
    }

    return () =>
      h(
        DismissableLayer as Component,
        {
          'as-child': '',
          'disable-outside-pointer-events': false,
          onEscapeKeyDown: (event: Event) => emit('escapeKeyDown', event),
          onPointerDownOutside: (event: Event) => emit('pointerDownOutside', event),
          onFocusOutside: withModifiers(
            ((event: Event) => emit('focusOutside', event)) as (event: Event) => void,
            ['prevent'],
          ),
          onDismiss: rootContext.onDismiss,
        },
        {
          default: withCtx(() => [
            h(
              PopperContent as Component,
              mergeProps(
                { ...forwarded.value, ...attrs },
                {
                  ref: forwardRef,
                  'data-state': rootContext.open.value ? 'open' : 'closed',
                  style: {
                    userSelect: containSelection.value ? 'text' : undefined,
                    WebkitUserSelect: containSelection.value ? 'text' : undefined,
                    '--reka-hover-card-content-transform-origin':
                      'var(--reka-popper-transform-origin)',
                    '--reka-hover-card-content-available-width':
                      'var(--reka-popper-available-width)',
                    '--reka-hover-card-content-available-height':
                      'var(--reka-popper-available-height)',
                    '--reka-hover-card-trigger-width': 'var(--reka-popper-anchor-width)',
                    '--reka-hover-card-trigger-height': 'var(--reka-popper-anchor-height)',
                  },
                  onPointerdown,
                },
              ),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const HoverCardContent = defineComponent({
  name: 'HoverCardContent',
  props: { forceMount: { type: Boolean, required: false }, ...contentProps },
  emits: contentEmits,
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const { forwardRef } = useForwardExpose()
    const rootContext = injectHoverCardRootContext()
    return () =>
      h(
        Presence,
        { present: props.forceMount || rootContext.open.value },
        {
          default: withCtx(() => [
            h(
              HoverCardContentImpl as Component,
              mergeProps(forwarded.value, {
                ref: forwardRef,
                onPointerenter: (event: PointerEvent) => excludeTouch(rootContext.onOpen)(event),
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const HoverCardArrow = defineComponent({
  name: 'HoverCardArrow',
  props: {
    width: { type: Number, required: false, default: 10 },
    height: { type: Number, required: false, default: 5 },
    rounded: { type: Boolean, required: false },
    ...primitive('svg'),
  },
  setup(props, { slots }) {
    useForwardExpose()
    return () =>
      h(PopperArrow as Component, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const HoverCardPortal = defineComponent({
  name: 'HoverCardPortal',
  props: {
    to: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    defer: { type: Boolean, required: false },
    forceMount: { type: Boolean, required: false },
  },
  setup(props, { slots }) {
    return () =>
      h(Teleport as Component, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
