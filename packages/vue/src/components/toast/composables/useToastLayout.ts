import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import {
  toastCardHeight,
  toastItemStyle,
  toastLayout,
  type ToastSlot,
} from '../../../../../shared/src/lib/toast-layout'
import { toastState, type ToastItem } from '../store'

export { VISIBLE_STACK } from '../../../../../shared/src/lib/toast-layout'

export function useToastLayout() {
  const heights = reactive(new Map<number | string, number>())
  const observers = new Map<number | string, { observer: ResizeObserver; el: HTMLElement }>()
  const lastLayout = new Map<number | string, ToastSlot>()

  const openItems = computed(() => toastState.items.filter(item => item.open))

  const layout = computed(() => {
    const map = toastLayout(openItems.value, id => heights.get(id))
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
    return toastItemStyle(slotOf(item), heights.get(item.id), frontHeight.value)
  }

  function setItemRef(id: number | string, refValue: unknown) {
    const el = refValue
    if (!(el instanceof HTMLElement)) return
    const existing = observers.get(id)
    if (existing?.el === el) return
    existing?.observer.disconnect()
    const observer = new ResizeObserver(() => {
      heights.set(id, toastCardHeight(el))
    })
    observer.observe(el)
    heights.set(id, toastCardHeight(el))
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
