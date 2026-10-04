import {
  defineComponent,
  h,
  ref,
  renderSlot,
  toRefs,
  watch,
  watchEffect,
  withCtx,
  type PropType,
} from 'vue'
import { assert } from '../../../../shared/src/primitives/splitter/assert'
import { registerResizeHandle } from '../../../../shared/src/primitives/splitter/registry'
import type {
  PointerHitAreaMargins,
  ResizeEvent,
  ResizeHandler,
  ResizeHandlerAction,
  ResizeHandlerState,
} from '../../../../shared/src/primitives/splitter/types'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { useNonce } from '../utils/useNonce'
import { useWindowSplitterResizeHandlerBehavior } from './behaviors'
import { injectPanelGroupContext } from './context'

export interface SplitterResizeHandleProps {
  id?: string
  hitAreaMargins?: PointerHitAreaMargins
  tabindex?: number
  disabled?: boolean
  nonce?: string
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type SplitterResizeHandleEmits = {
  dragging: [isDragging: boolean]
}

const isBrowser = typeof document !== 'undefined'

export const SplitterResizeHandle = defineComponent({
  name: 'SplitterResizeHandle',
  props: {
    id: { type: String, required: false },
    hitAreaMargins: { type: Object as PropType<PointerHitAreaMargins>, required: false },
    tabindex: { type: Number, required: false, default: 0 },
    disabled: { type: Boolean, required: false },
    nonce: { type: String, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['dragging'],
  setup(props, { emit, slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const { disabled } = toRefs(props)
    const panelGroupContext = injectPanelGroupContext()
    if (panelGroupContext === null)
      throw new Error('PanelResizeHandle components must be rendered within a PanelGroup container')
    const {
      direction,
      groupId,
      registerResizeHandle: registerResizeHandleWithParentGroup,
      startDragging,
      stopDragging,
      panelGroupElement,
    } = panelGroupContext
    const resizeHandleId = useId(props.id, 'reka-splitter-resize-handle')
    const state = ref<ResizeHandlerState>('inactive')
    const isFocused = ref(false)
    const resizeHandler = ref<ResizeHandler | null>(null)
    const { nonce: propNonce } = toRefs(props)
    const nonce = useNonce(propNonce)

    watch(
      disabled,
      () => {
        if (!isBrowser) return
        if (disabled.value) resizeHandler.value = null
        else resizeHandler.value = registerResizeHandleWithParentGroup(resizeHandleId)
      },
      { immediate: true },
    )

    watchEffect(onCleanup => {
      if (disabled.value || resizeHandler.value === null) return
      const element = currentElement.value
      if (!element) return
      assert(element)
      const setResizeHandlerState = (
        action: ResizeHandlerAction,
        isActive: boolean,
        event: ResizeEvent,
      ) => {
        if (!isActive) {
          state.value = 'inactive'
          return
        }
        switch (action) {
          case 'down':
            state.value = 'drag'
            startDragging(resizeHandleId, event)
            emit('dragging', true)
            break
          case 'move':
            if (state.value !== 'drag') state.value = 'hover'
            resizeHandler.value?.(event)
            break
          case 'up':
            state.value = 'hover'
            stopDragging()
            emit('dragging', false)
            break
        }
      }
      onCleanup(
        registerResizeHandle(
          resizeHandleId,
          element,
          () => direction.value,
          {
            coarse: props.hitAreaMargins?.coarse ?? 15,
            fine: props.hitAreaMargins?.fine ?? 5,
          },
          () => nonce.value,
          setResizeHandlerState,
        ),
      )
    })

    useWindowSplitterResizeHandlerBehavior({
      disabled,
      resizeHandler,
      handleId: resizeHandleId,
      panelGroupElement,
    })

    const onBlur = () => (isFocused.value = false)
    const onFocus = () => (isFocused.value = false)

    return () =>
      h(
        Primitive,
        {
          id: resizeHandleId,
          ref: forwardRef,
          style: { touchAction: 'none', userSelect: 'none' },
          as: props.as,
          'as-child': props.asChild,
          role: 'separator',
          'data-resize-handle': '',
          tabindex: props.tabindex,
          'data-state': state.value,
          'data-disabled': disabled.value ? '' : undefined,
          'data-orientation': direction.value,
          'data-panel-group-id': groupId,
          'data-resize-handle-active':
            state.value === 'drag' ? 'pointer' : isFocused.value ? 'keyboard' : undefined,
          'data-resize-handle-state': state.value,
          'data-panel-resize-handle-enabled': !disabled.value,
          'data-panel-resize-handle-id': resizeHandleId,
          onBlur,
          onFocus,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
