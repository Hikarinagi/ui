import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import type { PrimitiveProps } from '../primitive'
import { ToggleGroupItem } from '../toggle-group'
import type { AcceptableValue } from '../utils/types'
import { useForwardExpose } from '../utils/useForwardExpose'
import { ToolbarButton } from './ToolbarButton'

export interface ToolbarToggleItemProps {
  value: AcceptableValue
  disabled?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const ToolbarToggleItem = defineComponent({
  name: 'ToolbarToggleItem',
  props: {
    value: { type: null as unknown as PropType<AcceptableValue>, required: true },
    disabled: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { forwardRef } = useForwardExpose()

    return () =>
      h(
        ToolbarButton,
        { 'as-child': '', disabled: props.disabled },
        {
          default: withCtx(() => [
            h(
              ToggleGroupItem,
              mergeProps(props, { ref: forwardRef }) as { value: AcceptableValue },
              {
                default: withCtx(() => [renderSlot(slots, 'default')]),
              },
            ),
          ]),
        },
      )
  },
})
