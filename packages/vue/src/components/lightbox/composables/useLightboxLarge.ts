import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { LightboxItem } from '../types'

export const LARGE_HINT_DELAY_MS = 800

export function useLightboxLarge(item: () => LightboxItem | undefined, active: () => boolean) {
  const src = shallowRef<string>()
  const ready = shallowRef(false)
  const waiting = shallowRef(false)
  let loader: HTMLImageElement | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  function reset() {
    if (loader) loader.src = ''
    loader = null
    if (timer) clearTimeout(timer)
    timer = null
    src.value = undefined
    ready.value = false
    waiting.value = false
  }

  function load(target: LightboxItem) {
    const url = target.preview
    if (!url || url === target.src) return
    src.value = url
    const img = new Image()
    loader = img
    img.decoding = 'async'
    img.src = url
    timer = setTimeout(() => {
      if (loader === img && !ready.value) waiting.value = true
    }, LARGE_HINT_DELAY_MS)
    const done = () => {
      if (loader !== img) return
      if (timer) clearTimeout(timer)
      timer = null
      waiting.value = false
      ready.value = true
    }
    const decode = typeof img.decode === 'function' ? img.decode() : Promise.resolve()
    decode.then(done, () => {
      if (loader !== img) return
      if (timer) clearTimeout(timer)
      timer = null
      waiting.value = false
    })
  }

  watch(
    () => [active() ? item() : undefined] as const,
    ([target]) => {
      reset()
      if (target) load(target)
    },
    { immediate: true },
  )

  onBeforeUnmount(reset)

  return { src, ready, waiting }
}
