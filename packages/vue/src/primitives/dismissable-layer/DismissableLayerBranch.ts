import {
  defineComponent,
  h,
  mergeProps,
  onMounted,
  onUnmounted,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
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
    let release: (() => void) | undefined
    onMounted(() => {
      if (currentElement.value) release = addBranch(currentElement.value)
    })
    onUnmounted(() => {
      release?.()
      release = undefined
    })
    return () =>
      h(Primitive, mergeProps({ ref: forwardRef }, props), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})
