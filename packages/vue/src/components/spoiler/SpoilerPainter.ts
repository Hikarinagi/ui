import { workletSource } from './worklet'

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

const BLOCK_MAX_TILE = 293
const INLINE_MAX_TILE = 333
const GAP_RATIO = 8
const DEFAULT_FADE_S = 1.5

export class SpoilerPainter {
  readonly el: HTMLElement
  maxFPS: number = DEFAULTS.fps

  private t = 0
  private t0 = 0
  private tstop: number | null = null
  private raf: number | null = null
  private fadeS = 0
  private hidden = false
  private destroyed = false

  constructor(el: HTMLElement, options: SpoilerPainterOptions = {}) {
    registerSpoilerWorklet()
    this.el = el
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

    this.maxFPS = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : fps

    this.el.style.setProperty('--hn-nz-density', String(density))
    this.el.style.setProperty('--hn-nz-accent', accent)

    const isBlockElement = getComputedStyle(this.el).getPropertyValue('display') !== 'inline'
    this.useBackgroundStyle('auto', 'auto', false)

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

  private setFade(value: number) {
    this.fadeS = value
    this.el.style.setProperty('--hn-nz-fade', `${value}s`)
  }

  private setT(value: number) {
    this.t = value
    this.el.style.setProperty('--hn-nz-t', value.toFixed(3))
  }

  private setTstop(value: number | null) {
    this.tstop = value
    if (value !== null) {
      this.el.style.setProperty('--hn-nz-stop', value.toFixed(3))
    } else {
      this.el.style.removeProperty('--hn-nz-stop')
    }
  }

  private parseFade(value: number | boolean | undefined) {
    if (this.maxFPS <= 0) return 0
    return value === true || value === undefined ? DEFAULT_FADE_S : Number(value)
  }

  hide(animate?: number | boolean) {
    if (this.destroyed) return
    this.hidden = true
    this.setFade(this.parseFade(animate))
    this.setTstop(null)
    this.setT(0)
    this.startAnimation()
  }

  reveal(animate?: number | boolean) {
    if (this.destroyed) return
    this.hidden = false
    const duration = this.parseFade(animate)
    this.setFade(duration)
    this.setTstop(this.t)
    if (duration <= 0) this.stopAnimation()
  }

  private frame = (now: DOMHighResTimeStamp) => {
    if (this.destroyed) return
    const shouldStop = this.tstop !== null && this.t > this.tstop + this.fadeS

    if (this.maxFPS > 0 && !shouldStop) {
      this.raf = requestAnimationFrame(this.frame)
    }

    const dt = now - this.t0
    if (dt > 0 && dt < 1000 / this.maxFPS) return

    this.setT(this.t + dt / 1000)
    this.t0 = now
  }

  private startAnimation() {
    this.t0 = performance.now()
    this.frame(this.t0)
  }

  private stopAnimation() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf)
      this.raf = null
    }
  }

  destroy() {
    this.destroyed = true
    this.stopAnimation()
    this.el.style.removeProperty('background')
    for (const prop of [
      '--hn-nz-t',
      '--hn-nz-stop',
      '--hn-nz-fade',
      '--hn-nz-gap',
      '--hn-nz-words',
      '--hn-nz-density',
      '--hn-nz-accent',
    ]) {
      this.el.style.removeProperty(prop)
    }
  }
}
