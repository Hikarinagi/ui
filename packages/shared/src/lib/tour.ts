import { autoUpdate } from '@floating-ui/dom'
import { hideOutsideLayers, isHighestLayer } from '../primitives/dismissable-layer'
import { getActiveElement, getTabbableCandidates } from '../primitives/focus-scope'
import { cssTimeToMs } from './css-time'

export type TourSide = 'top' | 'right' | 'bottom' | 'left'
export type TourAlign = 'start' | 'center' | 'end'

export interface TourRectLike {
  x?: number
  y?: number
  left?: number
  top?: number
  width: number
  height: number
}

export interface TourVirtualElement {
  getBoundingClientRect: () => TourRectLike
  contextElement?: Element
}

export type TourTargetItem = string | Element | TourRectLike | TourVirtualElement
export type TourTarget =
  | TourTargetItem
  | TourTargetItem[]
  | (() => TourTargetItem | TourTargetItem[] | null | undefined)
  | null

export type TourPointerKind = 'mouse' | 'touch'
export type TourCloseReason = 'finish' | 'skip' | 'escape' | 'close'

export interface TourPoint {
  x: number
  y: number
}

export interface TourPointer {
  move: (target: TourTarget | TourPoint, duration?: number) => Promise<void>
  tap: () => Promise<void>
  press: (duration?: number) => Promise<void>
  drag: (
    target: TourTarget | TourPoint,
    duration?: number,
    onMove?: (point: TourPoint) => void,
  ) => Promise<void>
  key: (key: string, duration?: number) => Promise<void>
  hide: () => Promise<void>
}

export interface TourSpotlightOptions {
  padding?: number
  radius?: number
  wait?: number
}

export interface TourPlayContext {
  step: number
  signal: AbortSignal
  defer: (cleanup: () => void) => void
  pointer: TourPointer
  spotlight: (target?: TourTarget, options?: TourSpotlightOptions) => Promise<void>
  waitFor: (target: TourTarget, timeout?: number) => Promise<boolean>
  sleep: (ms: number) => Promise<void>
}

export type TourPlay = (context: TourPlayContext) => void | Promise<void>

export interface TourStepBase {
  target?: TourTarget
  title?: string
  description?: string
  side?: TourSide
  align?: TourAlign
  padding?: number
  radius?: number
  blockTarget?: boolean
  blockPage?: boolean
  scroll?: boolean
  beacon?: boolean
  wait?: number
  play?: TourPlay
}

export type TourBeforeChange = (
  step: number,
  previousStep: number,
) => boolean | void | Promise<boolean | void>

export interface TourRect {
  x: number
  y: number
  width: number
  height: number
}

export const TOUR_PADDING = 8
export const TOUR_RADIUS = 8
export const TOUR_SIDE_OFFSET = 12
export const TOUR_ARROW_WIDTH = 16
export const TOUR_ARROW_HEIGHT = 8
export const TOUR_ARROW_PADDING = 12
export const TOUR_ARROW_PATH = 'M0 0L6 6L12 0'

export function tourBeaconOnArrival(step: TourStepBase, beacon: boolean, navigated: boolean) {
  return navigated ? step.beacon === true : (step.beacon ?? beacon) === true
}

export function tourTargetBlocked(step: TourStepBase, blockTarget: boolean) {
  return step.blockTarget ?? blockTarget
}

export function tourPageBlocked(step: TourStepBase, blockPage: boolean) {
  return step.blockPage ?? blockPage
}

export interface TourResolvedTarget {
  elements: HTMLElement[]
  virtual: boolean
  rect: () => TourRect
}

function toRect(rect: TourRectLike): TourRect {
  return {
    x: rect.left ?? rect.x ?? 0,
    y: rect.top ?? rect.y ?? 0,
    width: rect.width,
    height: rect.height,
  }
}

export function unionRect(rects: TourRect[]): TourRect {
  const left = Math.min(...rects.map(rect => rect.x))
  const top = Math.min(...rects.map(rect => rect.y))
  const right = Math.max(...rects.map(rect => rect.x + rect.width))
  const bottom = Math.max(...rects.map(rect => rect.y + rect.height))
  return { x: left, y: top, width: right - left, height: bottom - top }
}

type TourItemReader = { element: HTMLElement | null; read: () => TourRect }

function readItem(item: TourTargetItem): TourItemReader | null {
  if (typeof item === 'string') {
    if (typeof document === 'undefined') return null
    const element = document.querySelector<HTMLElement>(item)
    return element ? { element, read: () => toRect(element.getBoundingClientRect()) } : null
  }
  if (typeof Element !== 'undefined' && item instanceof Element)
    return { element: item as HTMLElement, read: () => toRect(item.getBoundingClientRect()) }
  if (typeof (item as TourVirtualElement).getBoundingClientRect === 'function') {
    const virtual = item as TourVirtualElement
    return { element: null, read: () => toRect(virtual.getBoundingClientRect()) }
  }
  const rect = toRect(item as TourRectLike)
  return { element: null, read: () => rect }
}

export function resolveTourTarget(target: TourTarget | undefined): TourResolvedTarget | null {
  if (!target) return null
  const value = typeof target === 'function' ? target() : target
  if (!value) return null
  const items = Array.isArray(value) ? value : [value]
  if (!items.length) return null
  const readers: TourItemReader[] = []
  for (const item of items) {
    const reader = item ? readItem(item) : null
    if (!reader) return null
    readers.push(reader)
  }
  return {
    elements: readers.flatMap(reader => (reader.element ? [reader.element] : [])),
    virtual: readers.some(reader => !reader.element),
    rect: () => unionRect(readers.map(reader => reader.read())),
  }
}

export function waitForTourTarget(
  target: TourTarget | undefined,
  timeout: number,
  signal?: AbortSignal,
): Promise<TourResolvedTarget | null> {
  const found = resolveTourTarget(target)
  if (found || timeout <= 0 || signal?.aborted) return Promise.resolve(found)
  return new Promise(resolve => {
    const check = () => {
      const resolved = resolveTourTarget(target)
      if (resolved) finish(resolved)
    }
    const observer = new MutationObserver(check)
    const interval = window.setInterval(check, 100)
    const timer = window.setTimeout(() => finish(null), timeout)
    const abort = () => finish(null)
    function finish(value: TourResolvedTarget | null) {
      observer.disconnect()
      window.clearInterval(interval)
      window.clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      resolve(value)
    }
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    })
    signal?.addEventListener('abort', abort)
  })
}

export function clampTourStep(step: number | undefined, count: number) {
  if (count <= 0) return 1
  const value = Number.isFinite(step) ? Math.trunc(step as number) : 1
  return Math.min(Math.max(value, 1), count)
}

export function spotlightRect(
  rect: { left: number; top: number; width: number; height: number },
  padding = TOUR_PADDING,
): TourRect {
  return {
    x: rect.left - padding,
    y: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  }
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

export function spotlightPath(
  viewport: { width: number; height: number },
  hole: TourRect,
  radius = TOUR_RADIUS,
) {
  const { width, height } = viewport
  const r = round(Math.max(0, Math.min(radius, hole.width / 2, hole.height / 2)))
  const x = round(hole.x)
  const y = round(hole.y)
  const right = round(hole.x + hole.width)
  const bottom = round(hole.y + hole.height)
  const outer = `M0 0H${round(width)}V${round(height)}H0Z`
  const inner =
    `M${round(x + r)} ${y}H${round(right - r)}A${r} ${r} 0 0 1 ${right} ${round(y + r)}` +
    `V${round(bottom - r)}A${r} ${r} 0 0 1 ${round(right - r)} ${bottom}` +
    `H${round(x + r)}A${r} ${r} 0 0 1 ${x} ${round(bottom - r)}` +
    `V${round(y + r)}A${r} ${r} 0 0 1 ${round(x + r)} ${y}Z`
  return `path(evenodd, '${outer}${inner}')`
}

export interface TourSpotlight {
  shape: string
  origin: string
}

export type TourHoleState = 'shown' | 'hidden'

export function spotlightShape(
  viewport: { width: number; height: number },
  hole: TourRect,
  radius = TOUR_RADIUS,
): TourSpotlight {
  const centre = { x: hole.x + hole.width / 2, y: hole.y + hole.height / 2, width: 0, height: 0 }
  return {
    shape: spotlightPath(viewport, hole, radius),
    origin: spotlightPath(viewport, centre, 0),
  }
}

export function spotlightMask(
  spotlight: TourSpotlight | null,
  last: TourSpotlight | null,
): { hole?: TourHoleState; style?: Record<string, string> } {
  if (spotlight)
    return {
      hole: 'shown',
      style: { clipPath: spotlight.shape, '--hn-tour-hole-origin': spotlight.origin },
    }
  if (last)
    return {
      hole: 'hidden',
      style: { '--hn-tour-hole': last.shape, '--hn-tour-hole-origin': last.origin },
    }
  return {}
}

export function beaconPoint(rect: TourRect, dir: 'ltr' | 'rtl') {
  return { x: dir === 'rtl' ? rect.x : rect.x + rect.width, y: rect.y }
}

export function tourKeyAction(event: KeyboardEvent, dir: 'ltr' | 'rtl') {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return null
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'))
    return null
  const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  const backward = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
  if (event.key === forward) return 'next' as const
  if (event.key === backward) return 'prev' as const
  return null
}

export async function runTourChange(
  beforeChange: TourBeforeChange | undefined,
  step: number,
  previousStep: number,
  setBusy: (busy: boolean) => void,
) {
  if (!beforeChange) return true
  const result = beforeChange(step, previousStep)
  if (!(result instanceof Promise)) return result !== false
  setBusy(true)
  try {
    return (await result) !== false
  } finally {
    setBusy(false)
  }
}

export function tourCardGap(element?: Element | null) {
  return cssTimeToMs(
    getComputedStyle(element ?? document.documentElement).getPropertyValue('--hn-duration-exit'),
  )
}

export function tourReference(read: () => TourRect | null, contextElement?: Element | null) {
  return {
    contextElement: contextElement ?? undefined,
    getBoundingClientRect() {
      const rect = read() ?? { x: 0, y: 0, width: 0, height: 0 }
      return {
        ...rect,
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height,
      }
    },
  }
}

export function watchTourTarget(resolved: TourResolvedTarget, onChange: () => void) {
  onChange()
  const stops = resolved.elements.map(element =>
    autoUpdate(element, document.documentElement, onChange),
  )
  if (resolved.virtual)
    stops.push(
      autoUpdate(
        { getBoundingClientRect: () => DOMRect.fromRect(resolved.rect()) },
        document.documentElement,
        onChange,
        { animationFrame: true },
      ),
    )
  return () => {
    for (const stop of stops) stop()
  }
}

export function isFullyVisible(rect: TourRect) {
  return (
    rect.y >= 0 &&
    rect.x >= 0 &&
    rect.y + rect.height <= window.innerHeight &&
    rect.x + rect.width <= window.innerWidth
  )
}

export function revealTourTarget(resolved: TourResolvedTarget) {
  const [element] = resolved.elements
  if (!element || isFullyVisible(resolved.rect())) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({
    block: 'center',
    inline: 'nearest',
    behavior: reduce ? 'auto' : 'smooth',
  })
}

export function hideOutsideTour(elements: (HTMLElement | null | undefined)[]) {
  const present = elements.filter((element): element is HTMLElement => !!element?.isConnected)
  return present.length ? hideOutsideLayers(present) : () => {}
}

export function tourOwnsInput(layer: HTMLElement | null | undefined, scripted: boolean) {
  return scripted || isHighestLayer(layer)
}

export function trapTourFocus(
  getContainers: () => (HTMLElement | null | undefined)[],
  enabled: () => boolean,
) {
  const containers = () => getContainers().filter((node): node is HTMLElement => !!node)
  const inside = (node: Node | null) => !!node && containers().some(c => c.contains(node))

  function candidates() {
    return containers().flatMap(container => [
      ...(container.tabIndex >= 0 ? [container] : []),
      ...getTabbableCandidates(container),
    ])
  }

  function onFocusIn(event: FocusEvent) {
    if (!enabled() || inside(event.target as Node | null)) return
    const [first] = containers()
    first?.focus({ preventScroll: true })
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return
    if (!enabled()) return
    const list = candidates()
    if (!list.length) return
    const active = getActiveElement() as HTMLElement | null
    const index = active ? list.indexOf(active) : -1
    const next = event.shiftKey
      ? index <= 0
        ? list[list.length - 1]!
        : list[index - 1]!
      : index === -1 || index === list.length - 1
        ? list[0]!
        : list[index + 1]!
    event.preventDefault()
    next.focus({ preventScroll: true })
  }

  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('keydown', onKeyDown, true)
  return () => {
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('keydown', onKeyDown, true)
  }
}

export function listenTourKeys(onKeyDown: (event: KeyboardEvent) => void) {
  window.addEventListener('keydown', onKeyDown, true)
  return () => window.removeEventListener('keydown', onKeyDown, true)
}
