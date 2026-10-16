import { onKeyStroke, unrefElement } from '@vueuse/core'
import {
  computed,
  createCommentVNode,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  normalizeProps,
  normalizeStyle,
  onMounted,
  ref,
  renderSlot,
  toRefs,
  watchEffect,
  withCtx,
  type Component,
  type ComponentPublicInstance,
  type PropType,
  type Ref,
} from 'vue'
import { focusFirst, getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  hotkeyMessage as formatHotkey,
  sortTabbableCandidates,
  VIEWPORT_PAUSE,
  VIEWPORT_RESUME,
  viewportLabel,
  type SwipeDirection,
} from '../../../../shared/src/primitives/toast'
import { useCollection } from '../collection'
import { DismissableLayerBranch } from '../dismissable-layer'
import { Primitive, type PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { VisuallyHidden } from '../visually-hidden'
import { createContext } from '../utils/createContext'
import { useForwardExpose } from '../utils/useForwardExpose'

export interface ToastProviderContext {
  label: Ref<string>
  duration: Ref<number>
  disableSwipe: Ref<boolean>
  swipeDirection: Ref<SwipeDirection>
  swipeThreshold: Ref<number>
  toastCount: Ref<number>
  viewport: Ref<HTMLElement | undefined>
  onViewportChange: (viewport: HTMLElement | undefined) => void
  onToastAdd: () => void
  onToastRemove: () => void
  isFocusedToastEscapeKeyDownRef: Ref<boolean>
  isClosePausedRef: Ref<boolean>
}

export const [injectToastProviderContext, provideToastProviderContext] =
  createContext<ToastProviderContext>('ToastProvider')

export const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

export const ToastProvider = defineComponent({
  name: 'ToastProvider',
  inheritAttrs: false,
  props: {
    label: { type: String, required: false, default: 'Notification' },
    duration: { type: Number, required: false, default: 5000 },
    disableSwipe: { type: Boolean, required: false },
    swipeDirection: {
      type: String as PropType<SwipeDirection>,
      required: false,
      default: 'right',
    },
    swipeThreshold: { type: Number, required: false, default: 50 },
  },
  setup(props, { slots }) {
    const { label, duration, disableSwipe, swipeDirection, swipeThreshold } = toRefs(props)
    useCollection({ isProvider: true })
    const viewport = ref<HTMLElement>()
    const toastCount = ref(0)
    const isFocusedToastEscapeKeyDownRef = ref(false)
    const isClosePausedRef = ref(false)

    if (props.label && typeof props.label === 'string' && !props.label.trim())
      throw new Error(
        'Invalid prop `label` supplied to `ToastProvider`. Expected non-empty `string`.',
      )

    provideToastProviderContext({
      label,
      duration,
      disableSwipe,
      swipeDirection,
      swipeThreshold,
      toastCount,
      viewport,
      onViewportChange(element) {
        viewport.value = element
      },
      onToastAdd() {
        toastCount.value++
      },
      onToastRemove() {
        toastCount.value--
      },
      isFocusedToastEscapeKeyDownRef,
      isClosePausedRef,
    })

    return () => renderSlot(slots, 'default')
  },
})

const FocusProxy = defineComponent({
  name: 'FocusProxy',
  emits: ['focusFromOutsideViewport'],
  setup(_, { emit, slots }) {
    const providerContext = injectToastProviderContext()
    return () =>
      h(
        VisuallyHidden as Component,
        {
          tabindex: '0',
          style: { position: 'fixed' },
          onFocus: (event: FocusEvent) => {
            const prevFocusedElement = event.relatedTarget as Node | null
            const isFocusFromOutsideViewport =
              !providerContext.viewport.value?.contains(prevFocusedElement)
            if (isFocusFromOutsideViewport) emit('focusFromOutsideViewport')
          },
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const ToastViewport = defineComponent({
  name: 'ToastViewport',
  inheritAttrs: false,
  props: {
    hotkey: { type: Array as PropType<string[]>, required: false, default: () => ['F8'] },
    label: {
      type: [String, Function] as PropType<string | ((hotkey: string) => string)>,
      required: false,
      default: 'Notifications ({hotkey})',
    },
    ...primitive('ol'),
  },
  setup(props, { attrs, slots }) {
    const { hotkey, label } = toRefs(props)
    const { forwardRef, currentElement } = useForwardExpose()
    const { CollectionSlot, getItems } = useCollection()
    const providerContext = injectToastProviderContext()
    const hasToasts = computed(() => providerContext.toastCount.value > 0)
    const headFocusProxyRef = ref<HTMLElement>()
    const tailFocusProxyRef = ref<HTMLElement>()
    const hotkeyMessage = computed(() => formatHotkey(hotkey.value))

    onKeyStroke(hotkey.value, () => {
      currentElement.value!.focus()
    })

    onMounted(() => {
      providerContext.onViewportChange(currentElement.value)
    })

    watchEffect(cleanupFn => {
      const viewport = currentElement.value
      if (hasToasts.value && viewport) {
        const handlePause = () => {
          if (!providerContext.isClosePausedRef.value) {
            viewport.dispatchEvent(new CustomEvent(VIEWPORT_PAUSE))
            providerContext.isClosePausedRef.value = true
          }
        }
        const handleResume = () => {
          if (providerContext.isClosePausedRef.value) {
            viewport.dispatchEvent(new CustomEvent(VIEWPORT_RESUME))
            providerContext.isClosePausedRef.value = false
          }
        }
        const handleFocusOutResume = (event: FocusEvent) => {
          const isFocusMovingOutside = !viewport.contains(event.relatedTarget as Node | null)
          if (isFocusMovingOutside) handleResume()
        }
        const handlePointerLeaveResume = () => {
          const isFocusInside = viewport.contains(getActiveElement())
          if (!isFocusInside) handleResume()
        }
        const handleKeyDown = (event: KeyboardEvent) => {
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
          const isTabKey = event.key === 'Tab' && !isMetaKey
          if (isTabKey) {
            const focusedElement = getActiveElement()
            const isTabbingBackwards = event.shiftKey
            const targetIsViewport = event.target === viewport
            if (targetIsViewport && isTabbingBackwards) {
              headFocusProxyRef.value?.focus()
              return
            }
            const tabbingDirection = isTabbingBackwards ? 'backwards' : 'forwards'
            const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection })
            const index = sortedCandidates.findIndex(candidate => candidate === focusedElement)
            if (focusFirst(sortedCandidates.slice(index + 1))) event.preventDefault()
            else if (isTabbingBackwards) headFocusProxyRef.value?.focus()
            else tailFocusProxyRef.value?.focus()
          }
        }
        viewport.addEventListener('focusin', handlePause)
        viewport.addEventListener('focusout', handleFocusOutResume)
        viewport.addEventListener('pointermove', handlePause)
        viewport.addEventListener('pointerleave', handlePointerLeaveResume)
        viewport.addEventListener('keydown', handleKeyDown)
        window.addEventListener('blur', handlePause)
        window.addEventListener('focus', handleResume)
        cleanupFn(() => {
          viewport.removeEventListener('focusin', handlePause)
          viewport.removeEventListener('focusout', handleFocusOutResume)
          viewport.removeEventListener('pointermove', handlePause)
          viewport.removeEventListener('pointerleave', handlePointerLeaveResume)
          viewport.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('blur', handlePause)
          window.removeEventListener('focus', handleResume)
        })
      }
    })

    function getSortedTabbableCandidates({
      tabbingDirection,
    }: {
      tabbingDirection: 'forwards' | 'backwards'
    }) {
      return sortTabbableCandidates(
        getItems().map(item => item.ref),
        tabbingDirection,
      )
    }

    function proxyRef(target: Ref<HTMLElement | undefined>) {
      return (node: Element | ComponentPublicInstance | null) => {
        if (!node) return undefined
        target.value = unrefElement(node as HTMLElement) as HTMLElement | undefined
        return undefined
      }
    }

    return () =>
      h(
        DismissableLayerBranch as Component,
        {
          role: 'region',
          'aria-label': viewportLabel(label.value, hotkeyMessage.value),
          tabindex: '-1',
          style: normalizeStyle({ pointerEvents: hasToasts.value ? undefined : 'none' }),
        },
        {
          default: withCtx(() => [
            hasToasts.value
              ? h(FocusProxy, {
                  key: 0,
                  ref: proxyRef(headFocusProxyRef),
                  onFocusFromOutsideViewport: () =>
                    focusFirst(getSortedTabbableCandidates({ tabbingDirection: 'forwards' })),
                })
              : createCommentVNode('v-if', true),
            h(CollectionSlot, null, {
              default: withCtx(() => [
                h(
                  Primitive,
                  mergeProps(
                    { ref: forwardRef, tabindex: '-1', as: props.as, 'as-child': props.asChild },
                    attrs,
                  ),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
              ]),
            }),
            hasToasts.value
              ? h(FocusProxy, {
                  key: 1,
                  ref: proxyRef(tailFocusProxyRef),
                  onFocusFromOutsideViewport: () =>
                    focusFirst(getSortedTabbableCandidates({ tabbingDirection: 'backwards' })),
                })
              : createCommentVNode('v-if', true),
          ]),
        },
      )
  },
})

export const ToastPortal = defineComponent({
  name: 'ToastPortal',
  props: {
    to: { type: null as unknown as PropType<string | HTMLElement>, required: false },
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
