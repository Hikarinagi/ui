import { computed, shallowRef, type CSSProperties } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { DataListProps } from '../types'

export function useDataListBody<T>(props: DataListProps<T>) {
  const body = shallowRef<HTMLElement>()
  const lastHeight = shallowRef(0)
  const length = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)
  const style = computed<CSSProperties>(() => {
    if (props.height !== undefined || props.virtualize)
      return { height: length(props.height ?? 320) }
    const minimum = length(props.minHeight ?? 160)
    return {
      minHeight:
        props.loading && lastHeight.value ? `max(${minimum}, ${lastHeight.value}px)` : minimum,
    }
  })
  useResizeObserver(body, ([entry]) => {
    if (entry && !props.loading && props.items.length)
      lastHeight.value = entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height
  })
  return { body, style }
}
