import { EASE, type Bezier } from '../motion'
import {
  resolveTourTarget,
  revealTourTarget,
  spotlightRect,
  TOUR_PADDING,
  TOUR_RADIUS,
  waitForTourTarget,
  watchTourTarget,
  type TourPlayContext,
  type TourPoint,
  type TourPointer,
  type TourPointerKind,
  type TourRect,
  type TourResolvedTarget,
  type TourSpotlightOptions,
  type TourStepBase,
  type TourTarget,
} from './tour'

export type TourStatus = 'idle' | 'waiting' | 'ready' | 'missing'

export interface TourEngineState {
  status: TourStatus
  settled: boolean
  hole: TourRect | null
  targetRect: TourRect | null
  radius: number
  elements: HTMLElement[]
  playing: boolean
  viewport: { width: number; height: number }
}

export interface TourEngineOptions {
  pointer: () => HTMLElement | null | undefined
  keyBadge: () => HTMLElement | null | undefined
  pointerKind: () => TourPointerKind
}

const INITIAL: TourEngineState = {
  status: 'idle',
  settled: false,
  hole: null,
  targetRect: null,
  radius: TOUR_RADIUS,
  elements: [],
  playing: false,
  viewport: { width: 0, height: 0 },
}

export const TOUR_SPRING = { stiffness: 260, damping: 30 }

type Keys = 'x' | 'y' | 'width' | 'height'
const KEYS: Keys[] = ['x', 'y', 'width', 'height']

export function stepSpring(
  position: TourRect,
  velocity: TourRect,
  goal: TourRect,
  seconds: number,
  { stiffness, damping } = TOUR_SPRING,
) {
  const step = 1 / 240
  let left = seconds
  while (left > 0) {
    const dt = Math.min(step, left)
    for (const key of KEYS) {
      const force = -stiffness * (position[key] - goal[key]) - damping * velocity[key]
      velocity[key] += force * dt
      position[key] += velocity[key] * dt
    }
    left -= dt
  }
  return KEYS.every(
    key => Math.abs(position[key] - goal[key]) < 0.25 && Math.abs(velocity[key]) < 2,
  )
}

export function bezierEasing([x1, y1, x2, y2]: Bezier) {
  const curve = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  const slope = (a: number, b: number, t: number) =>
    3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t * t
  return (progress: number) => {
    if (progress <= 0) return 0
    if (progress >= 1) return 1
    let t = progress
    for (let i = 0; i < 8; i++) {
      const error = curve(x1, x2, t) - progress
      const derivative = slope(x1, x2, t)
      if (Math.abs(error) < 1e-5 || derivative === 0) break
      t -= error / derivative
    }
    return curve(y1, y2, Math.min(Math.max(t, 0), 1))
  }
}

const easeMove = bezierEasing(EASE.move)

function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

function abortError() {
  return new DOMException('The tour step was left', 'AbortError')
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function guard(signal: AbortSignal) {
  if (signal.aborted) throw abortError()
}

export function tourSleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(abortError())
    const timer = window.setTimeout(done, ms)
    const abort = () => {
      window.clearTimeout(timer)
      reject(abortError())
    }
    function done() {
      signal.removeEventListener('abort', abort)
      resolve()
    }
    signal.addEventListener('abort', abort, { once: true })
  })
}

export function tween(
  duration: number,
  onFrame: (progress: number) => void,
  signal: AbortSignal,
  easing: (progress: number) => number = easeMove,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(abortError())
    if (duration <= 0 || reducedMotion()) {
      onFrame(1)
      return resolve()
    }
    const start = performance.now()
    let frame = 0
    const abort = () => {
      cancelAnimationFrame(frame)
      reject(abortError())
    }
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      onFrame(easing(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else {
        signal.removeEventListener('abort', abort)
        resolve()
      }
    }
    signal.addEventListener('abort', abort, { once: true })
    frame = requestAnimationFrame(tick)
  })
}

function isPoint(value: unknown): value is TourPoint {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as TourPoint).x === 'number' &&
    typeof (value as TourPoint).y === 'number' &&
    !('width' in value)
  )
}

export function tourPointerPoint(target: TourTarget | TourPoint): TourPoint | null {
  if (isPoint(target)) return { x: target.x, y: target.y }
  const resolved = resolveTourTarget(target as TourTarget)
  if (!resolved) return null
  const rect = resolved.rect()
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
}

function createPointer(
  element: () => HTMLElement | null | undefined,
  keyBadge: () => HTMLElement | null | undefined,
  signal: AbortSignal,
  memory: { point: TourPoint | null },
): TourPointer {
  const place = (point: TourPoint) => {
    memory.point = point
    const node = element()
    if (node) node.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`
  }
  const setState = (name: string, value: string | null) => {
    const node = element()
    if (!node) return
    if (value === null) node.removeAttribute(name)
    else node.setAttribute(name, value)
  }
  const ripple = () => {
    const node = element()?.querySelector('[data-hn-tour-pointer-ripples]')
    if (!node) return
    const span = document.createElement('span')
    span.setAttribute('data-hn-tour-ripple', '')
    span.addEventListener('animationend', () => span.remove(), { once: true })
    window.setTimeout(() => span.remove(), 1000)
    node.appendChild(span)
  }
  const resolvePoint = (target: TourTarget | TourPoint) => {
    const point = tourPointerPoint(target)
    if (!point) throw new Error('[Hina UI] Tour: the pointer target was not found')
    return point
  }
  const travel = async (
    target: TourTarget | TourPoint,
    duration: number,
    onMove?: (point: TourPoint) => void,
  ) => {
    guard(signal)
    let to = resolvePoint(target)
    const hidden = element()?.getAttribute('data-state') !== 'shown'
    const from = hidden || !memory.point ? { x: to.x + 40, y: to.y + 40 } : memory.point
    place(from)
    setState('data-state', 'shown')
    await tween(
      duration,
      progress => {
        to = tourPointerPoint(target) ?? to
        const point = {
          x: from.x + (to.x - from.x) * progress,
          y: from.y + (to.y - from.y) * progress,
        }
        place(point)
        onMove?.(point)
      },
      signal,
    )
  }
  return {
    move: (target, duration = 600) => travel(target, duration),
    async tap() {
      guard(signal)
      setState('data-pressed', '')
      ripple()
      await tourSleep(120, signal)
      setState('data-pressed', null)
      await tourSleep(180, signal)
    },
    async press(duration = 800) {
      guard(signal)
      element()?.style.setProperty('--hn-tour-press', `${duration}ms`)
      setState('data-pressed', 'long')
      try {
        await tourSleep(duration, signal)
      } finally {
        setState('data-pressed', null)
      }
    },
    async drag(target, duration = 800, onMove) {
      guard(signal)
      setState('data-pressed', '')
      try {
        await tourSleep(80, signal)
        if (memory.point) onMove?.(memory.point)
        await travel(target, duration, onMove)
        await tourSleep(80, signal)
      } finally {
        setState('data-pressed', null)
      }
    },
    async key(key, duration = 700) {
      guard(signal)
      const badge = keyBadge()
      if (!badge) return
      const label = badge.querySelector('[data-hn-tour-key-label]') ?? badge
      label.textContent = key
      const near = element()?.getAttribute('data-state') === 'shown' && memory.point
      const x = near ? memory.point!.x + 20 : window.innerWidth / 2
      const y = near ? memory.point!.y + 28 : window.innerHeight - 72
      badge.style.transform = `translate3d(${x}px, ${y}px, 0)`
      badge.setAttribute('data-placement', near ? 'pointer' : 'screen')
      badge.setAttribute('data-state', 'shown')
      try {
        await tourSleep(duration, signal)
      } finally {
        badge.setAttribute('data-state', 'hidden')
      }
    },
    async hide() {
      setState('data-state', 'hidden')
    },
  }
}

export function createTourEngine(options: TourEngineOptions) {
  let state = INITIAL
  const listeners = new Set<() => void>()
  const set = (patch: Partial<TourEngineState>) => {
    state = { ...state, ...patch }
    for (const listener of [...listeners]) listener()
  }

  let step: TourStepBase = {}
  let stepNumber = 0
  let padding = TOUR_PADDING
  let resolved: TourResolvedTarget | null = null
  let stopTracking = () => {}
  let token = 0
  let waiting: AbortController | null = null

  let position: TourRect | null = null
  let velocity: TourRect = { x: 0, y: 0, width: 0, height: 0 }
  let frame = 0
  let last = 0
  let settleWaiters: (() => void)[] = []

  let run: { controller: AbortController; cleanups: (() => void)[] } | null = null
  const pointerMemory: { point: TourPoint | null } = { point: null }

  const viewport = () => ({ width: window.innerWidth, height: window.innerHeight })
  const goal = () => (resolved ? spotlightRect(toBox(resolved.rect()), padding) : null)
  const toBox = (rect: TourRect) => ({
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
  })

  function flushSettled() {
    const waiters = settleWaiters
    settleWaiters = []
    for (const resolve of waiters) resolve()
  }

  function stopSpring() {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    flushSettled()
  }

  function snap() {
    const target = goal()
    position = target ? { ...target } : null
    velocity = { x: 0, y: 0, width: 0, height: 0 }
    set({
      hole: position,
      targetRect: resolved ? resolved.rect() : null,
      viewport: viewport(),
    })
  }

  function tick(now: number) {
    const target = goal()
    if (!target || !position) {
      frame = 0
      snap()
      flushSettled()
      return
    }
    const seconds = Math.min((now - last) / 1000, 1 / 20)
    last = now
    const done = stepSpring(position, velocity, target, seconds)
    if (done) {
      frame = 0
      snap()
      flushSettled()
      return
    }
    set({ hole: { ...position }, targetRect: resolved!.rect(), viewport: viewport() })
    frame = requestAnimationFrame(tick)
  }

  function springTo(animate: boolean) {
    if (!animate || !position || reducedMotion()) {
      stopSpring()
      snap()
      return Promise.resolve()
    }
    const settled = new Promise<void>(resolve => settleWaiters.push(resolve))
    if (!frame) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    return settled
  }

  function track() {
    if (frame) return
    snap()
  }

  function onResize() {
    if (frame) return
    if (resolved) snap()
    else set({ viewport: viewport() })
  }

  async function aim(
    target: TourTarget | undefined,
    {
      wait = 0,
      scroll = true,
      entering = false,
      padding: nextPadding,
      radius,
    }: TourSpotlightOptions & { scroll?: boolean; entering?: boolean },
  ) {
    const current = ++token
    waiting?.abort()
    const controller = new AbortController()
    waiting = controller
    let found = resolveTourTarget(target)
    if (!found && target && wait > 0) {
      found = await waitForTourTarget(target, wait, controller.signal)
      if (current !== token) return 'stale' as const
    }
    if (!found) {
      stopTracking()
      stopTracking = () => {}
      resolved = null
      stopSpring()
      position = null
      set({
        status: 'missing',
        settled: true,
        hole: null,
        targetRect: null,
        elements: [],
        viewport: viewport(),
      })
      return target ? ('missing' as const) : ('empty' as const)
    }
    resolved = found
    padding = nextPadding ?? step.padding ?? TOUR_PADDING
    stopTracking()
    const animate = !!position
    set({
      status: 'ready',
      elements: found.elements,
      radius: radius ?? step.radius ?? TOUR_RADIUS,
      ...(entering ? { settled: false } : {}),
    })
    if (scroll) revealTourTarget(found)
    const settled = springTo(animate)
    stopTracking = watchTourTarget(found, track)
    await settled
    if (current === token && entering) set({ settled: true })
    return 'ready' as const
  }

  function abortRun() {
    const current = run
    if (!current) return
    run = null
    current.controller.abort()
    for (const cleanup of current.cleanups.reverse()) {
      try {
        cleanup()
      } catch (error) {
        console.error(error)
      }
    }
    options.pointer()?.setAttribute('data-state', 'hidden')
    options.pointer()?.removeAttribute('data-pressed')
    options.keyBadge()?.setAttribute('data-state', 'hidden')
    set({ playing: false })
  }

  function play() {
    abortRun()
    const script = step.play
    if (!script) return
    const controller = new AbortController()
    const cleanups: (() => void)[] = []
    const current = { controller, cleanups }
    run = current
    const { signal } = controller
    const context: TourPlayContext = {
      step: stepNumber,
      signal,
      defer(cleanup) {
        if (signal.aborted) cleanup()
        else cleanups.push(cleanup)
      },
      pointer: createPointer(options.pointer, options.keyBadge, signal, pointerMemory),
      async spotlight(target, spotlightOptions = {}) {
        guard(signal)
        await aim(target === undefined ? step.target : target, {
          ...spotlightOptions,
          scroll: false,
        })
        guard(signal)
      },
      async waitFor(target, timeout = 5000) {
        guard(signal)
        const found = await waitForTourTarget(target, timeout, signal)
        guard(signal)
        return !!found
      },
      sleep: ms => tourSleep(ms, signal),
    }
    set({ playing: true })
    Promise.resolve()
      .then(() => script(context))
      .catch(error => {
        if (!isAbortError(error)) console.error(error)
      })
      .finally(() => {
        if (run === current) set({ playing: false })
      })
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getState: () => state,
    pointerKind: options.pointerKind,
    enter(next: TourStepBase, number: number) {
      abortRun()
      const fresh = state.status === 'idle'
      if (fresh) {
        stopSpring()
        position = null
        pointerMemory.point = null
        window.addEventListener('resize', onResize)
      }
      step = next
      stepNumber = number
      set({
        status: 'waiting',
        settled: false,
        viewport: viewport(),
        ...(fresh ? { hole: null, targetRect: null, elements: [] } : {}),
      })
      return aim(next.target, {
        wait: next.wait ?? 0,
        scroll: next.scroll !== false,
        entering: true,
      })
    },
    play,
    replay() {
      if (!step.play) return
      abortRun()
      void aim(step.target, { wait: step.wait ?? 0, scroll: false })
      play()
    },
    leave() {
      abortRun()
      token += 1
      waiting?.abort()
      waiting = null
    },
    close() {
      abortRun()
      token += 1
      waiting?.abort()
      waiting = null
      stopTracking()
      stopTracking = () => {}
      stopSpring()
      window.removeEventListener('resize', onResize)
      set({ status: 'idle', settled: false, playing: false })
    },
  }
}

export type TourEngine = ReturnType<typeof createTourEngine>
