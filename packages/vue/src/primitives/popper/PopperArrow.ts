import {
  defineComponent,
  h,
  mergeProps,
  normalizeStyle,
  renderSlot,
  withCtx,
  type PropType,
} from 'vue'
import { popperArrowStyle } from '../../../../shared/src/primitives/popper'
import type { PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { Arrow } from './Arrow'
import { injectPopperContentContext } from './context'

export interface PopperArrowProps {
  width?: number
  height?: number
  rounded?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const PopperArrow = defineComponent({
  name: 'PopperArrow',
  inheritAttrs: false,
  props: {
    width: { type: Number, required: false },
    height: { type: Number, required: false },
    rounded: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'svg',
    },
  },
  setup(props, { attrs, slots }) {
    const { forwardRef } = useForwardExpose()
    const contentContext = injectPopperContentContext()
    const onArrowRef = (element: unknown) => {
      contentContext.onArrowChange((element as HTMLElement | null) ?? undefined)
      return undefined
    }

    return () =>
      h(
        'span',
        {
          ref: onArrowRef,
          style: normalizeStyle(
            popperArrowStyle(
              contentContext.placedSide.value,
              contentContext.arrowX?.value,
              contentContext.arrowY?.value,
              contentContext.shouldHideArrow.value,
            ),
          ),
        },
        [
          h(
            Arrow,
            mergeProps(attrs, {
              ref: forwardRef,
              style: { display: 'block' },
              as: props.as,
              'as-child': props.asChild,
              rounded: props.rounded,
              width: props.width,
              height: props.height,
            }),
            { default: withCtx(() => [renderSlot(slots, 'default')]) },
          ),
        ],
      )
  },
})
