import { defineComponent, h, renderSlot, withCtx, type PropType } from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectAccordionItemContext, injectAccordionRootContext } from './context'

export interface AccordionHeaderProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const AccordionHeader = defineComponent({
  name: 'AccordionHeader',
  props: {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false, default: 'h3' },
  },
  setup(props, { slots }) {
    const rootContext = injectAccordionRootContext()
    const itemContext = injectAccordionItemContext()
    useForwardExpose()

    return () =>
      h(
        Primitive,
        {
          as: props.as,
          'as-child': props.asChild,
          'data-orientation': rootContext.orientation,
          'data-state': itemContext.dataState.value,
          'data-disabled': itemContext.dataDisabled.value,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
