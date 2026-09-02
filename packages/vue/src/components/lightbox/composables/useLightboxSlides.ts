import { computed } from 'vue'
import type { useLightboxPaging } from './useLightboxPaging'
import { wrapIndex } from '../utils/paging'
import type { LightboxItem } from '../types'

export interface LightboxSlide {
  item: LightboxItem
  at: number
  key: string
}

export function useLightboxSlides(
  paging: ReturnType<typeof useLightboxPaging>,
  items: () => LightboxItem[],
  looping: () => boolean,
) {
  return computed<LightboxSlide[]>(() => {
    const list = items()
    const count = list.length
    const [low, high] = paging.range()
    const loop = looping()
    const from = loop ? low - 1 : Math.max(0, low - 1)
    const to = loop ? high + 1 : Math.min(count - 1, high + 1)
    const slides: LightboxSlide[] = []
    for (let at = from; at <= to; at += 1) {
      const item = list[wrapIndex(at, count)]
      if (item) slides.push({ item, at, key: loop ? `${item.id}@${at}` : item.id })
    }
    return slides
  })
}
