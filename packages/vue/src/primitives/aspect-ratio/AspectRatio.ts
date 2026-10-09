import { computed, defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'

export interface AspectRatioProps {
  ratio?: number
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const AspectRatio = defineComponent({
  name: 'AspectRatio',
  inheritAttrs: false,
  props: {
    ratio: { type: Number, required: false, default: 1 },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { attrs, slots }) {
    const { forwardRef } = useForwardExpose()
    const aspect = computed(() => (1 / props.ratio) * 100)

    return () =>
      h(
        'div',
        {
          style: `position: relative; width: 100%; padding-bottom: ${aspect.value}%`,
          'data-reka-aspect-ratio-wrapper': '',
        },
        [
          h(
            Primitive,
            mergeProps(
              {
                ref: forwardRef,
                'as-child': props.asChild,
                as: props.as,
                style: { position: 'absolute', inset: '0px' },
              },
              attrs,
            ),
            { default: withCtx(() => [renderSlot(slots, 'default', { aspect: aspect.value })]) },
          ),
        ],
      )
  },
})
