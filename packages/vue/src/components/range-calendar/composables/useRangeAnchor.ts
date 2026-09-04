import { shallowRef, watch, type Ref } from 'vue'
import type { DateValue } from '@internationalized/date'

export function useRangeAnchor(start: Ref<DateValue | undefined>) {
  const anchor = shallowRef<DateValue | undefined>(start.value)

  watch(start, next => {
    anchor.value = next
  })

  function onStartValue(next: DateValue | undefined) {
    anchor.value = next
  }

  return { anchor, onStartValue }
}
