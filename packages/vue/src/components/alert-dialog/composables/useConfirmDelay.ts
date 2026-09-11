import { onMounted, onScopeDispose, ref, watch, type Ref } from 'vue'

export function useConfirmDelay(open: Ref<boolean | undefined>, delay: () => number) {
  const remaining = ref(0)
  let mounted = false
  let timer: ReturnType<typeof setTimeout> | undefined

  function stop() {
    clearTimeout(timer)
    timer = undefined
  }

  function restart() {
    stop()
    if (!open.value) return
    const seconds = Math.ceil(delay())
    remaining.value = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
    if (!mounted || !remaining.value) return

    const deadline = performance.now() + remaining.value * 1000
    function tick() {
      const milliseconds = deadline - performance.now()
      remaining.value = Math.max(0, Math.ceil(milliseconds / 1000))
      timer = remaining.value > 0 ? setTimeout(tick, Math.min(1000, milliseconds)) : undefined
    }
    tick()
  }

  watch([open, delay], restart, { immediate: true, flush: 'sync' })
  onMounted(() => {
    mounted = true
    restart()
  })
  onScopeDispose(stop)

  return remaining
}
