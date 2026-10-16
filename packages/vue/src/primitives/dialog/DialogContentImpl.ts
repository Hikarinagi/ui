import {
  defineComponent,
  h,
  mergeProps,
  onMounted,
  renderSlot,
  withCtx,
  type Component,
  type PropType,
} from 'vue'
import { openState } from '../../../../shared/src/primitives/collapsible'
import { dialogWarnings, warnDialogAccessibility } from '../../../../shared/src/primitives/dialog'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import type { PrimitiveProps } from '../primitive'
import { isDevelopment } from '../utils/env'
import { DismissableLayer, FocusScope } from '../utils/layers'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { injectDialogRootContext } from './context'

export const dialogContentEmits = [
  'escapeKeyDown',
  'pointerDownOutside',
  'focusOutside',
  'interactOutside',
  'openAutoFocus',
  'closeAutoFocus',
]

export const DialogContentImpl = defineComponent({
  name: 'DialogContentImpl',
  props: {
    forceMount: { type: Boolean, required: false },
    trapFocus: { type: Boolean, required: false },
    disableOutsidePointerEvents: { type: Boolean, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    present: { type: Boolean, required: false },
  },
  emits: dialogContentEmits,
  setup(props, { emit, attrs, slots }) {
    const rootContext = injectDialogRootContext()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    rootContext.titleId ||= useId(undefined, 'reka-dialog-title')
    rootContext.descriptionId ||= useId(undefined, 'reka-dialog-description')

    onMounted(() => {
      rootContext.contentElement = contentElement
      if (getActiveElement() !== document.body)
        rootContext.triggerElement.value = getActiveElement() as HTMLElement
    })

    if (isDevelopment())
      onMounted(() =>
        warnDialogAccessibility(
          dialogWarnings(),
          rootContext.titleId,
          rootContext.descriptionId,
          contentElement.value,
        ),
      )

    const onDismiss = () => rootContext.onOpenChange(false)
    const onEscapeKeyDown = (event: Event) => emit('escapeKeyDown', event)
    const onFocusOutside = (event: Event) => emit('focusOutside', event)
    const onInteractOutside = (event: Event) => emit('interactOutside', event)
    const onPointerDownOutside = (event: Event) => emit('pointerDownOutside', event)
    const onMountAutoFocus = (event: Event) => emit('openAutoFocus', event)
    const onUnmountAutoFocus = (event: Event) => emit('closeAutoFocus', event)

    return () =>
      h(
        FocusScope as Component,
        {
          'as-child': '',
          loop: '',
          trapped: props.trapFocus,
          present: props.present,
          onMountAutoFocus,
          onUnmountAutoFocus,
        },
        {
          default: withCtx(() => [
            h(
              DismissableLayer as Component,
              mergeProps(
                {
                  id: rootContext.contentId,
                  ref: forwardRef,
                  as: props.as,
                  'as-child': props.asChild,
                  present: props.present,
                  'disable-outside-pointer-events': props.disableOutsidePointerEvents,
                  role: 'dialog',
                  'aria-describedby': rootContext.descriptionId,
                  'aria-labelledby': rootContext.titleId,
                  'data-state': openState(rootContext.open.value),
                },
                attrs,
                {
                  onDismiss,
                  onEscapeKeyDown,
                  onFocusOutside,
                  onInteractOutside,
                  onPointerDownOutside,
                },
              ),
              { default: withCtx(() => [renderSlot(slots, 'default')]) },
            ),
          ]),
        },
      )
  },
})
