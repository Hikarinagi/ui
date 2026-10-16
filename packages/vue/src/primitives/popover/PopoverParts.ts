import {
  defineComponent,
  guardReactiveProps,
  h,
  normalizeProps,
  onBeforeMount,
  onMounted,
  onUnmounted,
  renderSlot,
  resolveDynamicComponent,
  withCtx,
  type Component,
  type PropType,
} from 'vue'
import { PopperAnchor, PopperArrow } from '../popper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { injectPopoverRootContext } from './context'

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

export const PopoverTrigger = defineComponent({
  name: 'PopoverTrigger',
  props: primitive('button'),
  setup(props, { slots }) {
    const rootContext = injectPopoverRootContext()
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    rootContext.triggerId ||= useId(undefined, 'reka-popover-trigger')
    rootContext.contentId ||= useId(undefined, 'reka-popover-content')
    onMounted(() => {
      rootContext.triggerElement.value = triggerElement.value
    })
    return () =>
      h(
        resolveDynamicComponent(
          rootContext.hasCustomAnchor.value ? Primitive : PopperAnchor,
        ) as Component,
        { 'as-child': '' },
        {
          default: withCtx(() => [
            h(
              Primitive,
              {
                id: rootContext.triggerId,
                ref: forwardRef,
                type: props.as === 'button' ? 'button' : undefined,
                'aria-haspopup': 'dialog',
                'aria-expanded': rootContext.open.value,
                'aria-controls': rootContext.open.value ? rootContext.contentId : undefined,
                'data-state': rootContext.open.value ? 'open' : 'closed',
                as: props.as,
                'as-child': props.asChild,
                onClick: rootContext.onOpenToggle,
              },
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const PopoverAnchor = defineComponent({
  name: 'PopoverAnchor',
  props: { reference: { type: null, required: false }, ...primitive() },
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectPopoverRootContext()
    onBeforeMount(() => {
      rootContext.hasCustomAnchor.value = true
    })
    onUnmounted(() => {
      rootContext.hasCustomAnchor.value = false
    })
    return () =>
      h(PopperAnchor as Component, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const PopoverClose = defineComponent({
  name: 'PopoverClose',
  props: primitive('button'),
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectPopoverRootContext()
    return () =>
      h(
        Primitive,
        {
          type: props.as === 'button' ? 'button' : undefined,
          as: props.as,
          'as-child': props.asChild,
          onClick: () => rootContext.onOpenChange(false),
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const PopoverArrow = defineComponent({
  name: 'PopoverArrow',
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

export const PopoverPortal = defineComponent({
  name: 'PopoverPortal',
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
