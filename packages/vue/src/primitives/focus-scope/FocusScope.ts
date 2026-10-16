import {
  defineComponent,
  h,
  nextTick,
  reactive,
  renderSlot,
  watch,
  watchEffect,
  withCtx,
  type PropType,
} from 'vue'
import { isClient } from '@vueuse/core'
import {
  dispatchMountAutoFocus,
  dispatchUnmountAutoFocus,
  focusScopesStack,
  getActiveElement,
  handleFocusScopeKeyDown,
  trapFocus,
  type FocusScopeAPI,
} from '../../../../shared/src/primitives/focus-scope'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'

export interface FocusScopeProps {
  loop?: boolean
  trapped?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type FocusScopeEmits = {
  mountAutoFocus: [event: Event]
  unmountAutoFocus: [event: Event]
}

export const FocusScope = defineComponent({
  name: 'FocusScope',
  props: {
    loop: { type: Boolean, required: false, default: false },
    trapped: { type: Boolean, required: false, default: false },
    present: { type: Boolean, required: false, default: true },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['mountAutoFocus', 'unmountAutoFocus'],
  setup(props, { emit, slots }) {
    const { currentRef, currentElement } = useForwardExpose()
    const focusScope = reactive<FocusScopeAPI>({
      paused: false,
      pause() {
        this.paused = true
      },
      resume() {
        this.paused = false
      },
    })

    const onMount = (event: Event) => emit('mountAutoFocus', event)
    const onUnmount = (event: Event) => emit('unmountAutoFocus', event)

    watchEffect(onCleanup => {
      if (!isClient) return
      const container = currentElement.value
      if (!props.trapped || !container) return
      onCleanup(trapFocus(container, focusScope))
    })

    watchEffect(async onCleanup => {
      const container = currentElement.value
      await nextTick()
      if (!container) return
      if (props.present !== false) focusScopesStack.add(focusScope)
      const previous = getActiveElement()
      if (!container.contains(previous) && props.present !== false)
        dispatchMountAutoFocus(container, previous, onMount)
      onCleanup(() => dispatchUnmountAutoFocus(container, previous, focusScope, onUnmount))
    })

    watch(
      () => props.present,
      async (present, prevPresent) => {
        if (!isClient) return
        if (present === false && prevPresent === true) {
          focusScopesStack.remove(focusScope)
          return
        }
        if (present !== true || prevPresent !== false) return
        focusScopesStack.add(focusScope)
        await nextTick()
        const container = currentElement.value
        if (!container) return
        const previous = getActiveElement()
        if (!container.contains(previous)) dispatchMountAutoFocus(container, previous, onMount)
      },
    )

    const onKeydown = (event: KeyboardEvent) =>
      handleFocusScopeKeyDown(event, {
        loop: props.loop,
        trapped: props.trapped,
        scope: focusScope,
      })

    return () =>
      h(
        Primitive,
        {
          ref: currentRef,
          tabindex: '-1',
          'as-child': props.asChild,
          as: props.as,
          onKeydown,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
