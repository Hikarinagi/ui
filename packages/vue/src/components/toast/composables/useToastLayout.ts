import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import { toastState, type ToastItem } from '../store'

export const VISIBLE_STACK = 3

const GAP = 12
const CARD_CHROME_BLOCK = 34

export function useToastLayout() {
  const heights = reactive(new Map<number | string, number>())
  const observers = new Map<number | string, { observer: ResizeObserver; el: HTMLElement }>()
  const lastLayout = new Map<number | string, { index: number; offset: number }>()

  const openItems = computed(() => toastState.items.filter(item => item.open))

  const layout = computed(() => {
    const map = new Map<number | string, { index: number; offset: number }>()
    const open = openItems.value
    let offset = 0
    for (let i = open.length - 1; i >= 0; i -= 1) {
      const item = open[i]!
      const index = open.length - 1 - i
      map.set(item.id, { index, offset })
      offset += (heights.get(item.id) ?? 0) + GAP
    }
    for (const [id, slot] of map) lastLayout.set(id, slot)
    return map
  })

  const frontHeight = computed(() => {
    const front = openItems.value.at(-1)
    return front ? (heights.get(front.id) ?? 0) : 0
  })

  function slotOf(item: ToastItem) {
    return layout.value.get(item.id) ?? lastLayout.get(item.id) ?? { index: 0, offset: 0 }
  }

  function itemStyle(item: ToastItem) {
    const slot = slotOf(item)
    const selfHeight = heights.get(item.id)
    return {
      '--hn-t-index': String(slot.index),
      '--hn-t-offset': `${slot.offset}px`,
      ...(selfHeight ? { '--hn-t-self-h': `${selfHeight}px` } : {}),
      ...(frontHeight.value > 0 ? { '--hn-t-front-h': `${frontHeight.value}px` } : {}),
    }
  }

  function setItemRef(id: number | string, refValue: unknown) {
    const el = refValue
    if (!(el instanceof HTMLElement)) return
    const existing = observers.get(id)
    if (existing?.el === el) return
    existing?.observer.disconnect()
    const observer = new ResizeObserver(() => {
      heights.set(id, el.offsetHeight + CARD_CHROME_BLOCK)
    })
    observer.observe(el)
    heights.set(id, el.offsetHeight + CARD_CHROME_BLOCK)
    observers.set(id, { observer, el })
  }

  watch(
    () => toastState.items.length,
    () => {
      const alive = new Set(toastState.items.map(item => item.id))
      for (const [id, entry] of observers) {
        if (alive.has(id)) continue
        entry.observer.disconnect()
        observers.delete(id)
        heights.delete(id)
        lastLayout.delete(id)
      }
    },
  )

  onBeforeUnmount(() => {
    for (const entry of observers.values()) entry.observer.disconnect()
    observers.clear()
  })

  return { slotOf, itemStyle, setItemRef }
}
