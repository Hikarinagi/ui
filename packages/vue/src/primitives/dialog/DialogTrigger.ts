import { defineComponent, h, mergeProps, onMounted, renderSlot, withCtx, type PropType } from 'vue'
import { openState } from '../../../../shared/src/primitives/collapsible'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { injectDialogRootContext } from './context'

export interface DialogTriggerProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const DialogTrigger = defineComponent({
  name: 'DialogTrigger',
  props: {
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'button',
    },
  },
  setup(props, { slots }) {
    const rootContext = injectDialogRootContext()
    const { forwardRef, currentElement } = useForwardExpose()
    rootContext.contentId ||= useId(undefined, 'reka-dialog-content')
    onMounted(() => {
      rootContext.triggerElement.value = currentElement.value
    })

    return () =>
      h(
        Primitive,
        mergeProps(props, {
          ref: forwardRef,
          type: props.as === 'button' ? 'button' : undefined,
          'aria-haspopup': 'dialog',
          'aria-expanded': rootContext.open.value || false,
          'aria-controls': rootContext.open.value ? rootContext.contentId : undefined,
          'data-state': openState(rootContext.open.value),
          onClick: rootContext.onOpenToggle,
        }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
