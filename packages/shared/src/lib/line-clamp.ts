export const LINE_CLAMP_DEFAULT = 3

export function lineClampCount(lines: number | undefined) {
  if (lines === undefined || !Number.isFinite(lines)) return LINE_CLAMP_DEFAULT
  return Math.max(1, Math.floor(lines))
}

export interface LineClampMeasure {
  size: number
  truncated: boolean
}

export function measureLineClamp(content: HTMLElement): LineClampMeasure | null {
  if (content.hasAttribute('data-animating')) return null
  content.setAttribute('data-measuring', '')
  const size = content.clientHeight
  const truncated = content.scrollHeight - size > 1
  content.removeAttribute('data-measuring')
  return { size, truncated }
}

export function lineClampSize(measure: LineClampMeasure | null) {
  return measure?.truncated ? `${measure.size}px` : undefined
}

function toMs(value: string) {
  const amount = Number.parseFloat(value)
  if (Number.isNaN(amount)) return 0
  return value.trim().endsWith('ms') ? amount : amount * 1000
}

function collapsedHeight(content: HTMLElement) {
  const size = Number.parseFloat(content.style.getPropertyValue('--hn-line-clamp-size'))
  if (Number.isFinite(size)) return size
  const style = getComputedStyle(content)
  const lines = Number.parseFloat(style.getPropertyValue('--hn-line-clamp')) || LINE_CLAMP_DEFAULT
  const lineHeight = Number.parseFloat(style.lineHeight)
  return (
    lines * (Number.isFinite(lineHeight) ? lineHeight : Number.parseFloat(style.fontSize) * 1.2)
  )
}

const FADE = '--hn-line-clamp-fade'

export function animateLineClamp(content: HTMLElement, expanded: boolean, done: () => void) {
  const running = content.style.maxHeight !== ''
  const full = content.scrollHeight
  const collapsed = Math.min(collapsedHeight(content), full)
  const from = running ? content.getBoundingClientRect().height : expanded ? collapsed : full
  const to = expanded ? full : collapsed
  const fade = running ? getComputedStyle(content).getPropertyValue(FADE) : ''

  content.style.transition = 'none'
  content.toggleAttribute('data-expanded', !expanded)
  if (fade) content.style.setProperty(FADE, fade)
  content.style.maxHeight = `${from}px`
  content.setAttribute('data-animating', '')
  void content.offsetHeight
  content.style.transition = ''
  content.style.removeProperty(FADE)
  content.toggleAttribute('data-expanded', expanded)
  content.style.maxHeight = `${to}px`

  let timer: ReturnType<typeof setTimeout> | undefined
  const stop = () => {
    content.removeEventListener('transitionend', onEnd)
    clearTimeout(timer)
  }
  const finish = () => {
    stop()
    content.style.maxHeight = ''
    content.removeAttribute('data-animating')
    done()
  }
  function onEnd(event: TransitionEvent) {
    if (event.target === content && event.propertyName === 'max-height') finish()
  }

  if (Math.abs(from - to) < 1) {
    finish()
    return stop
  }
  const duration = Math.max(...getComputedStyle(content).transitionDuration.split(',').map(toMs))
  content.addEventListener('transitionend', onEnd)
  timer = setTimeout(finish, duration + 80)
  return stop
}

export function revealLineClamp(root: HTMLElement | null) {
  root?.scrollIntoView?.({ block: 'nearest' })
}
