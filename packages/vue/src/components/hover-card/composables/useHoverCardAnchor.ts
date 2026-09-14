import { computed, onScopeDispose, watch, type ComponentPublicInstance } from 'vue'
import { useEventListener, useRafFn } from '@vueuse/core'
import { injectHoverCardRootContext } from 'reka-ui'
import {
  overlayAnchorElement,
  useOverlayAnchor,
  type OverlayAnchor,
  type OverlayPositionStrategy,
} from '../../../lib/overlay-anchor'
import { useOverlayPortal } from '../../../lib/overlay-portal'
import { useOverlayPositionerClass } from '../../../lib/overlay-positioner'
import { inPointerCorridor } from '../../../lib/pointer-corridor'

interface HoverCardAnchorOptions {
  anchor?: OverlayAnchor | null
  updatePositionStrategy: OverlayPositionStrategy
  external: boolean
  closeDelay: number
  positionerClass?: string
}

export function useHoverCardAnchor(props: HoverCardAnchorOptions) {
  const root = injectHoverCardRootContext()
  const original = { onOpen: root.onOpen, onClose: root.onClose, onDismiss: root.onDismiss }
  const anchor = computed(() => (props.external ? (props.anchor ?? undefined) : undefined))
  const element = computed(() => overlayAnchorElement(anchor.value))
  const virtual = computed(() => !!anchor.value && !element.value)
  const { content, present } = useOverlayPortal(root.open)
  useOverlayPositionerClass(content, () => props.positionerClass)
  const panel = computed(() =>
    props.external ? (content.value?.$el as HTMLElement | undefined) : undefined,
  )
  const reference = useOverlayAnchor(
    () => (props.external ? anchor.value : root.triggerElement.value),
    root.open,
    present,
    () => props.updatePositionStrategy,
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
      virtual.value ||
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
    if (target && (element.value?.contains(target) || panel.value?.contains(target))) return keep()
    const a = element.value?.getBoundingClientRect()
    const b = panel.value?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b)) cancel()
    else close()
  }

  function leave(event: Event) {
    const pointer = event as PointerEvent
    if (virtual.value || pointer.pointerType === 'touch' || !root.open.value) return
    tracking = true
    const a = element.value?.getBoundingClientRect()
    const b = panel.value?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b)) cancel()
    else close()
  }

  function measure() {
    if (!anchor.value || (element.value && !element.value.isConnected)) {
      if (root.open.value) dismiss()
      return
    }
    reference.value?.getBoundingClientRect()
  }

  const { pause, resume } = useRafFn(measure, { immediate: false })
  root.onOpen = () => (props.external ? keep() : original.onOpen())
  root.onClose = () => (props.external ? close() : original.onClose())
  root.onDismiss = () => (props.external ? dismiss() : original.onDismiss())

  watch(
    [anchor, root.open, present],
    ([element, , mounted], previous) => {
      cancel()
      tracking = false
      pause()
      if (!props.external || !mounted) return
      if (element !== previous?.[0]) {
        root.hasSelectionRef.value = false
        root.isPointerDownOnContentRef.value = false
      }
      measure()
      if (!virtual.value) resume()
    },
    { immediate: true, flush: 'post' },
  )

  useEventListener(element, 'pointerenter', keep)
  useEventListener(element, 'pointerleave', leave)
  useEventListener(element, 'focusin', keep)
  useEventListener(element, 'focusout', event => {
    const target = (event as FocusEvent).relatedTarget as Node | null
    if (!target || (!element.value?.contains(target) && !panel.value?.contains(target))) close()
  })
  useEventListener(panel, 'pointerenter', keep)
  useEventListener(panel, 'pointerleave', leave)
  useEventListener(() => element.value?.ownerDocument, 'pointermove', track)
  useEventListener(
    () => element.value?.ownerDocument,
    'scroll',
    event => {
      if (root.open.value && (event.target as Node | null)?.contains(element.value ?? null))
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
  }

  return { reference, contentRef, present }
}
