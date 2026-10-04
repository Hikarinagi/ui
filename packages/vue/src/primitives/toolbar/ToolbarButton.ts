import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { RovingFocusItem } from '../roving-focus'
import { useForwardExpose } from '../utils/useForwardExpose'

export interface ToolbarButtonProps {
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const ToolbarButton = defineComponent({
  name: 'ToolbarButton',
  props: {
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    const { forwardRef } = useForwardExpose()

    return () =>
      h(
        RovingFocusItem,
        { 'as-child': '', focusable: !props.disabled },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(
                { ref: forwardRef, type: props.as === 'button' ? 'button' : undefined },
                props,
              ),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
