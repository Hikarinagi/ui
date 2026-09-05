import { onBeforeUnmount, shallowRef, watch } from 'vue'

interface Delays {
  delay: number
  minVisible: number
}

export function useDelayedVisible(visible: () => boolean, delays: () => Delays) {
  const shown = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let shownAt = 0

  function clear() {
    clearTimeout(timer)
    timer = undefined
  }

  function show() {
    shown.value = true
    shownAt = performance.now()
    timer = undefined
  }

  function hide() {
    shown.value = false
    timer = undefined
  }

  watch(
    visible,
    value => {
      clear()
      const { delay, minVisible } = delays()
      if (value) {
        if (shown.value) return
        if (delay <= 0) show()
        else timer = setTimeout(show, delay)
        return
      }
      if (!shown.value) return
      const remaining = minVisible - (performance.now() - shownAt)
      if (remaining <= 0) hide()
      else timer = setTimeout(hide, remaining)
    },
    { immediate: true },
  )

  onBeforeUnmount(clear)

  return shown
}
