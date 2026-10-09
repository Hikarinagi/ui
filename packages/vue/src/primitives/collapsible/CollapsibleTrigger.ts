import { defineComponent, h, renderSlot, withCtx, type PropType } from 'vue'
import { openState } from '../../../../shared/src/primitives/collapsible'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectCollapsibleRootContext } from './context'

export interface CollapsibleTriggerProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const CollapsibleTrigger = defineComponent({
  name: 'CollapsibleTrigger',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectCollapsibleRootContext()

    return () =>
      h(
        Primitive,
        {
          type: props.as === 'button' ? 'button' : undefined,
          as: props.as,
          'as-child': props.asChild,
          'aria-controls': rootContext.contentId,
          'aria-expanded': rootContext.open.value,
          'data-state': openState(rootContext.open.value),
          'data-disabled': rootContext.disabled?.value ? '' : undefined,
          disabled: rootContext.disabled?.value,
          onClick: rootContext.onOpenToggle,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
