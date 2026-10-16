import {
  computed,
  defineComponent,
  h,
  mergeProps,
  renderSlot,
  vShow,
  watch,
  withCtx,
  withDirectives,
  type PropType,
  type Component,
} from 'vue'
import {
  createNonModalOutsideTracker,
  isContextPointerDown,
} from '../../../../shared/src/primitives/dialog'
import { Presence } from '../presence'
import type { PrimitiveProps } from '../primitive'
import { useEmitAsProps } from '../utils/useEmitAsProps'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useHideOthers } from '../utils/useHideOthers'
import { injectDialogRootContext } from './context'
import { DialogContentImpl, dialogContentEmits } from './DialogContentImpl'

type OutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>

const variantProps = {
  forceMount: { type: Boolean, required: false },
  trapFocus: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  present: { type: Boolean, required: true },
} as const

function omitPresent<T extends { present: boolean }>(props: T) {
  const { present: _, ...rest } = props
  return rest
}

const DialogContentModal = defineComponent({
  name: 'DialogContentModal',
  props: {
    ...variantProps,
    disableOutsidePointerEvents: { type: Boolean, required: false, default: true },
  },
  emits: dialogContentEmits,
  setup(props, { emit, slots }) {
    const rootContext = injectDialogRootContext()
    const emitsAsProps = useEmitAsProps(emit as (name: string) => void)
    const { forwardRef, currentElement } = useForwardExpose()
    useHideOthers(computed(() => (props.present ? currentElement.value : undefined)))
    const forwardedProps = computed(() => omitPresent(props))

    watch(
      () => props.present,
      (isPresent, wasPresent) => {
        if (!isPresent && wasPresent) rootContext.triggerElement.value?.focus()
      },
    )

    const onCloseAutoFocus = (event: Event) => {
      if (event.defaultPrevented) return
      event.preventDefault()
      rootContext.triggerElement.value?.focus()
    }
    const onPointerDownOutside = (event: OutsideEvent) => {
      if (isContextPointerDown(event.detail.originalEvent)) event.preventDefault()
    }
    const onFocusOutside = (event: Event) => event.preventDefault()

    return () =>
      h(
        DialogContentImpl as Component,
        mergeProps(
          { ...forwardedProps.value, ...emitsAsProps },
          {
            ref: forwardRef,
            present: props.present,
            'trap-focus': rootContext.open.value,
            'disable-outside-pointer-events': props.disableOutsidePointerEvents,
            onCloseAutoFocus,
            onPointerDownOutside,
            onFocusOutside,
          },
        ),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

const DialogContentNonModal = defineComponent({
  name: 'DialogContentNonModal',
  props: {
    ...variantProps,
    disableOutsidePointerEvents: { type: Boolean, required: false },
  },
  emits: dialogContentEmits,
  setup(props, { emit, slots }) {
    const emitsAsProps = useEmitAsProps(emit as (name: string) => void)
    useForwardExpose()
    const rootContext = injectDialogRootContext()
    const outside = createNonModalOutsideTracker()
    const forwardedProps = computed(() => omitPresent(props))

    watch(
      () => props.present,
      (isPresent, wasPresent) => {
        if (!isPresent && wasPresent) {
          if (!outside.interacted) rootContext.triggerElement.value?.focus()
          outside.reset()
        }
      },
    )

    const onCloseAutoFocus = (event: Event) => {
      if (!event.defaultPrevented) {
        if (!outside.interacted) rootContext.triggerElement.value?.focus()
        event.preventDefault()
      }
      outside.reset()
    }
    const onInteractOutside = (event: OutsideEvent) =>
      outside.interact(event, rootContext.triggerElement.value)

    return () =>
      h(
        DialogContentImpl as Component,
        mergeProps(
          { ...forwardedProps.value, ...emitsAsProps },
          {
            present: props.present,
            'trap-focus': false,
            'disable-outside-pointer-events': false,
            onCloseAutoFocus,
            onInteractOutside,
          },
        ),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export interface DialogContentProps {
  forceMount?: boolean
  disableOutsidePointerEvents?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export const DialogContent = defineComponent({
  name: 'DialogContent',
  props: {
    forceMount: { type: Boolean, required: false },
    disableOutsidePointerEvents: { type: Boolean, required: false, default: undefined },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: dialogContentEmits,
  setup(props, { emit, attrs, slots }) {
    const rootContext = injectDialogRootContext()
    const emitsAsProps = useEmitAsProps(emit as (name: string) => void)
    const { forwardRef } = useForwardExpose()

    return () =>
      h(
        Presence,
        {
          present: props.forceMount || rootContext.open.value,
          forceMount: props.forceMount || !rootContext.unmountOnHide.value,
        },
        {
          default: withCtx(({ present }: { present: boolean }) => {
            const shown = rootContext.unmountOnHide.value || present
            const variant = rootContext.modal.value ? DialogContentModal : DialogContentNonModal
            return [
              withDirectives(
                h(
                  variant as Component,
                  mergeProps(
                    { key: rootContext.modal.value ? 0 : 1, ref: forwardRef, present: shown },
                    { ...props, ...emitsAsProps, ...attrs },
                  ),
                  { default: withCtx(() => [renderSlot(slots, 'default')]) },
                ),
                [[vShow, shown]],
              ),
            ]
          }),
        },
      )
  },
})
