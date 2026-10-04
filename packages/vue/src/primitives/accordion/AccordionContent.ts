import { defineComponent, h, renderSlot, withCtx, type PropType } from 'vue'
import { CollapsibleContent } from '../collapsible'
import type { PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectAccordionItemContext, injectAccordionRootContext } from './context'

export interface AccordionContentProps {
  forceMount?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const AccordionContent = defineComponent({
  name: 'AccordionContent',
  props: {
    forceMount: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectAccordionRootContext()
    const itemContext = injectAccordionItemContext()
    useForwardExpose()
    const onContentFound = () => rootContext.changeModelValue(itemContext.value.value)

    return () =>
      h(
        CollapsibleContent,
        {
          role: 'region',
          'as-child': props.asChild,
          as: props.as,
          'force-mount': props.forceMount,
          'aria-labelledby': itemContext.triggerId,
          'data-state': itemContext.dataState.value,
          'data-disabled': itemContext.dataDisabled.value,
          'data-orientation': rootContext.orientation,
          style: {
            '--reka-accordion-content-width': 'var(--reka-collapsible-content-width)',
            '--reka-accordion-content-height': 'var(--reka-collapsible-content-height)',
          },
          onContentFound,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
