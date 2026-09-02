import { reactive, shallowRef } from 'vue'
import type { LightboxItem } from '../types'
import { fitRect, type Rect } from '../utils/pose'
import type { Size } from '../utils/zoom'

export function useLightboxFrames(items: () => LightboxItem[]) {
  const stage = shallowRef<Size>({ width: 0, height: 0 })
  const naturals = reactive(new Map<string, Size>())

  function measure(el: HTMLElement | undefined) {
    stage.value = { width: el?.clientWidth ?? 0, height: el?.clientHeight ?? 0 }
  }

  function read() {
    for (const item of items()) {
      const el = item.source?.()
      if (el?.naturalWidth && el.naturalHeight) {
        naturals.set(item.id, { width: el.naturalWidth, height: el.naturalHeight })
      }
    }
  }

  function learn(id: string, img: HTMLImageElement) {
    if (naturals.has(id) || !img.naturalWidth || !img.naturalHeight) return
    naturals.set(id, { width: img.naturalWidth, height: img.naturalHeight })
  }

  function naturalOf(item: LightboxItem | undefined): Size | undefined {
    return item ? naturals.get(item.id) : undefined
  }

  function frameOf(item: LightboxItem | undefined): Rect {
    const natural = naturalOf(item)
    return natural ? fitRect(natural, stage.value) : { x: 0, y: 0, ...stage.value }
  }

  return { stage, measure, read, learn, naturalOf, frameOf }
}
