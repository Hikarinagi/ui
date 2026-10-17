import { defineComponent, h, mergeProps, renderSlot, watch, withCtx, type PropType } from 'vue'
import { isClient } from '@vueuse/core'
import { addBranch } from '../../../../shared/src/primitives/dismissable-layer'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'

export const DismissableLayerBranch = defineComponent({
  name: 'DismissableLayerBranch',
  props: {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    watch(
      currentElement,
      (element, _, onCleanup) => {
        if (isClient && element instanceof HTMLElement) onCleanup(addBranch(element))
      },
      { immediate: true, flush: 'post' },
    )
    return () =>
      h(Primitive, mergeProps({ ref: forwardRef }, props), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
