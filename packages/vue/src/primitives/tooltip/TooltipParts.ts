import {
  computed,
  createTextVNode,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  onMounted,
  ref,
  renderSlot,
  resolveDynamicComponent,
  toDisplayString,
  toHandlers,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import { PopperAnchor, PopperArrow, PopperContent } from '../popper'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { defu } from '../utils/defu'
import { DismissableLayer } from '../utils/layers'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardProps } from '../utils/useForwardProps'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'
import { useGraceArea } from '../utils/useGraceArea'
import { useId } from '../utils/useId'
import { VisuallyHidden } from '../visually-hidden'
import { injectTooltipProviderContext, injectTooltipRootContext, TOOLTIP_OPEN } from './context'

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

export const TooltipTrigger = defineComponent({
  name: 'TooltipTrigger',
  props: { reference: { type: null, required: false }, ...primitive('button') },
  setup(props, { slots }) {
    const rootContext = injectTooltipRootContext()
    const providerContext = injectTooltipProviderContext()
    rootContext.contentId ||= useId(undefined, 'reka-tooltip-content')
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const isPointerDown = ref(false)
    const hasPointerMoveOpened = ref(false)

    function handlePointerUp() {
      setTimeout(() => {
        isPointerDown.value = false
      }, 1)
    }
    function handlePointerDown() {
      if (rootContext.open && !rootContext.disableClosingTrigger.value) rootContext.onClose()
      isPointerDown.value = true
      document.addEventListener('pointerup', handlePointerUp, { once: true })
    }
    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      if (!hasPointerMoveOpened.value && !providerContext.isPointerInTransitRef.value) {
        rootContext.onTriggerEnter()
        hasPointerMoveOpened.value = true
      }
    }
    function handlePointerLeave() {
      rootContext.onTriggerLeave()
      hasPointerMoveOpened.value = false
    }
    function handleFocus(event: FocusEvent) {
      if (isPointerDown.value) return
      if (
        rootContext.ignoreNonKeyboardFocus.value &&
        !(event.target as HTMLElement).matches?.(':focus-visible')
      )
        return
      rootContext.onOpen()
    }
    function handleBlur() {
      rootContext.onClose()
    }
    function handleClick() {
      if (!rootContext.disableClosingTrigger.value) rootContext.onClose()
    }

    const tooltipListeners = computed(() =>
      rootContext.disabled.value
        ? {}
        : {
            click: handleClick,
            focus: handleFocus,
            pointermove: handlePointerMove,
            pointerleave: handlePointerLeave,
            pointerdown: handlePointerDown,
            blur: handleBlur,
          },
    )

    onMounted(() => rootContext.onTriggerChange(triggerElement.value))

    return () =>
      h(
        PopperAnchor as Component,
        { 'as-child': '', reference: props.reference },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(
                {
                  ref: forwardRef,
                  'aria-describedby': rootContext.open.value ? rootContext.contentId : undefined,
                  'data-state': rootContext.stateAttribute.value,
                  as: props.as,
                  'as-child': props.asChild,
                  'data-grace-area-trigger': '',
                },
                toHandlers(tooltipListeners.value),
              ),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

const contentImplProps = {
  ariaLabel: { type: String, required: false },
  asChild: { type: Boolean, required: false, default: undefined },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  side: { type: null, required: false },
  sideOffset: { type: Number, required: false },
  align: { type: null, required: false },
  alignOffset: { type: Number, required: false },
  avoidCollisions: { type: Boolean, required: false, default: undefined },
  collisionBoundary: { type: null, required: false },
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<string, number>>>,
    required: false,
  },
  arrowPadding: { type: Number, required: false },
  sticky: { type: String, required: false },
  hideWhenDetached: { type: Boolean, required: false, default: undefined },
  positionStrategy: { type: String, required: false },
  updatePositionStrategy: { type: String, required: false },
} as const

const TOOLTIP_DEFAULTS = {
  side: 'top',
  sideOffset: 0,
  align: 'center',
  avoidCollisions: true,
  collisionBoundary: [],
  collisionPadding: 0,
  arrowPadding: 0,
  sticky: 'partial',
  hideWhenDetached: false,
}

const TooltipContentImpl = defineComponent({
  name: 'TooltipContentImpl',
  props: contentImplProps,
  emits: ['escapeKeyDown', 'pointerDownOutside'],
  setup(props, { emit, slots, attrs }) {
    const rootContext = injectTooltipRootContext()
    const providerContext = injectTooltipProviderContext()
    const { forwardRef, currentElement } = useForwardExpose()
    const ariaLabel = computed(() => props.ariaLabel || currentElement.value?.textContent)
    const popperContentProps = computed(() => {
      const { ariaLabel: _, ...restProps } = props
      return defu(restProps, providerContext.content.value ?? {}, TOOLTIP_DEFAULTS)
    })

    onMounted(() => {
      useEventListener(
        window,
        'scroll',
        event => {
          const target = event.target as HTMLElement
          if (target?.contains(rootContext.trigger.value!)) rootContext.onClose()
        },
        { capture: true },
      )
      useEventListener(document, TOOLTIP_OPEN, rootContext.onClose)
    })

    const onPointerDownOutside = (event: CustomEvent) => {
      if (
        rootContext.disableClosingTrigger.value &&
        rootContext.trigger.value?.contains(event.target as HTMLElement)
      )
        event.preventDefault()
      emit('pointerDownOutside', event)
    }

    return () =>
      h(
        DismissableLayer as Component,
        {
          'as-child': '',
          'disable-outside-pointer-events': false,
          onEscapeKeyDown: (event: Event) => emit('escapeKeyDown', event),
          onPointerDownOutside,
          onFocusOutside: withModifiers(() => {}, ['prevent']),
          onDismiss: () => rootContext.onClose(),
        },
        {
          default: withCtx(() => [
            h(
              PopperContent as Component,
              mergeProps(
                { ref: forwardRef, 'data-state': rootContext.stateAttribute.value },
                { ...attrs, ...popperContentProps.value },
                {
                  style: {
                    '--reka-tooltip-content-transform-origin':
                      'var(--reka-popper-transform-origin)',
                    '--reka-tooltip-content-available-width': 'var(--reka-popper-available-width)',
                    '--reka-tooltip-content-available-height':
                      'var(--reka-popper-available-height)',
                    '--reka-tooltip-trigger-width': 'var(--reka-popper-anchor-width)',
                    '--reka-tooltip-trigger-height': 'var(--reka-popper-anchor-height)',
                  },
                },
              ),
              {
                default: withCtx(() => [
                  renderSlot(slots, 'default'),
                  h(
                    VisuallyHidden as Component,
                    { id: rootContext.contentId, role: 'tooltip' },
                    {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(ariaLabel.value), 1),
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

const TooltipContentHoverable = defineComponent({
  name: 'TooltipContentHoverable',
  props: contentImplProps,
  setup(props, { slots }) {
    const forwardedProps = useForwardProps(props)
    const { forwardRef, currentElement } = useForwardExpose()
    const { trigger, onClose } = injectTooltipRootContext()
    const providerContext = injectTooltipProviderContext()
    const { isPointerInTransit, onPointerExit } = useGraceArea(trigger, currentElement)
    providerContext.isPointerInTransitRef = isPointerInTransit
    onPointerExit(() => onClose())
    return () =>
      h(TooltipContentImpl as Component, mergeProps({ ref: forwardRef }, forwardedProps.value), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const TooltipContent = defineComponent({
  name: 'TooltipContent',
  props: {
    forceMount: { type: Boolean, required: false },
    ariaLabel: { type: String, required: false },
    ...primitive(),
    side: { type: null, required: false },
    sideOffset: { type: Number, required: false },
    align: { type: null, required: false },
    alignOffset: { type: Number, required: false },
    avoidCollisions: { type: Boolean, required: false },
    collisionBoundary: { type: null, required: false },
    collisionPadding: {
      type: [Number, Object] as PropType<number | Partial<Record<string, number>>>,
      required: false,
    },
    arrowPadding: { type: Number, required: false },
    sticky: { type: String, required: false },
    hideWhenDetached: { type: Boolean, required: false },
    positionStrategy: { type: String, required: false },
    updatePositionStrategy: { type: String, required: false },
  },
  emits: ['escapeKeyDown', 'pointerDownOutside'],
  setup(props, { emit, slots }) {
    const rootContext = injectTooltipRootContext()
    const forwarded = useForwardPropsEmits(props, emit as (name: string) => void)
    const { forwardRef } = useForwardExpose()
    return () =>
      h(
        Presence,
        { present: props.forceMount || rootContext.open.value },
        {
          default: withCtx(() => [
            h(
              resolveDynamicComponent(
                rootContext.disableHoverableContent.value
                  ? TooltipContentImpl
                  : TooltipContentHoverable,
              ) as Component,
              mergeProps({ ref: forwardRef }, forwarded.value),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const TooltipArrow = defineComponent({
  name: 'TooltipArrow',
  props: {
    width: { type: Number, required: false, default: 10 },
    height: { type: Number, required: false, default: 5 },
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

export const TooltipPortal = defineComponent({
  name: 'TooltipPortal',
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
