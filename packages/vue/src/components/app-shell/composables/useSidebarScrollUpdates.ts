import { nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { provideLayoutTransition } from '../../../lib/layout-stability'

export function useSidebarScrollUpdates(state: () => string, settled: () => void) {
  const transitioning = shallowRef(false)
  provideLayoutTransition(transitioning)
  let revision = 0
  let frame = 0
  let target: HTMLElement | undefined
  let running = false
  let pendingRun = false

  function check() {
    frame = 0
    if (target && !target.isConnected) running = false
    if (running || pendingRun) {
      pendingRun = false
      frame = requestAnimationFrame(check)
      return
    }
    const current = revision
    release()
    transitioning.value = false
    void nextTick(() => {
      if (current === revision) settled()
    })
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(check)
  }

  function stop(event: TransitionEvent) {
    if (event.target !== target || event.propertyName !== 'width') return
    running = false
    pendingRun = false
    schedule()
  }

  function release() {
    target?.removeEventListener('transitionend', stop)
    target?.removeEventListener('transitioncancel', stop)
    target = undefined
  }

  watch(
    state,
    () => {
      revision++
      transitioning.value = true
      pendingRun = true
      schedule()
    },
    { flush: 'sync' },
  )

  onBeforeUnmount(() => {
    revision++
    cancelAnimationFrame(frame)
    release()
  })

  return (event: TransitionEvent) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'width') return
    if (target !== event.currentTarget) {
      release()
      target = event.currentTarget as HTMLElement
      target.addEventListener('transitionend', stop)
      target.addEventListener('transitioncancel', stop)
    }
    running = true
    transitioning.value = true
    schedule()
  }
}
