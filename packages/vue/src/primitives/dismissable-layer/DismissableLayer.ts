import {
  computed,
  defineComponent,
  h,
  nextTick,
  normalizeStyle,
  ref,
  renderSlot,
  toValue,
  watch,
  watchEffect,
  withCtx,
  type MaybeRefOrGetter,
  type PropType,
  type Ref,
} from 'vue'
import { isClient, onKeyStroke } from '@vueuse/core'
import {
  addLayer,
  blockOutsidePointerEvents,
  bodyPointerEventsDisabled,
  inBranch,
  isHighestLayer,
  layersVersion,
  pointerEventsEnabled,
  releaseLayer,
  subscribeLayers,
  watchFocusOutside,
  watchPointerDownOutside,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../../../../shared/src/primitives/dismissable-layer'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'

export type { FocusOutsideEvent, PointerDownOutsideEvent }

const version = ref(layersVersion())
if (isClient) subscribeLayers(() => (version.value = layersVersion()))

export function useLayersVersion() {
  return version
}

export function usePointerDownOutside(
  onPointerDownOutside: (event: PointerDownOutsideEvent) => void,
  element: Ref<HTMLElement | undefined>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  let watcher: ReturnType<typeof watchPointerDownOutside> | undefined
  watchEffect(onCleanup => {
    if (!isClient || !toValue(enabled)) return
    const current = watchPointerDownOutside({
      element: () => element.value,
      onOutside: onPointerDownOutside,
    })
    watcher = current
    onCleanup(() => {
      current.stop()
      if (watcher === current) watcher = undefined
    })
  })
  return {
    onPointerDownCapture: () => {
      if (!toValue(enabled)) return
      watcher?.onPointerDownCapture()
    },
  }
}

export function useFocusOutside(
  onFocusOutside: (event: FocusOutsideEvent) => void,
  element: Ref<HTMLElement | undefined>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  let watcher: ReturnType<typeof watchFocusOutside> | undefined
  watchEffect(onCleanup => {
    if (!isClient || !toValue(enabled)) return
    const current = watchFocusOutside({
      element: () => element.value,
      onOutside: onFocusOutside,
      settle: async () => {
        await nextTick()
        await nextTick()
      },
    })
    watcher = current
    onCleanup(() => {
      current.stop()
      if (watcher === current) watcher = undefined
    })
  })
  return {
    onFocusCapture: () => {
      if (!toValue(enabled)) return
      watcher?.onFocusCapture()
    },
    onBlurCapture: () => {
      if (!toValue(enabled)) return
      watcher?.onBlurCapture()
    },
  }
}

export interface DismissableLayerProps {
  disableOutsidePointerEvents?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type DismissableLayerEmits = {
  escapeKeyDown: [event: KeyboardEvent]
  pointerDownOutside: [event: PointerDownOutsideEvent]
  focusOutside: [event: FocusOutsideEvent]
  interactOutside: [event: PointerDownOutsideEvent | FocusOutsideEvent]
  dismiss: []
}

export const DismissableLayer = defineComponent({
  name: 'DismissableLayer',
  props: {
    disableOutsidePointerEvents: { type: Boolean, required: false, default: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    present: { type: Boolean, required: false, default: true },
  },
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(props, { emit, slots }) {
    const { forwardRef, currentElement: layerElement } = useForwardExpose()

    const isBodyPointerEventsDisabled = computed(() => {
      void version.value
      return bodyPointerEventsDisabled()
    })
    const isPointerEventsEnabled = computed(() => {
      void version.value
      return pointerEventsEnabled(layerElement.value)
    })

    const pointerDownOutside = usePointerDownOutside(
      async event => {
        if (!props.present || !isPointerEventsEnabled.value || inBranch(event.target)) return
        emit('pointerDownOutside', event)
        emit('interactOutside', event)
        await nextTick()
        if (!event.defaultPrevented) emit('dismiss')
      },
      layerElement,
      () => props.present,
    )

    const focusOutside = useFocusOutside(event => {
      if (!props.present || inBranch(event.target)) return
      emit('focusOutside', event)
      emit('interactOutside', event)
      if (!event.defaultPrevented) emit('dismiss')
    }, layerElement)

    onKeyStroke('Escape', event => {
      if (!props.present) return
      if (!isHighestLayer(layerElement.value)) return
      emit('escapeKeyDown', event)
      if (!event.defaultPrevented) emit('dismiss')
    })

    watch(
      [layerElement, () => props.disableOutsidePointerEvents, () => props.present],
      ([element, disableOutsidePointerEvents, present], _, onCleanup) => {
        if (!element || !present || !disableOutsidePointerEvents) return
        onCleanup(blockOutsidePointerEvents(element))
      },
      { immediate: true },
    )

    watch(
      [layerElement, () => props.present],
      ([element, present], _, onCleanup) => {
        if (!element || !present) return
        onCleanup(addLayer(element))
      },
      { immediate: true },
    )

    watchEffect(onCleanup => {
      onCleanup(() => {
        if (layerElement.value) releaseLayer(layerElement.value)
      })
    })

    return () =>
      h(
        Primitive,
        {
          ref: forwardRef,
          'as-child': props.asChild,
          as: props.as,
          'data-dismissable-layer': '',
          style: normalizeStyle({
            pointerEvents: isBodyPointerEventsDisabled.value
              ? isPointerEventsEnabled.value
                ? 'auto'
                : 'none'
              : undefined,
          }),
          onFocusCapture: focusOutside.onFocusCapture,
          onBlurCapture: focusOutside.onBlurCapture,
          onPointerdownCapture: pointerDownOutside.onPointerDownCapture,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
