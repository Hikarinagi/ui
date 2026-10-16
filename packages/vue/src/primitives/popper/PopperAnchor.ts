import { defineComponent, h, renderSlot, watchPostEffect, withCtx, type PropType } from 'vue'
import type { ReferenceElement } from '@floating-ui/vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectPopperRootContext } from './context'

export interface PopperAnchorProps {
  reference?: ReferenceElement
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const PopperAnchor = defineComponent({
  name: 'PopperAnchor',
  props: {
    reference: { type: null as unknown as PropType<ReferenceElement>, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { slots }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectPopperRootContext()
    watchPostEffect(() => {
      rootContext.onAnchorChange(props.reference ?? currentElement.value)
    })
    return () =>
      h(
        Primitive,
        { ref: forwardRef, as: props.as, 'as-child': props.asChild },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
