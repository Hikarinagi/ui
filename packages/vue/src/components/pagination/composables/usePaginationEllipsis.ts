import {
  computed,
  nextTick,
  onScopeDispose,
  ref,
  shallowRef,
  useId,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import { usePaginationContext } from '../context'
import { paginationRanges } from '../utils/ranges'
import { inPointerCorridor } from '../../../lib/pointer-corridor'
import type { PaginationEntry, PaginationRange, PaginationSide } from '../types'

export function usePaginationEllipsis(
  host: Ref<HTMLElement | undefined>,
  items: () => PaginationEntry[],
) {
  const context = usePaginationContext()
  const id = useId()
  const ranges = computed(() => paginationRanges(items()))
  const open = ref(false)
  const active = ref<PaginationSide>()
  const displayRange = shallowRef<PaginationRange>()
  const panel = shallowRef<HTMLElement>()
  const source = shallowRef<HTMLElement>()
  const rect = shallowRef<DOMRect>()
  const focusRequest = shallowRef<{ edge: 'first' | 'last' }>()
  const reference = computed(() =>
    rect.value
      ? { getBoundingClientRect: () => rect.value!, contextElement: host.value }
      : undefined,
  )
  const triggers = new Map<PaginationSide, HTMLElement>()
  let opening: ReturnType<typeof setTimeout> | undefined
  let closing: ReturnType<typeof setTimeout> | undefined
  let frame: number | undefined
  let mode: 'mouse' | 'keyboard' | 'touch' = 'keyboard'
  let lastInput = 'keyboard'
  let restore = false
  let restoring = false
  let suppressed = false

  function cancel() {
    clearTimeout(opening)
    clearTimeout(closing)
    opening = closing = undefined
  }

  function measure() {
    const element = source.value
    if (!open.value || !element?.isConnected) return
    const next = element.getBoundingClientRect()
    const old = rect.value
    if (
      !old ||
      next.x !== old.x ||
      next.y !== old.y ||
      next.width !== old.width ||
      next.height !== old.height
    )
      rect.value = next
    frame = element.ownerDocument.defaultView?.requestAnimationFrame(measure)
  }

  function close(returnFocus = false) {
    cancel()
    if (frame !== undefined) source.value?.ownerDocument.defaultView?.cancelAnimationFrame(frame)
    frame = undefined
    restore = returnFocus
    open.value = false
    focusRequest.value = undefined
    suppressed = true
  }

  function show(side: PaginationSide, edge?: 'first' | 'last') {
    cancel()
    const range = ranges.value.find(range => range.side === side)
    const trigger = triggers.get(side)
    if (context.blocked.value || !range || !trigger?.isConnected) return
    source.value = trigger
    active.value = side
    displayRange.value = { ...range }
    rect.value = trigger.getBoundingClientRect()
    restore = false
    open.value = true
    suppressed = false
    if (frame !== undefined) trigger.ownerDocument.defaultView?.cancelAnimationFrame(frame)
    measure()
    if (edge) focusRequest.value = { edge }
  }

  function enter(side: PaginationSide, event: PointerEvent) {
    if (event.pointerType !== 'mouse' || context.blocked.value) return
    mode = 'mouse'
    suppressed = false
    cancel()
    if (open.value) show(side)
    else opening = setTimeout(() => show(side), 150)
  }

  function focus(side: PaginationSide) {
    if (restoring || suppressed || lastInput !== 'keyboard' || context.blocked.value) return
    mode = 'keyboard'
    show(side)
  }

  function leave(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || mode !== 'mouse') return
    clearTimeout(opening)
    opening = undefined
    if (!open.value) return
    const a = source.value?.getBoundingClientRect()
    const b = panel.value?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: event.clientX, y: event.clientY }, a, b)) return
    clearTimeout(closing)
    closing = setTimeout(() => close(), 100)
  }

  function keep() {
    clearTimeout(closing)
  }

  function pointerdown(event: PointerEvent) {
    lastInput = event.pointerType === 'touch' ? 'touch' : 'mouse'
  }

  function click(side: PaginationSide) {
    if (context.blocked.value) return
    if (lastInput === 'touch') {
      mode = 'touch'
      show(side)
      return
    }
    const step = context.siblingCount.value * 2 + 1
    context.update(context.state.value.page + (side === 'prev' ? -step : step))
  }

  function keydown(side: PaginationSide, event: KeyboardEvent) {
    lastInput = 'keyboard'
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    mode = 'keyboard'
    show(side, event.key === 'ArrowDown' ? 'first' : 'last')
  }

  function register(side: PaginationSide, value: Element | ComponentPublicInstance | null) {
    const element = value && ('$el' in value ? value.$el : value)
    if (element instanceof HTMLElement) triggers.set(side, element)
    else {
      triggers.delete(side)
      if (active.value === side && open.value) close(mode === 'keyboard')
    }
  }

  function pick(page: number) {
    if (context.blocked.value) return
    close(true)
    context.update(page)
  }

  function closeAutoFocus(event: Event) {
    event.preventDefault()
    const previousPanel = event.target as HTMLElement
    nextTick(() => {
      if (open.value || !restore) return
      const document = previousPanel.ownerDocument
      if (
        document.activeElement !== document.body &&
        !previousPanel.contains(document.activeElement)
      )
        return
      const target = source.value?.isConnected
        ? source.value
        : host.value?.querySelector<HTMLElement>('[aria-current="page"]')
      restoring = true
      target?.focus({ preventScroll: true })
      nextTick(() => {
        restoring = false
      })
    })
  }

  function tab(event: KeyboardEvent) {
    event.stopPropagation()
    close()
    const target = source.value?.isConnected
      ? source.value
      : host.value?.querySelector<HTMLElement>('[aria-current="page"]')
    target?.focus({ preventScroll: true })
  }

  function outside(event: Event) {
    const target = event.target as Node | null
    if ([...triggers.values()].some(trigger => target && trigger.contains(target)))
      event.preventDefault()
  }

  watch(ranges, next => {
    if (!open.value) return
    const range = next.find(range => range.side === active.value)
    if (!range) close(mode === 'keyboard')
    else displayRange.value = { ...range }
  })
  watch(context.blocked, blocked => {
    if (blocked) close()
  })
  useEventListener(
    () => host.value?.ownerDocument,
    'pointerdown',
    event => {
      pointerdown(event as PointerEvent)
    },
    { capture: true },
  )
  useEventListener(
    () => host.value?.ownerDocument,
    'keydown',
    () => {
      lastInput = 'keyboard'
    },
    { capture: true },
  )
  useEventListener(
    () => host.value?.ownerDocument,
    'pointermove',
    event => {
      const pointer = event as PointerEvent
      if (!open.value || mode !== 'mouse' || pointer.pointerType !== 'mouse') return
      const target = event.target as Node
      if (source.value?.contains(target) || panel.value?.contains(target)) return keep()
      const a = source.value?.getBoundingClientRect()
      const b = panel.value?.getBoundingClientRect()
      if (a && b && inPointerCorridor({ x: pointer.clientX, y: pointer.clientY }, a, b))
        return keep()
      leave(pointer)
    },
  )
  onScopeDispose(() => {
    cancel()
    if (frame !== undefined) source.value?.ownerDocument.defaultView?.cancelAnimationFrame(frame)
  })
  return {
    id,
    open,
    active,
    displayRange,
    panel,
    reference,
    focusRequest,
    ranges,
    enter,
    focus,
    leave,
    keep,
    click,
    pointerdown,
    keydown,
    register,
    pick,
    close,
    closeAutoFocus,
    outside,
    tab,
  }
}

export type PaginationEllipsisController = ReturnType<typeof usePaginationEllipsis>
