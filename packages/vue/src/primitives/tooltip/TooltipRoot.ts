import {
  computed,
  defineComponent,
  h,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  type Ref,
} from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { PopperRoot } from '../popper'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useVModel } from '../utils/useVModel'
import {
  injectTooltipProviderContext,
  provideTooltipProviderContext,
  provideTooltipRootContext,
  TOOLTIP_OPEN,
} from './context'

export const TooltipProvider = defineComponent({
  name: 'TooltipProvider',
  inheritAttrs: false,
  props: {
    delayDuration: { type: Number, required: false, default: 700 },
    skipDelayDuration: { type: Number, required: false, default: 300 },
    disableHoverableContent: { type: Boolean, required: false, default: false },
    disableClosingTrigger: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    ignoreNonKeyboardFocus: { type: Boolean, required: false, default: false },
    content: { type: Object, required: false },
  },
  setup(props, { slots }) {
    const {
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
      disableClosingTrigger,
      ignoreNonKeyboardFocus,
      disabled,
      content,
    } = toRefs(props)
    useForwardExpose()
    const isOpenDelayed = ref(true)
    const isPointerInTransitRef = ref(false)
    const { start: startTimer, stop: clearTimer } = useTimeoutFn(
      () => {
        isOpenDelayed.value = true
      },
      skipDelayDuration,
      { immediate: false },
    )
    provideTooltipProviderContext({
      isOpenDelayed,
      delayDuration,
      onOpen() {
        clearTimer()
        isOpenDelayed.value = false
      },
      onClose() {
        startTimer()
      },
      isPointerInTransitRef,
      disableHoverableContent,
      disableClosingTrigger,
      disabled,
      ignoreNonKeyboardFocus,
      content: content as Ref<Record<string, unknown> | undefined>,
    })
    return () => renderSlot(slots, 'default')
  },
})

export const TooltipRoot = defineComponent({
  name: 'TooltipRoot',
  props: {
    defaultOpen: { type: Boolean, required: false, default: false },
    open: { type: Boolean, required: false, default: undefined },
    delayDuration: { type: Number, required: false, default: undefined },
    disableHoverableContent: { type: Boolean, required: false, default: undefined },
    disableClosingTrigger: { type: Boolean, required: false, default: undefined },
    disabled: { type: Boolean, required: false, default: undefined },
    ignoreNonKeyboardFocus: { type: Boolean, required: false, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { emit, slots }) {
    useForwardExpose()
    const providerContext = injectTooltipProviderContext()
    const disableHoverableContent = computed(
      () => props.disableHoverableContent ?? providerContext.disableHoverableContent.value,
    )
    const disableClosingTrigger = computed(
      () => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value,
    )
    const disableTooltip = computed(() => props.disabled ?? providerContext.disabled.value)
    const delayDuration = computed(() => props.delayDuration ?? providerContext.delayDuration.value)
    const ignoreNonKeyboardFocus = computed(
      () => props.ignoreNonKeyboardFocus ?? providerContext.ignoreNonKeyboardFocus.value,
    )
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: props.open === undefined,
    }) as Ref<boolean>

    watch(open, isOpen => {
      if (!providerContext.onClose) return
      if (isOpen) {
        providerContext.onOpen()
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
      } else providerContext.onClose()
    })

    const wasOpenDelayed = ref(false)
    const trigger = ref<HTMLElement>()
    const stateAttribute = computed(() => {
      if (!open.value) return 'closed'
      return wasOpenDelayed.value ? 'delayed-open' : 'instant-open'
    })

    const { start: startTimer, stop: clearTimer } = useTimeoutFn(
      () => {
        wasOpenDelayed.value = true
        open.value = true
      },
      delayDuration,
      { immediate: false },
    )

    function handleOpen() {
      clearTimer()
      wasOpenDelayed.value = false
      open.value = true
    }
    function handleClose() {
      clearTimer()
      open.value = false
    }

    provideTooltipRootContext({
      contentId: '',
      open,
      stateAttribute,
      trigger,
      onTriggerChange(element) {
        trigger.value = element
      },
      onTriggerEnter() {
        if (providerContext.isOpenDelayed.value) startTimer()
        else handleOpen()
      },
      onTriggerLeave() {
        if (disableHoverableContent.value) handleClose()
        else clearTimer()
      },
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      disableClosingTrigger,
      disabled: disableTooltip,
      ignoreNonKeyboardFocus,
    })

    return () =>
      h(PopperRoot, null, {
        default: withCtx(() => [renderSlot(slots, 'default', { open: open.value })]),
      })
  },
})
