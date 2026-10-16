import { isClient, onKeyStroke, useRafFn, useTimeout } from '@vueuse/core'
import {
  computed,
  createCommentVNode,
  createTextVNode,
  defineComponent,
  Fragment,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  onMounted,
  onScopeDispose,
  onUnmounted,
  ref,
  renderSlot,
  Teleport,
  toDisplayString,
  watch,
  watchEffect,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
  type Ref,
} from 'vue'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  dispatchSwipeEvent,
  getAnnounceTextContent,
  isDeltaInDirection,
  swipeDelta,
  swipeStartBuffer,
  TOAST_SWIPE_CANCEL,
  TOAST_SWIPE_END,
  TOAST_SWIPE_MOVE,
  TOAST_SWIPE_START,
  VIEWPORT_PAUSE,
  VIEWPORT_RESUME,
  type SwipeEvent,
} from '../../../../shared/src/primitives/toast'
import { useCollection } from '../collection'
import { Presence } from '../presence'
import { Primitive } from '../primitive'
import { VisuallyHidden } from '../visually-hidden'
import { createContext } from '../utils/createContext'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import { injectToastProviderContext, primitive } from './ToastProvider'

const ANNOUNCE_COMMENT =
  "\n      Render each chunk as its own text node so screen readers get the\n      natural pause break between nodes (see comment in utils.ts).\n      Interpolating the array directly with `{{ announceTextContent }}`\n      would route through Vue's `toDisplayString`, which JSON-stringifies\n      arrays — the live region would then announce literal `[`, quotes\n      and commas instead of the toast title and description.\n    "

export const [injectToastRootContext, provideToastRootContext] = createContext<{
  onClose: (event?: Event) => void
}>('ToastRoot')

const rootEmits = [
  'escapeKeyDown',
  'pause',
  'resume',
  'swipeStart',
  'swipeMove',
  'swipeCancel',
  'swipeEnd',
]

const ToastAnnounce = defineComponent({
  name: 'ToastAnnounce',
  setup(_, { slots }) {
    const providerContext = injectToastProviderContext()
    const isAnnounced = useTimeout(1000)
    const renderAnnounceText = ref(false)
    let raf1 = 0
    let raf2 = 0
    if (isClient) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          renderAnnounceText.value = true
        })
      })
      onScopeDispose(() => {
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
      })
    }
    return () =>
      isAnnounced.value || renderAnnounceText.value
        ? h(
            VisuallyHidden as Component,
            { key: 0, feature: 'fully-hidden' },
            {
              default: withCtx(() => [
                createTextVNode(toDisplayString(providerContext.label.value) + ' ', 1),
                renderSlot(slots, 'default'),
              ]),
            },
          )
        : createCommentVNode('v-if', true)
  },
})

const ToastRootImpl = defineComponent({
  name: 'ToastRootImpl',
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<'foreground' | 'background'>, required: false },
    open: { type: Boolean, required: false, default: false },
    duration: { type: Number, required: false },
    ...primitive('li'),
  },
  emits: ['close', ...rootEmits],
  setup(props, { attrs, emit, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const { CollectionItem } = useCollection()
    const providerContext = injectToastProviderContext()
    const pointerStartRef = ref<{ x: number; y: number } | null>(null)
    const swipeDeltaRef = ref<{ x: number; y: number } | null>(null)
    const duration = computed(() =>
      typeof props.duration === 'number' ? props.duration : providerContext.duration.value,
    )
    const closeTimerStartTimeRef = ref(0)
    const closeTimerRemainingTimeRef = ref(duration.value)
    const closeTimerRef = ref(0)
    const remainingTime = ref(duration.value)
    const remainingRaf = useRafFn(
      () => {
        const elapsedTime = Date.now() - closeTimerStartTimeRef.value
        remainingTime.value = Math.max(closeTimerRemainingTimeRef.value - elapsedTime, 0)
      },
      { fpsLimit: 60 },
    )

    function startTimer(time: number) {
      if (time <= 0 || time === Number.POSITIVE_INFINITY) return
      if (!isClient) return
      window.clearTimeout(closeTimerRef.value)
      closeTimerStartTimeRef.value = Date.now()
      closeTimerRef.value = window.setTimeout(handleClose, time)
    }

    function handleClose(event?: Event) {
      const isNonPointerEvent = (event as PointerEvent | undefined)?.pointerType === ''
      const isFocusInToast = currentElement.value?.contains(getActiveElement())
      if (isFocusInToast && isNonPointerEvent) providerContext.viewport.value?.focus()
      if (isNonPointerEvent) providerContext.isClosePausedRef.value = false
      emit('close')
    }

    const announceTextContent = computed(() =>
      currentElement.value ? getAnnounceTextContent(currentElement.value, 'reka') : null,
    )

    if (props.type && !['foreground', 'background'].includes(props.type))
      throw new Error(
        'Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.',
      )

    watchEffect(cleanupFn => {
      const viewport = providerContext.viewport.value
      if (viewport) {
        const handleResume = () => {
          startTimer(closeTimerRemainingTimeRef.value)
          remainingRaf.resume()
          emit('resume')
        }
        const handlePause = () => {
          const elapsedTime = Date.now() - closeTimerStartTimeRef.value
          closeTimerRemainingTimeRef.value = closeTimerRemainingTimeRef.value - elapsedTime
          window.clearTimeout(closeTimerRef.value)
          remainingRaf.pause()
          emit('pause')
        }
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause)
        viewport.addEventListener(VIEWPORT_RESUME, handleResume)
        cleanupFn(() => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause)
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume)
        })
      }
    })

    watch(
      () => [props.open, duration.value],
      () => {
        closeTimerRemainingTimeRef.value = duration.value
        if (props.open && !providerContext.isClosePausedRef.value) startTimer(duration.value)
      },
      { immediate: true },
    )

    onKeyStroke('Escape', event => {
      emit('escapeKeyDown', event)
      if (!event.defaultPrevented) {
        providerContext.isFocusedToastEscapeKeyDownRef.value = true
        handleClose()
      }
    })

    onMounted(() => {
      providerContext.onToastAdd()
    })

    onUnmounted(() => {
      providerContext.onToastRemove()
    })

    provideToastRootContext({ onClose: handleClose })

    const onPointerdown = withModifiers(
      ((event: PointerEvent) => {
        if (providerContext.disableSwipe.value) return
        pointerStartRef.value = { x: event.clientX, y: event.clientY }
      }) as (event: Event) => void,
      ['left'],
    )

    function onPointermove(event: PointerEvent) {
      if (providerContext.disableSwipe.value || !pointerStartRef.value) return
      const { x, y, delta } = swipeDelta(
        pointerStartRef.value,
        event,
        providerContext.swipeDirection.value,
      )
      const hasSwipeMoveStarted = Boolean(swipeDeltaRef.value)
      const moveStartBuffer = swipeStartBuffer(event.pointerType)
      const eventDetail = { originalEvent: event, delta }
      const target = event.currentTarget as HTMLElement
      if (hasSwipeMoveStarted) {
        swipeDeltaRef.value = delta
        dispatchSwipeEvent(TOAST_SWIPE_MOVE, target, ev => emit('swipeMove', ev), eventDetail)
      } else if (isDeltaInDirection(delta, providerContext.swipeDirection.value, moveStartBuffer)) {
        swipeDeltaRef.value = delta
        dispatchSwipeEvent(TOAST_SWIPE_START, target, ev => emit('swipeStart', ev), eventDetail)
        ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
      } else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer)
        pointerStartRef.value = null
    }

    function onPointerup(event: PointerEvent) {
      if (providerContext.disableSwipe.value) return
      const delta = swipeDeltaRef.value
      const target = event.target as HTMLElement
      if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId)
      swipeDeltaRef.value = null
      pointerStartRef.value = null
      if (delta) {
        const toast = event.currentTarget as HTMLElement
        const eventDetail = { originalEvent: event, delta }
        if (
          isDeltaInDirection(
            delta,
            providerContext.swipeDirection.value,
            providerContext.swipeThreshold.value,
          )
        )
          dispatchSwipeEvent(TOAST_SWIPE_END, toast, ev => emit('swipeEnd', ev), eventDetail)
        else
          dispatchSwipeEvent(TOAST_SWIPE_CANCEL, toast, ev => emit('swipeCancel', ev), eventDetail)
        toast?.addEventListener('click', clickEvent => clickEvent.preventDefault(), { once: true })
      }
    }

    return () =>
      h(Fragment, null, [
        announceTextContent.value
          ? h(
              ToastAnnounce,
              {
                key: 0,
                role: 'alert',
                'aria-live': props.type === 'foreground' ? 'assertive' : 'polite',
              },
              {
                default: withCtx(() => [
                  createCommentVNode(ANNOUNCE_COMMENT),
                  h(
                    Fragment,
                    null,
                    announceTextContent.value!.map((text, i) =>
                      h(Fragment, { key: i }, [createTextVNode(toDisplayString(text), 1)]),
                    ),
                  ),
                ]),
              },
            )
          : createCommentVNode('v-if', true),
        providerContext.viewport.value
          ? h(Teleport, { key: 1, to: providerContext.viewport.value }, [
              h(CollectionItem, null, {
                default: withCtx(() => [
                  h(
                    Primitive,
                    mergeProps({ ref: forwardRef, tabindex: '0' }, attrs, {
                      as: props.as,
                      'as-child': props.asChild,
                      'data-state': props.open ? 'open' : 'closed',
                      'data-swipe-direction': providerContext.swipeDirection.value,
                      style: providerContext.disableSwipe.value
                        ? undefined
                        : { userSelect: 'none', touchAction: 'none' },
                      onPointerdown,
                      onPointermove,
                      onPointerup,
                    }),
                    {
                      default: withCtx(() => [
                        renderSlot(slots, 'default', {
                          remaining: remainingTime.value,
                          duration: duration.value,
                        }),
                      ]),
                    },
                  ),
                ]),
              }),
            ])
          : createCommentVNode('v-if', true),
      ])
  },
})

export const ToastRoot = defineComponent({
  name: 'ToastRoot',
  props: {
    defaultOpen: { type: Boolean, required: false, default: true },
    forceMount: { type: Boolean, required: false },
    type: {
      type: String as PropType<'foreground' | 'background'>,
      required: false,
      default: 'foreground',
    },
    open: { type: Boolean, required: false, default: undefined },
    duration: { type: Number, required: false },
    ...primitive('li'),
  },
  emits: [...rootEmits, 'update:open'],
  setup(props, { attrs, emit, slots }) {
    const { forwardRef } = useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>

    function setSwipe(event: SwipeEvent, state: string) {
      event.currentTarget.setAttribute('data-swipe', state)
    }

    return () =>
      h(
        Presence,
        { present: props.forceMount || open.value },
        {
          default: withCtx(() => [
            h(
              ToastRootImpl as Component,
              mergeProps(
                {
                  ref: forwardRef,
                  open: open.value,
                  type: props.type,
                  as: props.as,
                  'as-child': props.asChild,
                  duration: props.duration,
                },
                attrs,
                {
                  onClose: () => (open.value = false),
                  onPause: () => emit('pause'),
                  onResume: () => emit('resume'),
                  onEscapeKeyDown: (event: KeyboardEvent) => emit('escapeKeyDown', event),
                  onSwipeStart: (event: SwipeEvent) => {
                    emit('swipeStart', event)
                    if (!event.defaultPrevented) setSwipe(event, 'start')
                  },
                  onSwipeMove: (event: SwipeEvent) => {
                    emit('swipeMove', event)
                    if (!event.defaultPrevented) {
                      const { x, y } = event.detail.delta
                      const target = event.currentTarget
                      target.setAttribute('data-swipe', 'move')
                      target.style.setProperty('--reka-toast-swipe-move-x', `${x}px`)
                      target.style.setProperty('--reka-toast-swipe-move-y', `${y}px`)
                    }
                  },
                  onSwipeCancel: (event: SwipeEvent) => {
                    emit('swipeCancel', event)
                    if (!event.defaultPrevented) {
                      const target = event.currentTarget
                      target.setAttribute('data-swipe', 'cancel')
                      target.style.removeProperty('--reka-toast-swipe-move-x')
                      target.style.removeProperty('--reka-toast-swipe-move-y')
                      target.style.removeProperty('--reka-toast-swipe-end-x')
                      target.style.removeProperty('--reka-toast-swipe-end-y')
                    }
                  },
                  onSwipeEnd: (event: SwipeEvent) => {
                    emit('swipeEnd', event)
                    if (!event.defaultPrevented) {
                      const { x, y } = event.detail.delta
                      const target = event.currentTarget
                      target.setAttribute('data-swipe', 'end')
                      target.style.removeProperty('--reka-toast-swipe-move-x')
                      target.style.removeProperty('--reka-toast-swipe-move-y')
                      target.style.setProperty('--reka-toast-swipe-end-x', `${x}px`)
                      target.style.setProperty('--reka-toast-swipe-end-y', `${y}px`)
                      open.value = false
                    }
                  },
                },
              ),
              {
                default: withCtx(
                  ({ remaining, duration }: { remaining: number; duration: number }) => [
                    renderSlot(slots, 'default', { remaining, duration, open: open.value }),
                  ],
                ),
              },
            ),
          ]),
        },
      )
  },
})

export const ToastAnnounceExclude = defineComponent({
  name: 'ToastAnnounceExclude',
  props: { altText: { type: String, required: false }, ...primitive() },
  setup(props, { slots }) {
    return () =>
      h(
        Primitive,
        {
          as: props.as,
          'as-child': props.asChild,
          'data-reka-toast-announce-exclude': '',
          'data-reka-toast-announce-alt': props.altText || undefined,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ToastTitle = defineComponent({
  name: 'ToastTitle',
  props: primitive(),
  setup(props, { slots }) {
    useForwardExpose()
    return () =>
      h(Primitive, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const ToastDescription = defineComponent({
  name: 'ToastDescription',
  props: primitive(),
  setup(props, { slots }) {
    useForwardExpose()
    return () =>
      h(Primitive, normalizeProps(guardReactiveProps(props)), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const ToastClose = defineComponent({
  name: 'ToastClose',
  props: primitive('button'),
  setup(props, { slots }) {
    const rootContext = injectToastRootContext()
    const { forwardRef } = useForwardExpose()
    return () =>
      h(
        ToastAnnounceExclude,
        { 'as-child': '' },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(props, {
                ref: forwardRef,
                type: props.as === 'button' ? 'button' : undefined,
                onClick: rootContext.onClose,
              }),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})

export const ToastAction = defineComponent({
  name: 'ToastAction',
  props: { altText: { type: String, required: true }, ...primitive() },
  setup(props, { slots }) {
    if (!props.altText) throw new Error('Missing prop `altText` expected on `ToastAction`')
    const { forwardRef } = useForwardExpose()
    return () =>
      props.altText
        ? h(
            ToastAnnounceExclude,
            { key: 0, 'alt-text': props.altText, 'as-child': '' },
            {
              default: withCtx(() => [
                h(
                  ToastClose,
                  { ref: forwardRef, as: props.as, 'as-child': props.asChild },
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
              ]),
            },
          )
        : createCommentVNode('v-if', true)
  },
})
