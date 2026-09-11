import { computed, nextTick, shallowRef, watch, type Ref } from 'vue'
import type { DropdownMenuContentEmits } from 'reka-ui'

export function useAnchoredOverlay(
  props: { anchor?: HTMLElement | null; modal: boolean },
  open: Ref<boolean | undefined>,
  emit: <K extends keyof DropdownMenuContentEmits>(
    event: K,
    ...args: DropdownMenuContentEmits[K]
  ) => void,
  openAutoFocus?: (event: Event) => void,
) {
  const trigger = shallowRef<{ $el: HTMLElement } | null>(null)
  const triggerElement = computed(() =>
    trigger.value?.$el?.nodeType === 1 ? trigger.value.$el : undefined,
  )
  const retainedAnchor = shallowRef<HTMLElement>()
  const reference = computed(
    () =>
      props.anchor ??
      (open.value
        ? (triggerElement.value ?? retainedAnchor.value)
        : (retainedAnchor.value ?? triggerElement.value)),
  )
  const visible = computed({
    get: () => !!open.value && !!(props.anchor || triggerElement.value),
    set: value => {
      open.value = value
    },
  })

  watch(
    () => props.anchor,
    anchor => {
      if (anchor) retainedAnchor.value = anchor
    },
    { immediate: true, flush: 'sync' },
  )

  let previousFocus: HTMLElement | null = null
  let interactedOutside = false

  function once<E extends Event>(handler: (event: E) => void) {
    const handled = new WeakSet<E>()
    return (event: E) => {
      if (handled.has(event)) return
      handled.add(event)
      handler(event)
    }
  }

  watch(
    visible,
    active => {
      if (!active) return
      const document = props.anchor?.ownerDocument ?? triggerElement.value?.ownerDocument
      previousFocus = document?.activeElement as HTMLElement | null
      interactedOutside = false
    },
    { immediate: true, flush: 'sync' },
  )

  const onCloseAutoFocus = once((event: Event) => {
    emit('closeAutoFocus', event)
    const cancelled = event.defaultPrevented
    event.preventDefault()
    const panel = event.target as HTMLElement
    const target = triggerElement.value ?? previousFocus
    const restore = !cancelled && !interactedOutside
    nextTick(() => {
      const active = panel.ownerDocument.activeElement
      if (
        restore &&
        !visible.value &&
        target?.isConnected &&
        (active === panel.ownerDocument.body || panel.contains(active))
      )
        target.focus({ preventScroll: true })
      if (!visible.value) retainedAnchor.value = undefined
    })
  })

  const onInteractOutside = once((event: DropdownMenuContentEmits['interactOutside'][0]) => {
    if (!triggerElement.value && props.anchor?.contains(event.target as Node))
      event.preventDefault()
    emit('interactOutside', event)
    const original = event.detail.originalEvent
    const rightClick =
      'button' in original && (original.button === 2 || (original.button === 0 && original.ctrlKey))
    if (!event.defaultPrevented && (!props.modal || rightClick)) interactedOutside = true
  })

  return {
    trigger,
    reference,
    visible,
    events: {
      ...(openAutoFocus ? { onOpenAutoFocus: once(openAutoFocus) } : {}),
      onCloseAutoFocus,
      onInteractOutside,
      onPointerDownOutside: once((event: DropdownMenuContentEmits['pointerDownOutside'][0]) =>
        emit('pointerDownOutside', event),
      ),
      onFocusOutside: once((event: DropdownMenuContentEmits['focusOutside'][0]) =>
        emit('focusOutside', event),
      ),
      onEscapeKeyDown: once((event: KeyboardEvent) => emit('escapeKeyDown', event)),
    },
  }
}
