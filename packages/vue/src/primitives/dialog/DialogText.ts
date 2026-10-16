import { defineComponent, h, mergeProps, renderSlot, withCtx, type PropType } from 'vue'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectDialogRootContext } from './context'

export interface DialogTextProps {
  asChild?: boolean
  as?: PrimitiveProps['as']
}

function asProp(fallback: string) {
  return {
    type: null as unknown as PropType<PrimitiveProps['as']>,
    required: false,
    default: fallback,
  } as const
}

export const DialogTitle = defineComponent({
  name: 'DialogTitle',
  props: { asChild: { type: Boolean, required: false }, as: asProp('h2') },
  setup(props, { slots }) {
    const rootContext = injectDialogRootContext()
    useForwardExpose()
    return () =>
      h(Primitive, mergeProps(props, { id: rootContext.titleId }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const DialogDescription = defineComponent({
  name: 'DialogDescription',
  props: { asChild: { type: Boolean, required: false }, as: asProp('p') },
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectDialogRootContext()
    return () =>
      h(Primitive, mergeProps(props, { id: rootContext.descriptionId }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const DialogClose = defineComponent({
  name: 'DialogClose',
  props: { asChild: { type: Boolean, required: false }, as: asProp('button') },
  setup(props, { slots }) {
    useForwardExpose()
    const rootContext = injectDialogRootContext()
    const onClick = () => rootContext.onOpenChange(false)
    return () =>
      h(
        Primitive,
        mergeProps(props, { type: props.as === 'button' ? 'button' : undefined, onClick }),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})
