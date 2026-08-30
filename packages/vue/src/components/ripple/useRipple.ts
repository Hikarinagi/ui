import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { prefersReducedMotion } from '../../motion'

const INITIAL_ORIGIN_SCALE = 0.2
const PADDING = 12
const SOFT_EDGE_MINIMUM_SIZE = 75
const SOFT_EDGE_CONTAINER_RATIO = 0.35
const GROW_MS = 150
const MINIMUM_PRESS_MS = 225
const TOUCH_DELAY_MS = 150

const STATE = {
  inactive: 0,
  touchDelay: 1,
  holding: 2,
  waitingForClick: 3,
} as const

type RippleState = (typeof STATE)[keyof typeof STATE]

export function useRipple(
  container: Ref<HTMLElement | null>,
  surface: Ref<HTMLElement | null>,
  isDisabled: () => boolean,
) {
  const pressed = ref(false)

  let host: HTMLElement | null = null
  let state: RippleState = STATE.inactive
  let startEvent: PointerEvent | undefined
  let checkBoundsAfterContextMenu = false
  let growAnimation: Animation | undefined
  let initialSize = 0
  let rippleScale = ''
  let rippleSize = ''

  const isTouch = ({ pointerType }: PointerEvent) => pointerType === 'touch'

  function shouldReact(event: PointerEvent) {
    if (isDisabled() || !event.isPrimary) return false
    if (startEvent && startEvent.pointerId !== event.pointerId) return false
    if (event.type === 'pointerenter' || event.type === 'pointerleave') return !isTouch(event)
    return isTouch(event) || event.buttons === 1
  }

  function inBounds({ x, y }: PointerEvent) {
    const rect = container.value?.getBoundingClientRect()
    if (!rect) return false
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
  }

  function determineRippleSize() {
    const rect = container.value?.getBoundingClientRect()
    if (!rect) return
    const maxDim = Math.max(rect.height, rect.width)
    const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE)
    initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE)
    const maxRadius = Math.hypot(rect.width, rect.height) + PADDING
    rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`
    rippleSize = `${initialSize}px`
  }

  function normalizedCoords(event: PointerEvent) {
    const rect = container.value?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: event.pageX - (window.scrollX + rect.left),
      y: event.pageY - (window.scrollY + rect.top),
    }
  }

  function translationCoords(positionEvent?: PointerEvent) {
    const rect = container.value?.getBoundingClientRect()
    if (!rect) return { startPoint: { x: 0, y: 0 }, endPoint: { x: 0, y: 0 } }
    const endPoint = {
      x: (rect.width - initialSize) / 2,
      y: (rect.height - initialSize) / 2,
    }
    return {
      startPoint: positionEvent ? normalizedCoords(positionEvent) : endPoint,
      endPoint,
    }
  }

  function startPress(positionEvent?: PointerEvent) {
    const el = surface.value
    if (!el) return
    pressed.value = true
    growAnimation?.cancel()
    growAnimation = undefined
    determineRippleSize()
    const { startPoint, endPoint } = translationCoords(positionEvent)
    if (typeof el.animate !== 'function') return
    if (prefersReducedMotion()) return
    growAnimation = el.animate(
      {
        height: [rippleSize, rippleSize],
        width: [rippleSize, rippleSize],
        transform: [
          `translate(${startPoint.x}px,${startPoint.y}px) scale(1)`,
          `translate(${endPoint.x}px,${endPoint.y}px) scale(${rippleScale})`,
        ],
      },
      {
        pseudoElement: '::after',
        duration: GROW_MS,
        easing: 'linear',
        fill: 'forwards',
      },
    )
  }

  function endPress() {
    startEvent = undefined
    state = STATE.inactive
    const animation = growAnimation
    let playedMs = Infinity
    if (typeof animation?.currentTime === 'number') playedMs = animation.currentTime
    else if (animation?.currentTime) playedMs = animation.currentTime.to('ms').value
    if (playedMs >= MINIMUM_PRESS_MS) {
      pressed.value = false
      return
    }
    window.setTimeout(() => {
      if (growAnimation !== animation) return
      pressed.value = false
    }, MINIMUM_PRESS_MS - playedMs)
  }

  function onPointerDown(event: PointerEvent) {
    if (!shouldReact(event)) return
    startEvent = event
    if (!isTouch(event)) {
      state = STATE.waitingForClick
      startPress(event)
      return
    }
    if (checkBoundsAfterContextMenu && !inBounds(event)) return
    checkBoundsAfterContextMenu = false
    state = STATE.touchDelay
    window.setTimeout(() => {
      if (state !== STATE.touchDelay) return
      state = STATE.holding
      startPress(event)
    }, TOUCH_DELAY_MS)
  }

  function onPointerUp(event: PointerEvent) {
    if (!shouldReact(event)) return
    if (state === STATE.holding) {
      state = STATE.waitingForClick
      return
    }
    if (state === STATE.touchDelay) {
      state = STATE.waitingForClick
      startPress(startEvent)
    }
  }

  function onPointerLeave(event: PointerEvent) {
    if (!shouldReact(event)) return
    if (state !== STATE.inactive) endPress()
  }

  function onPointerCancel(event: PointerEvent) {
    if (!shouldReact(event)) return
    endPress()
  }

  function onClick() {
    if (isDisabled()) return
    if (state === STATE.waitingForClick) {
      endPress()
      return
    }
    if (state === STATE.inactive) {
      startPress()
      endPress()
    }
  }

  function onContextMenu() {
    if (isDisabled()) return
    checkBoundsAfterContextMenu = true
    endPress()
  }

  const listeners: [string, EventListener][] = [
    ['click', onClick as EventListener],
    ['contextmenu', onContextMenu as EventListener],
    ['pointercancel', onPointerCancel as EventListener],
    ['pointerdown', onPointerDown as EventListener],
    ['pointerleave', onPointerLeave as EventListener],
    ['pointerup', onPointerUp as EventListener],
  ]

  onMounted(() => {
    host = container.value?.parentElement ?? null
    if (!host) return
    for (const [name, fn] of listeners) host.addEventListener(name, fn, true)
  })

  onBeforeUnmount(() => {
    if (!host) return
    for (const [name, fn] of listeners) host.removeEventListener(name, fn, true)
    host = null
  })

  return { pressed }
}
