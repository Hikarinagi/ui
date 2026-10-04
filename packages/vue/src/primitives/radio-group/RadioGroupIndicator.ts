import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import { getCheckedState } from '../../../../shared/src/primitives/checkbox'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectRadioGroupItemContext } from './context'

export interface RadioGroupIndicatorProps {
  forceMount?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const RadioGroupIndicator = defineComponent({
  name: 'RadioGroupIndicator',
  inheritAttrs: false,
  props: {
    forceMount: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'span',
    },
  },
  setup(props, { attrs, slots }) {
    const { forwardRef } = useForwardExpose()
    const itemContext = injectRadioGroupItemContext()

    return () =>
      h(
        Presence,
        { present: props.forceMount || itemContext.checked.value },
        {
          default: withCtx(() => [
            h(
              Primitive,
              mergeProps(
                {
                  ref: forwardRef,
                  'data-state': getCheckedState(itemContext.checked.value),
                  'data-disabled': itemContext.disabled.value ? '' : undefined,
                  'as-child': props.asChild,
                  as: props.as,
                },
                attrs,
              ),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
