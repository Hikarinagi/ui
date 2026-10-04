import { defineComponent, h, renderSlot, withCtx, type PropType } from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectSliderRootContext } from './context'

export interface SliderTrackProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const SliderTrack = defineComponent({
  name: 'SliderTrack',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'span',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectSliderRootContext()
    useForwardExpose()

    return () =>
      h(
        Primitive,
        {
          'as-child': props.asChild,
          as: props.as,
          'data-disabled': rootContext.disabled.value ? '' : undefined,
          'data-orientation': rootContext.orientation.value,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
