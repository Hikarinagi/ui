import {
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  nextTick,
  normalizeProps,
  onMounted,
  ref,
  renderSlot,
  withCtx,
  withModifiers,
  type Component,
  type PropType,
} from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../dialog'
import type { PrimitiveProps } from '../primitive'
import { Teleport } from '../teleport'
import { createContext } from '../utils/createContext'
import { useEmitAsProps } from '../utils/useEmitAsProps'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useForwardPropsEmits } from '../utils/useForwardPropsEmits'

const primitive = (as?: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      ...(as ? { default: as } : {}),
    },
  }) as const

const [injectAlertDialogContentContext, provideAlertDialogContentContext] = createContext<{
  onCancelElementChange: (element: HTMLElement | undefined) => void
}>('AlertDialogContent')

function passThrough(name: string, target: Component, props: Record<string, object>) {
  return defineComponent({
    name,
    props,
    setup(rawProps, { slots }) {
      return () =>
        h(target, normalizeProps(guardReactiveProps(rawProps)), {
          default: withCtx(() => [renderSlot(slots, 'default')]),
        })
    },
  })
}

export const AlertDialogRoot = defineComponent({
  name: 'AlertDialogRoot',
  props: {
    open: { type: Boolean, required: false },
    defaultOpen: { type: Boolean, required: false },
    unmountOnHide: { type: Boolean, required: false },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()
    return () =>
      h(DialogRoot as Component, mergeProps(forwarded.value, { modal: true }), {
        default: withCtx((slotProps: Record<string, unknown>) => [
          renderSlot(slots, 'default', normalizeProps(guardReactiveProps(slotProps))),
        ]),
      })
  },
})

export const AlertDialogContent = defineComponent({
  name: 'AlertDialogContent',
  props: {
    forceMount: { type: Boolean, required: false },
    disableOutsidePointerEvents: { type: Boolean, required: false, default: undefined },
    ...primitive(),
  },
  emits: [
    'escapeKeyDown',
    'pointerDownOutside',
    'focusOutside',
    'interactOutside',
    'openAutoFocus',
    'closeAutoFocus',
  ],
  setup(props, { emit, slots }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()
    const cancelElement = ref<HTMLElement>()
    provideAlertDialogContentContext({
      onCancelElementChange: element => {
        cancelElement.value = element
      },
    })
    const prevent = withModifiers(() => {}, ['prevent'])
    return () =>
      h(
        DialogContent as Component,
        mergeProps(
          { ...props, ...emitsAsProps },
          {
            role: 'alertdialog',
            onPointerDownOutside: prevent,
            onInteractOutside: prevent,
            onOpenAutoFocus: () => {
              void nextTick(() => cancelElement.value?.focus({ preventScroll: true }))
            },
          },
        ),
        { default: withCtx(() => [renderSlot(slots, 'default')]) },
      )
  },
})

export const AlertDialogCancel = defineComponent({
  name: 'AlertDialogCancel',
  props: primitive('button'),
  setup(props, { slots }) {
    const contentContext = injectAlertDialogContentContext()
    const { forwardRef, currentElement } = useForwardExpose()
    onMounted(() => contentContext.onCancelElementChange(currentElement.value))
    return () =>
      h(DialogClose as Component, mergeProps(props, { ref: forwardRef }), {
        default: withCtx(() => [renderSlot(slots, 'default')]),
      })
  },
})

export const AlertDialogAction = passThrough(
  'AlertDialogAction',
  DialogClose as Component,
  primitive('button'),
)
export const AlertDialogTitle = passThrough(
  'AlertDialogTitle',
  DialogTitle as Component,
  primitive('h2'),
)
export const AlertDialogDescription = passThrough(
  'AlertDialogDescription',
  DialogDescription as Component,
  primitive('p'),
)
export const AlertDialogOverlay = passThrough('AlertDialogOverlay', DialogOverlay as Component, {
  forceMount: { type: Boolean, required: false },
  ...primitive(),
})
export const AlertDialogTrigger = passThrough(
  'AlertDialogTrigger',
  DialogTrigger as Component,
  primitive('button'),
)
export const AlertDialogPortal = passThrough('AlertDialogPortal', Teleport as Component, {
  to: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  defer: { type: Boolean, required: false },
  forceMount: { type: Boolean, required: false },
})
