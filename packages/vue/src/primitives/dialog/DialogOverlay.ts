import {
  createCommentVNode,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  vShow,
  watch,
  withCtx,
  withDirectives,
  withModifiers,
  type PropType,
} from 'vue'
import { openState } from '../../../../shared/src/primitives/collapsible'
import { Presence } from '../presence'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useBodyScrollLock } from '../utils/layers'
import { useForwardExpose } from '../utils/useForwardExpose'
import { injectDialogRootContext } from './context'

export interface DialogOverlayProps {
  forceMount?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

const DialogOverlayImpl = defineComponent({
  name: 'DialogOverlayImpl',
  props: {
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    present: { type: Boolean, required: false, default: true },
  },
  setup(props, { slots }) {
    const rootContext = injectDialogRootContext()
    const scrollLocked = useBodyScrollLock(props.present)
    watch(
      () => props.present,
      value => (scrollLocked.value = value),
    )
    useForwardExpose()
    const onPointerdown = withModifiers(() => {}, ['left', 'self', 'prevent'])

    return () =>
      h(
        Primitive,
        {
          as: props.as,
          'as-child': props.asChild,
          'data-state': openState(rootContext.open.value),
          style: { 'pointer-events': 'auto' },
          onPointerdown,
        },
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const DialogOverlay = defineComponent({
  name: 'DialogOverlay',
  props: {
    forceMount: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  setup(props, { attrs, slots }) {
    const rootContext = injectDialogRootContext()
    const { forwardRef } = useForwardExpose()

    return () =>
      rootContext?.modal.value
        ? h(
            Presence,
            {
              key: 0,
              present: props.forceMount || rootContext.open.value,
              forceMount: props.forceMount || !rootContext.unmountOnHide.value,
            },
            {
              default: withCtx(({ present }: { present: boolean }) => [
                withDirectives(
                  h(
                    DialogOverlayImpl,
                    mergeProps(attrs, {
                      ref: forwardRef,
                      as: props.as,
                      'as-child': props.asChild,
                      present: rootContext.unmountOnHide.value || present,
                    }),
                    { default: withCtx(() => [renderSlot(slots, 'default')]) },
                  ),
                  [[vShow, rootContext.unmountOnHide.value || present]],
                ),
              ]),
            },
          )
        : createCommentVNode('v-if', true)
  },
})
