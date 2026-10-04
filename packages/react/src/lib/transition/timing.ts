type TransitionType = 'transition' | 'animation'

let endId = 0
const endIds = new WeakMap<Element, number>()

function toMs(value: string) {
  if (value === 'auto') return 0
  return Number(value.slice(0, -1).replace(',', '.')) * 1000
}

function timeoutOf(delays: string[], durations: string[]) {
  while (delays.length < durations.length) delays = delays.concat(delays)
  return Math.max(...durations.map((duration, index) => toMs(duration) + toMs(delays[index]!)))
}

function transitionInfo(element: Element) {
  const styles = getComputedStyle(element)
  const list = (
    key: 'transitionDelay' | 'transitionDuration' | 'animationDelay' | 'animationDuration',
  ) => (styles[key] || '').split(', ')
  const transitionDurations = list('transitionDuration')
  const transitionTimeout = timeoutOf(list('transitionDelay'), transitionDurations)
  const animationDurations = list('animationDuration')
  const animationTimeout = timeoutOf(list('animationDelay'), animationDurations)
  const timeout = Math.max(transitionTimeout, animationTimeout)
  const type: TransitionType | null =
    timeout > 0 ? (transitionTimeout > animationTimeout ? 'transition' : 'animation') : null
  const propCount = type
    ? type === 'transition'
      ? transitionDurations.length
      : animationDurations.length
    : 0
  return { type, timeout, propCount }
}

export function nextFrame(callback: () => void) {
  let inner = 0
  const outer = requestAnimationFrame(() => {
    inner = requestAnimationFrame(callback)
  })
  return () => {
    cancelAnimationFrame(outer)
    cancelAnimationFrame(inner)
  }
}

export function forceReflow(element: Element) {
  return element.ownerDocument.body.offsetHeight
}

export function whenTransitionEnds(element: Element, resolve: () => void) {
  const id = ++endId
  endIds.set(element, id)
  const resolveIfCurrent = () => {
    if (endIds.get(element) === id) resolve()
  }
  const { type, timeout, propCount } = transitionInfo(element)
  if (!type) {
    resolve()
    return () => endIds.delete(element)
  }
  const endEvent = `${type}end`
  let ended = 0
  const end = () => {
    element.removeEventListener(endEvent, onEnd)
    clearTimeout(timer)
    resolveIfCurrent()
  }
  const onEnd = (event: Event) => {
    if (event.target === element && ++ended >= propCount) end()
  }
  const timer = setTimeout(() => {
    if (ended < propCount) end()
  }, timeout + 1)
  element.addEventListener(endEvent, onEnd)
  return () => {
    element.removeEventListener(endEvent, onEnd)
    clearTimeout(timer)
    if (endIds.get(element) === id) endIds.delete(element)
  }
}
