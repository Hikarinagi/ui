import { computed, onScopeDispose, shallowRef, watch, type ComponentPublicInstance } from 'vue'
import { useEventListener, useRafFn } from '@vueuse/core'
import { injectHoverCardRootContext } from 'reka-ui'
import { useOverlayPortal } from '../../../lib/overlay-portal'
import { inPointerCorridor } from '../../../lib/pointer-corridor'

interface HoverCardAnchorOptions {
  anchor?: HTMLElement | null
  external: boolean
  closeDelay: number
}

export function useHoverCardAnchor(props: HoverCardAnchorOptions) {
  const root = injectHoverCardRootContext()
  const original = { onOpen: root.onOpen, onClose: root.onClose, onDismiss: root.onDismiss }
  const anchor = computed(() => (props.external ? (props.anchor ?? undefined) : undefined))
  const { content, present } = useOverlayPortal(root.open)
  const panel = computed(() =>
    props.external ? (content.value?.$el as HTMLElement | undefined) : undefined,
  )
  const retained = shallowRef<{
    getBoundingClientRect: () => DOMRect
    contextElement: HTMLElement
  }>()
  const reference = computed(() =>
    props.external
      ? root.open.value && anchor.value?.isConnected
        ? anchor.value
        : retained.value
      : undefined,
  )
  let timer: ReturnType<typeof setTimeout> | undefined
  let tracking = false

  function cancel() {
    clearTimeout(timer)
    timer = undefined
  }

  function dismiss() {
    cancel()
    tracking = false
    root.onOpenChange(false)
  }

  function close() {
    if (
      timer !== undefined ||
      !root.open.value ||
      root.hasSelectionRef.value ||
      root.isPointerDownOnContentRef.value
    )
      return
    timer = setTimeout(dismiss, props.closeDelay)
  }

  function keep() {
    tracking = false
    cancel()
  }

  function track(event: Event) {
    const pointer = event as PointerEvent
    if (!root.open.value || !tracking || pointer.pointerType === 'touch') return
    const target = pointer.target as Node | null
    if (target && (anchor.value?.contains(target) || panel.value?.contains(target))) return keep()
    const a = anchor.value?.getBoundingClientRect()
    const b = panel.value?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b)) cancel()
    else close()
  }

  function leave(event: Event) {
    const pointer = event as PointerEvent
    if (pointer.pointerType === 'touch' || !root.open.value) return
    tracking = true
    const a = anchor.value?.getBoundingClientRect()
    const b = panel.value?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b)) cancel()
    else close()
  }

  function measure() {
    const element = anchor.value
    if (!element?.isConnected) return dismiss()
    const rect = element.getBoundingClientRect()
    const previous = retained.value?.getBoundingClientRect()
    if (
      !previous ||
      retained.value?.contextElement !== element ||
      rect.x !== previous.x ||
      rect.y !== previous.y ||
      rect.width !== previous.width ||
      rect.height !== previous.height
    )
      retained.value = { getBoundingClientRect: () => rect, contextElement: element }
  }

  const { pause, resume } = useRafFn(measure, { immediate: false })
  root.onOpen = () => (props.external ? keep() : original.onOpen())
  root.onClose = () => (props.external ? close() : original.onClose())
  root.onDismiss = () => (props.external ? dismiss() : original.onDismiss())

  watch(
    [anchor, root.open],
    ([element, open], previous) => {
      cancel()
      tracking = false
      pause()
      if (!props.external) return
      if (element !== previous?.[0]) {
        root.hasSelectionRef.value = false
        root.isPointerDownOnContentRef.value = false
      }
      if (!open) return
      if (!element?.isConnected) return dismiss()
      measure()
      resume()
    },
    { immediate: true, flush: 'post' },
  )

  useEventListener(anchor, 'pointerenter', keep)
  useEventListener(anchor, 'pointerleave', leave)
  useEventListener(anchor, 'focusin', keep)
  useEventListener(anchor, 'focusout', event => {
    const target = (event as FocusEvent).relatedTarget as Node | null
    if (!target || (!anchor.value?.contains(target) && !panel.value?.contains(target))) close()
  })
  useEventListener(panel, 'pointerenter', keep)
  useEventListener(panel, 'pointerleave', leave)
  useEventListener(() => anchor.value?.ownerDocument, 'pointermove', track)
  useEventListener(
    () => anchor.value?.ownerDocument,
    'scroll',
    event => {
      if (root.open.value && (event.target as Node | null)?.contains(anchor.value ?? null))
        dismiss()
    },
    { capture: true, passive: true },
  )

  onScopeDispose(() => {
    cancel()
    Object.assign(root, original)
  })

  function contentRef(value: Element | ComponentPublicInstance | null) {
    content.value = value as ComponentPublicInstance | null
    if (!value && !root.open.value) retained.value = undefined
  }

  return { reference, contentRef, present }
}
