import { onScopeDispose, reactive, shallowRef } from 'vue'
import type { LightboxItem } from '../types'
import { fitRect, type Rect } from '../utils/pose'
import { sourceRect } from '../utils/source'
import type { Size } from '../utils/zoom'

export function useLightboxFrames(items: () => LightboxItem[]) {
  const stage = shallowRef<Size>({ width: 0, height: 0 })
  const naturals = reactive(new Map<string, Size & { src: string }>())
  let loader: HTMLImageElement | undefined

  function measure(el: HTMLElement | undefined) {
    stage.value = { width: el?.clientWidth ?? 0, height: el?.clientHeight ?? 0 }
  }

  function read(current?: () => LightboxItem | undefined): Promise<void> | undefined {
    loader?.removeAttribute('src')
    loader = undefined
    for (const item of items()) {
      const el = item.source?.()
      if (el && 'naturalWidth' in el && el.naturalWidth && el.naturalHeight) {
        naturals.set(item.id, { src: item.src, width: el.naturalWidth, height: el.naturalHeight })
      }
    }
    const item = current?.()
    if (!item || naturalOf(item)) return
    const source = item.source?.()
    if (!source || 'naturalWidth' in source || !sourceRect(source)) return
    const img = new Image()
    loader = img
    const { id, src } = item
    img.src = src
    return img
      .decode()
      .catch(() => {})
      .then(() => {
        if (loader !== img) return
        learn(id, img)
        loader = undefined
        const latest = current?.()
        if (latest?.id !== id || latest?.src !== src) return read(current)
      })
  }

  function learn(id: string, img: HTMLImageElement) {
    const item = items().find(item => item.id === id)
    if (
      !item ||
      naturalOf(item) ||
      !img.naturalWidth ||
      !img.naturalHeight ||
      img.src !== new URL(item.src, img.ownerDocument.baseURI).href
    ) {
      return
    }
    naturals.set(id, { src: item.src, width: img.naturalWidth, height: img.naturalHeight })
  }

  function naturalOf(item: LightboxItem | undefined): Size | undefined {
    if (!item) return
    const natural = naturals.get(item.id)
    return natural?.src === item.src ? natural : undefined
  }

  function frameOf(item: LightboxItem | undefined): Rect {
    const natural = naturalOf(item)
    return natural ? fitRect(natural, stage.value) : { x: 0, y: 0, ...stage.value }
  }

  onScopeDispose(() => {
    loader?.removeAttribute('src')
    loader = undefined
  })

  return { stage, measure, read, learn, naturalOf, frameOf }
}
