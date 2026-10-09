import { defineComponent, h, renderSlot, withCtx, type PropType } from 'vue'
import { isAccordionTriggerLocked } from '../../../../shared/src/primitives/accordion'
import { COLLECTION_ITEM } from '../../../../shared/src/primitives/collection'
import { CollapsibleTrigger } from '../collapsible'
import type { PrimitiveProps } from '../primitive'
import { useId } from '../utils/useId'
import { injectAccordionItemContext, injectAccordionRootContext } from './context'

export interface AccordionTriggerProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const AccordionTrigger = defineComponent({
  name: 'AccordionTrigger',
  props: {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const rootContext = injectAccordionRootContext()
    const itemContext = injectAccordionItemContext()
    itemContext.triggerId ||= useId(undefined, 'reka-accordion-trigger')

    function changeItem() {
      const locked = isAccordionTriggerLocked(
        rootContext.isSingle.value,
        itemContext.open.value,
        rootContext.collapsible,
      )
      if (itemContext.disabled.value || locked) return
      rootContext.changeModelValue(itemContext.value.value)
    }

    return () =>
      h(
        CollapsibleTrigger,
        {
          id: itemContext.triggerId,
          ref: itemContext.currentRef as never,
          [COLLECTION_ITEM]: '',
          as: props.as,
          'as-child': props.asChild,
          'aria-disabled': itemContext.disabled.value || undefined,
          'aria-expanded': itemContext.open.value || false,
          'data-disabled': itemContext.dataDisabled.value,
          'data-orientation': rootContext.orientation,
          'data-state': itemContext.dataState.value,
          disabled: itemContext.disabled.value,
          onClick: changeItem,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
