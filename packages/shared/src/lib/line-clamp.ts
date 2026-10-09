export const LINE_CLAMP_DEFAULT = 3

export function lineClampCount(lines: number | undefined) {
  if (lines === undefined || !Number.isFinite(lines)) return LINE_CLAMP_DEFAULT
  return Math.max(1, Math.floor(lines))
}

function measureHeights(content: HTMLElement) {
  content.setAttribute('data-measuring', '')
  const collapsed = content.clientHeight
  const full = content.scrollHeight
  content.removeAttribute('data-measuring')
  return { collapsed, full }
}

export function measureLineClamp(content: HTMLElement) {
  if (content.hasAttribute('data-animating')) return null
  const { collapsed, full } = measureHeights(content)
  return full - collapsed > 1
}

function toMs(value: string) {
  const amount = Number.parseFloat(value)
  if (Number.isNaN(amount)) return 0
  return value.trim().endsWith('ms') ? amount : amount * 1000
}

const FADE = '--hn-line-clamp-fade'

export function animateLineClamp(content: HTMLElement, expanded: boolean, done: () => void) {
  const running = content.style.maxHeight !== ''
  const current = running ? content.getBoundingClientRect().height : undefined
  const fade = running ? getComputedStyle(content).getPropertyValue(FADE) : ''

  content.style.transition = 'none'
  const { collapsed, full } = measureHeights(content)
  const from = current ?? (expanded ? collapsed : full)
  const to = expanded ? full : collapsed
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
