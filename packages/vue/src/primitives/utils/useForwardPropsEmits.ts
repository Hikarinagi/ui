import { computed, type MaybeRefOrGetter } from 'vue'
import { useEmitAsProps } from './useEmitAsProps'
import { useForwardProps } from './useForwardProps'

export function useForwardPropsEmits<T extends Record<string, unknown>, Name extends string>(
  props: MaybeRefOrGetter<T>,
  emit?: (name: Name, ...args: never[]) => void,
) {
  const parsed = useForwardProps(props)
  const emits = emit ? useEmitAsProps(emit) : {}
  return computed(() => ({ ...parsed.value, ...emits }))
}
