import { computed, nextTick, ref, watch, type Ref } from 'vue'

export interface VModelOptions<V> {
  defaultValue?: V
  passive?: boolean
}

export function useVModel<P extends object, K extends keyof P & string, V = P[K]>(
  props: P,
  key: K,
  emit: (event: `update:${K}`, value: V) => void,
  options: VModelOptions<V> = {},
): Ref<V> {
  const event = `update:${key}` as const
  const current = () =>
    (props[key] !== undefined ? (props[key] as unknown as V) : options.defaultValue) as V
  if (!options.passive)
    return computed({
      get: current,
      set: value => emit(event, value),
    })
  const proxy = ref(current()) as Ref<V>
  let updating = false
  watch(
    () => props[key],
    value => {
      if (updating) return
      updating = true
      proxy.value = value as unknown as V
      void nextTick(() => (updating = false))
    },
  )
  watch(proxy, value => {
    if (!updating && value !== (props[key] as unknown)) emit(event, value)
  })
  return proxy
}
