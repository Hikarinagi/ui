import { autoUpdate } from '@floating-ui/dom'
import { hideOthers } from 'aria-hidden'
import { isHighestLayer } from '../primitives/dismissable-layer'
import { getActiveElement, getTabbableCandidates } from '../primitives/focus-scope'

export type TourSide = 'top' | 'right' | 'bottom' | 'left'
export type TourAlign = 'start' | 'center' | 'end'
export type TourTarget = string | HTMLElement | (() => HTMLElement | null | undefined) | null

export interface TourStepBase {
  target?: TourTarget
  title?: string
  description?: string
  side?: TourSide
  align?: TourAlign
  padding?: number
  radius?: number
  blockTarget?: boolean
  scroll?: boolean
  beacon?: boolean
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

export function resolveTourTarget(target: TourTarget | undefined): HTMLElement | null {
  if (!target) return null
  if (typeof target === 'string')
    return typeof document === 'undefined' ? null : document.querySelector<HTMLElement>(target)
  if (typeof target === 'function') return target() ?? null
  return target
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

export function tourReference(element: HTMLElement, padding = TOUR_PADDING) {
  return {
    contextElement: element,
    getBoundingClientRect() {
      const rect = spotlightRect(element.getBoundingClientRect(), padding)
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

export function watchTourTarget(element: HTMLElement, onChange: () => void) {
  onChange()
  return autoUpdate(element, document.documentElement, onChange)
}

export function isFullyVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  )
}

export function revealTourTarget(element: HTMLElement) {
  if (isFullyVisible(element)) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({
    block: 'center',
    inline: 'nearest',
    behavior: reduce ? 'auto' : 'smooth',
  })
}

export function hideOutsideTour(elements: (HTMLElement | null | undefined)[]) {
  const present = elements.filter((element): element is HTMLElement => !!element?.isConnected)
  return present.length ? hideOthers(present) : () => {}
}

export function trapTourFocus(
  getContainers: () => (HTMLElement | null | undefined)[],
  getLayer: () => HTMLElement | null | undefined,
) {
  const containers = () => getContainers().filter((node): node is HTMLElement => !!node)
  const enabled = () => isHighestLayer(getLayer())
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
