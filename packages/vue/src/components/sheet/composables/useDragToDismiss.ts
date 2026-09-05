import { onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'

interface Options {
  enabled: () => boolean
  open: Ref<boolean | undefined>
  dismiss: () => void
}

const DISTANCE_RATIO = 0.3
const FLICK_VELOCITY = 0.6

export function useDragToDismiss(panel: () => HTMLElement | null, options: Options) {
  const dragging = shallowRef(false)
  const offset = shallowRef(0)
  let startY = 0
  let startTime = 0
  let pointerId: number | null = null

  function onPointerMove(event: PointerEvent) {
    if (event.pointerId !== pointerId) return
    offset.value = Math.max(0, event.clientY - startY)
  }

  function detach() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', finish)
    window.removeEventListener('pointercancel', finish)
    pointerId = null
    dragging.value = false
  }

  function finish(event: PointerEvent) {
    if (event.pointerId !== pointerId) return
    detach()
    const height = panel()?.offsetHeight ?? 0
    const elapsed = Math.max(1, performance.now() - startTime)
    const velocity = offset.value / elapsed
    const far = height > 0 && offset.value > height * DISTANCE_RATIO
    if (offset.value > 0 && (far || velocity > FLICK_VELOCITY)) {
      options.dismiss()
      return
    }
    offset.value = 0
  }

  function onPointerDown(event: PointerEvent) {
    if (!options.enabled() || pointerId !== null || event.button !== 0) return
    pointerId = event.pointerId
    startY = event.clientY
    startTime = performance.now()
    dragging.value = true
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
  }

  watch(options.open, value => {
    if (value) offset.value = 0
  })

  onBeforeUnmount(detach)

  return { dragging, offset, onPointerDown }
}
