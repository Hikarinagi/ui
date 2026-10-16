import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import { ARROW_PATH, ROUNDED_ARROW_PATH } from '../../../../shared/src/primitives/popper'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'

export interface ArrowProps {
  width?: number
  height?: number
  rounded?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const Arrow = defineComponent({
  name: 'Arrow',
  props: {
    width: { type: Number, required: false, default: 10 },
    height: { type: Number, required: false, default: 5 },
    rounded: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'svg',
    },
  },
  setup(props, { slots }) {
    useForwardExpose()
    return () =>
      h(
        Primitive,
        mergeProps(props, {
          width: props.width,
          height: props.height,
          viewBox: props.asChild ? undefined : '0 0 12 6',
          preserveAspectRatio: props.asChild ? undefined : 'none',
        }),
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', {}, () => [
              !props.rounded
                ? h('path', { key: 0, d: ARROW_PATH })
                : h('path', { key: 1, d: ROUNDED_ARROW_PATH }),
            ]),
          ]),
        },
      )
  },
})
