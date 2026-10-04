'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { inPointerCorridor } from '../../../../../shared/src/lib/pointer-corridor'
import { paginationRanges } from '../../../../../shared/src/lib/pagination'
import { useRenderTick } from '../../../lib/virtual/useRenderTick'
import type { PopoverReference } from '../../../primitives/popover'
import { usePaginationContext, type PaginationContext } from '../context'
import type { PaginationEntry, PaginationRange, PaginationSide } from '../types'

type Edge = 'first' | 'last'
type Mode = 'mouse' | 'keyboard' | 'touch'

interface KeyLike {
  key: string
  preventDefault: () => void
}

interface PointerLike {
  pointerType: string
}

interface Env {
  context: PaginationContext
  ranges: PaginationRange[]
  host: HTMLElement | null
  tick: () => Promise<void>
}

interface Snapshot {
  open: boolean
  active: PaginationSide | undefined
  displayRange: PaginationRange | undefined
  panel: HTMLElement | undefined
  rect: DOMRect | undefined
  focusRequest: { edge: Edge } | undefined
}

function createEngine(env: { current: Env }, commit: () => void) {
  const snapshot: Snapshot = {
    open: false,
    active: undefined,
    displayRange: undefined,
    panel: undefined,
    rect: undefined,
    focusRequest: undefined,
  }
  const triggers = new Map<PaginationSide, HTMLElement>()
  const detach = new Map<PaginationSide | 'panel', () => void>()
  let source: HTMLElement | undefined
  let opening: ReturnType<typeof setTimeout> | undefined
  let closing: ReturnType<typeof setTimeout> | undefined
  let mode: Mode = 'keyboard'
  let lastInput = 'keyboard'
  let restore = false
  let restoring = false
  let suppressed = false

  function set(patch: Partial<Snapshot>) {
    Object.assign(snapshot, patch)
    commit()
  }

  function cancel() {
    clearTimeout(opening)
    clearTimeout(closing)
    opening = closing = undefined
  }

  function measure() {
    const element = source
    if (!element?.isConnected) return
    const next = element.getBoundingClientRect()
    const old = snapshot.rect
    if (
      !old ||
      next.x !== old.x ||
      next.y !== old.y ||
      next.width !== old.width ||
      next.height !== old.height
    )
      set({ rect: next })
  }

  function close(returnFocus = false) {
    cancel()
    restore = returnFocus
    set({ open: false, focusRequest: undefined })
    suppressed = true
  }

  function show(side: PaginationSide, edge?: Edge) {
    cancel()
    const range = env.current.ranges.find(range => range.side === side)
    const trigger = triggers.get(side)
    if (env.current.context.blocked || !range || !trigger?.isConnected) return
    source = trigger
    const patch: Partial<Snapshot> = {
      active: side,
      displayRange: { ...range },
      rect: trigger.getBoundingClientRect(),
      open: true,
    }
    restore = false
    suppressed = false
    if (edge) patch.focusRequest = { edge }
    set(patch)
  }

  function enter(side: PaginationSide, event: PointerEvent) {
    if (event.pointerType !== 'mouse' || env.current.context.blocked) return
    mode = 'mouse'
    suppressed = false
    cancel()
    if (snapshot.open) show(side)
    else opening = setTimeout(() => show(side), 150)
  }

  function focus(side: PaginationSide) {
    if (restoring || suppressed || lastInput !== 'keyboard' || env.current.context.blocked) return
    mode = 'keyboard'
    show(side)
  }

  function leave(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || mode !== 'mouse') return
    clearTimeout(opening)
    opening = undefined
    if (!snapshot.open) return
    const a = source?.getBoundingClientRect()
    const b = snapshot.panel?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: event.clientX, y: event.clientY }, a, b)) return
    clearTimeout(closing)
    closing = setTimeout(() => close(), 100)
  }

  function keep() {
    clearTimeout(closing)
  }

  function pointerdown(event: PointerLike) {
    lastInput = event.pointerType === 'touch' ? 'touch' : 'mouse'
  }

  function click(side: PaginationSide) {
    const { context } = env.current
    if (context.blocked) return
    if (lastInput === 'touch') {
      mode = 'touch'
      show(side)
      return
    }
    const step = context.siblingCount * 2 + 1
    context.update(context.state.page + (side === 'prev' ? -step : step))
  }

  function keydown(side: PaginationSide, event: KeyLike) {
    lastInput = 'keyboard'
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    mode = 'keyboard'
    show(side, event.key === 'ArrowDown' ? 'first' : 'last')
  }

  function register(side: PaginationSide, element: HTMLElement | null) {
    detach.get(side)?.()
    detach.delete(side)
    if (element) {
      triggers.set(side, element)
      const onEnter = (event: PointerEvent) => enter(side, event)
      element.addEventListener('pointerenter', onEnter)
      element.addEventListener('pointerleave', leave)
      detach.set(side, () => {
        element.removeEventListener('pointerenter', onEnter)
        element.removeEventListener('pointerleave', leave)
      })
    } else {
      triggers.delete(side)
      if (snapshot.active === side && snapshot.open) close(mode === 'keyboard')
    }
  }

  function setPanel(element: HTMLElement | null) {
    detach.get('panel')?.()
    detach.delete('panel')
    if (element) {
      element.addEventListener('pointerenter', keep)
      element.addEventListener('pointerleave', leave)
      detach.set('panel', () => {
        element.removeEventListener('pointerenter', keep)
        element.removeEventListener('pointerleave', leave)
      })
    }
    if (snapshot.panel !== (element ?? undefined)) set({ panel: element ?? undefined })
  }

  function pick(page: number) {
    if (env.current.context.blocked) return
    close(true)
    env.current.context.update(page)
  }

  function fallback() {
    return source?.isConnected
      ? source
      : env.current.host?.querySelector<HTMLElement>('[aria-current="page"]')
  }

  function closeAutoFocus(event: Event) {
    event.preventDefault()
    const previousPanel = event.target as HTMLElement
    const { tick } = env.current
    void tick().then(() => {
      if (snapshot.open || !restore) return
      const document = previousPanel.ownerDocument
      if (
        document.activeElement !== document.body &&
        !previousPanel.contains(document.activeElement)
      )
        return
      const target = fallback()
      restoring = true
      target?.focus({ preventScroll: true })
      void tick().then(() => {
        restoring = false
      })
    })
  }

  function tab(event: { stopPropagation: () => void }) {
    event.stopPropagation()
    close()
    fallback()?.focus({ preventScroll: true })
  }

  function outside(event: Event) {
    const target = event.target as Node | null
    if ([...triggers.values()].some(trigger => target && trigger.contains(target)))
      event.preventDefault()
  }

  function rangesChanged(next: PaginationRange[]) {
    if (!snapshot.open) return
    const range = next.find(range => range.side === snapshot.active)
    if (!range) close(mode === 'keyboard')
    else set({ displayRange: { ...range } })
  }

  function blockedChanged(blocked: boolean) {
    if (blocked) close()
  }

  function documentPointerMove(event: PointerEvent) {
    if (!snapshot.open || mode !== 'mouse' || event.pointerType !== 'mouse') return
    const target = event.target as Node
    if (source?.contains(target) || snapshot.panel?.contains(target)) return keep()
    const a = source?.getBoundingClientRect()
    const b = snapshot.panel?.getBoundingClientRect()
    if (a && b && inPointerCorridor({ x: event.clientX, y: event.clientY }, a, b)) return keep()
    leave(event)
  }

  function documentKeyDown() {
    lastInput = 'keyboard'
  }

  return {
    snapshot,
    measure,
    cancel,
    close,
    enter,
    focus,
    leave,
    keep,
    click,
    pointerdown,
    keydown,
    registerPrev: (element: HTMLElement | null) => register('prev', element),
    registerNext: (element: HTMLElement | null) => register('next', element),
    setPanel,
    clearFocusRequest: () => {
      if (snapshot.focusRequest) set({ focusRequest: undefined })
    },
    pick,
    closeAutoFocus,
    tab,
    outside,
    rangesChanged,
    blockedChanged,
    documentPointerMove,
    documentKeyDown,
  }
}

function useChange<T>(value: T, effect: (value: T) => void) {
  const previous = useRef(value)
  useLayoutEffect(() => {
    if (Object.is(previous.current, value)) return
    previous.current = value
    effect(value)
  })
}

export function usePaginationEllipsis(host: HTMLElement | null, items: PaginationEntry[]) {
  const context = usePaginationContext()
  const id = useId()
  const ranges = useMemo(() => paginationRanges(items), [items])
  const tick = useRenderTick()
  const [, commit] = useReducer((count: number) => count + 1, 0)
  const env = useRef<Env>({ context, ranges, host, tick })
  env.current = { context, ranges, host, tick }
  const [engine] = useState(() => createEngine(env, commit))
  const { open, active, displayRange, panel, rect, focusRequest } = engine.snapshot
  const reference = useMemo<PopoverReference | undefined>(
    () =>
      rect ? { getBoundingClientRect: () => rect, contextElement: host ?? undefined } : undefined,
    [rect, host],
  )
  const present = open || !!panel

  useEffect(() => {
    if (!present) return
    let frame = requestAnimationFrame(function loop() {
      engine.measure()
      frame = requestAnimationFrame(loop)
    })
    return () => cancelAnimationFrame(frame)
  }, [present, engine])

  useChange(ranges, engine.rangesChanged)
  useChange(context.blocked, engine.blockedChanged)

  const document = host?.ownerDocument
  useEffect(() => {
    if (!document) return
    const pointerdown = (event: PointerEvent) => engine.pointerdown(event)
    document.addEventListener('pointerdown', pointerdown, { capture: true })
    document.addEventListener('keydown', engine.documentKeyDown, { capture: true })
    document.addEventListener('pointermove', engine.documentPointerMove)
    return () => {
      document.removeEventListener('pointerdown', pointerdown, { capture: true })
      document.removeEventListener('keydown', engine.documentKeyDown, { capture: true })
      document.removeEventListener('pointermove', engine.documentPointerMove)
    }
  }, [document, engine])

  useEffect(() => engine.cancel, [engine])

  return {
    id,
    open,
    active,
    displayRange,
    panel,
    reference,
    focusRequest,
    ranges,
    enter: engine.enter,
    focus: engine.focus,
    leave: engine.leave,
    keep: engine.keep,
    click: engine.click,
    pointerdown: engine.pointerdown,
    keydown: engine.keydown,
    register: (side: PaginationSide) =>
      side === 'prev' ? engine.registerPrev : engine.registerNext,
    setPanel: engine.setPanel,
    clearFocusRequest: engine.clearFocusRequest,
    pick: engine.pick,
    close: engine.close,
    closeAutoFocus: engine.closeAutoFocus,
    outside: engine.outside,
    tab: engine.tab,
  }
}

export type PaginationEllipsisController = ReturnType<typeof usePaginationEllipsis>
