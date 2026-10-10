import { workletSource } from './worklet'
import { prefersReducedMotion } from '../../motion'

export const isPaintWorkletSupported =
  typeof CSS !== 'undefined' && (CSS as { paintWorklet?: unknown }).paintWorklet !== undefined

let workletRegistered = false

export function registerSpoilerWorklet() {
  if (workletRegistered || !isPaintWorkletSupported) return
  workletRegistered = true
  const paintWorklet = (CSS as unknown as { paintWorklet: { addModule(url: string): void } })
    .paintWorklet
  paintWorklet.addModule(
    URL.createObjectURL(new Blob([workletSource], { type: 'application/javascript' })),
  )
}

export interface SpoilerPainterOptions {
  fps?: number
  gap?: number
  density?: number
  mimicWords?: boolean
  accent?: string
}

const DEFAULTS = {
  fps: 24,
  gap: 6,
  density: 0.12,
  mimicWords: true,
  accent: '0 0% 20%',
} as const

export const SPOILER_WORKLET_INPUTS = [
  '--hn-nz-t',
  '--hn-nz-stop',
  '--hn-nz-fade',
  '--hn-nz-gap',
  '--hn-nz-accent',
  '--hn-nz-words',
  '--hn-nz-density',
] as const

const BLOCK_MAX_TILE = 293
const INLINE_MAX_TILE = 333
const GAP_RATIO = 8
const DEFAULT_FADE_S = 1.5
const CLOCK_S = 3600

const painters = new WeakMap<Element, SpoilerPainter>()
let viewport: IntersectionObserver | undefined

function watchViewport() {
  viewport ??= new IntersectionObserver(entries => {
    for (const entry of entries) painters.get(entry.target)?.setInView(entry.isIntersecting)
  })
  return viewport
}

export class SpoilerPainter {
  readonly el: HTMLElement
  maxFPS: number = DEFAULTS.fps

  private clock: Animation | null = null
  private settle: ReturnType<typeof setTimeout> | undefined
  private running = false
  private inView = false
  private hidden = false
  private destroyed = false

  constructor(el: HTMLElement, options: SpoilerPainterOptions = {}) {
    registerSpoilerWorklet()
    this.el = el
    painters.set(el, this)
    watchViewport().observe(el)
    this.setFade(0)
    this.setTstop(null)
    this.update(options)
  }

  get isHidden() {
    return this.hidden
  }

  update({
    fps = DEFAULTS.fps,
    gap = DEFAULTS.gap,
    density = DEFAULTS.density,
    mimicWords = DEFAULTS.mimicWords,
    accent = DEFAULTS.accent,
  }: SpoilerPainterOptions = {}) {
    if (this.destroyed) return

    const maxFPS = prefersReducedMotion() ? 0 : fps
    if (maxFPS !== this.maxFPS) {
      this.maxFPS = maxFPS
      if (maxFPS > 0) this.clock?.effect?.updateTiming({ easing: this.easing() })
      else this.stopClock()
    }

    this.el.style.setProperty('--hn-nz-density', String(density))
    this.el.style.setProperty('--hn-nz-accent', accent)

    const isBlockElement = getComputedStyle(this.el).getPropertyValue('display') !== 'inline'
    this.useBackgroundStyle('auto', 'auto', false)
    this.el.style.setProperty('--hn-nz-gap', '0px 0px')

    if (isBlockElement) {
      this.el.style.setProperty('--hn-nz-words', 'false')
      const rect = this.el.getBoundingClientRect()

      if (rect.width * rect.height > BLOCK_MAX_TILE * BLOCK_MAX_TILE) {
        this.useBackgroundStyle(
          Math.min(rect.width, BLOCK_MAX_TILE),
          Math.min(rect.height, BLOCK_MAX_TILE),
          true,
        )
      } else {
        const capGap = Math.floor(Math.min(gap, rect.width / GAP_RATIO, rect.height / GAP_RATIO))
        this.el.style.setProperty('--hn-nz-gap', `${capGap}px ${capGap}px`)
      }
      return
    }

    this.el.style.setProperty('--hn-nz-words', String(mimicWords))
    const rects = [...this.el.getClientRects()]
    const heightOfLine = Math.min(...rects.map(r => r.height))

    this.useBackgroundStyle(INLINE_MAX_TILE, heightOfLine, true)
    const capGap = Math.floor(Math.min(heightOfLine / GAP_RATIO, gap))
    this.el.style.setProperty('--hn-nz-gap', `0 ${capGap}px`)
  }

  private useBackgroundStyle(ws: string | number, hs: string | number, tile: boolean) {
    const w = typeof ws === 'number' ? `${ws}px` : ws
    const h = typeof hs === 'number' ? `${hs}px` : hs
    const repeatAndPosition = tile ? 'repeat left center' : 'no-repeat center center'
    this.el.style.background = `paint(hn-spoiler) ${repeatAndPosition} / ${w} ${h}`
  }

  private easing() {
    return `steps(${Math.round(CLOCK_S * this.maxFPS)})`
  }

  private time() {
    const elapsed = Number(this.clock?.currentTime ?? 0) / 1000
    return this.maxFPS > 0 ? Math.floor(elapsed * this.maxFPS) / this.maxFPS : 0
  }

  private setFade(value: number) {
    this.el.style.setProperty('--hn-nz-fade', `${value}s`)
  }

  private setTstop(value: number | null) {
    this.el.style.setProperty('--hn-nz-stop', value === null ? 'Infinity' : value.toFixed(3))
  }

  private parseFade(value: number | boolean | undefined) {
    if (this.maxFPS <= 0) return 0
    return value === true || value === undefined ? DEFAULT_FADE_S : Number(value)
  }

  private sync() {
    if (!this.clock) return
    if (this.running && this.inView) this.clock.play()
    else this.clock.pause()
  }

  private stopClock() {
    clearTimeout(this.settle)
    this.settle = undefined
    this.clock?.cancel()
    this.clock = null
    this.running = false
  }

  setInView(value: boolean) {
    if (this.destroyed || value === this.inView) return
    this.inView = value
    this.sync()
  }

  hide(animate?: number | boolean) {
    if (this.destroyed) return
    this.hidden = true
    this.setFade(this.parseFade(animate))
    this.setTstop(null)
    this.stopClock()
    if (this.maxFPS <= 0) return
    this.clock = this.el.animate({ '--hn-nz-t': [0, CLOCK_S] } as PropertyIndexedKeyframes, {
      duration: CLOCK_S * 1000,
      easing: this.easing(),
      iterations: Infinity,
    })
    this.running = true
    this.sync()
  }

  reveal(animate?: number | boolean) {
    if (this.destroyed) return
    this.hidden = false
    const duration = this.parseFade(animate)
    this.setFade(duration)
    this.setTstop(this.time())
    clearTimeout(this.settle)
    const stop = () => {
      this.settle = undefined
      this.running = false
      this.sync()
    }
    if (duration <= 0) stop()
    else this.settle = setTimeout(stop, duration * 1000 + 1000 / this.maxFPS)
  }

  destroy() {
    this.destroyed = true
    this.stopClock()
    viewport?.unobserve(this.el)
    painters.delete(this.el)
    this.el.style.removeProperty('background')
    for (const prop of SPOILER_WORKLET_INPUTS) this.el.style.removeProperty(prop)
  }
}
