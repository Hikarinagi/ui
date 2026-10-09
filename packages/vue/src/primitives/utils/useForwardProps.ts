import { camelize, computed, getCurrentInstance, toRef, type MaybeRefOrGetter } from 'vue'

interface PropOptions {
  default?: unknown
}

export function useForwardProps<T extends Record<string, unknown>>(props: MaybeRefOrGetter<T>) {
  const vm = getCurrentInstance()
  const options = (vm?.type.props ?? {}) as Record<string, PropOptions>
  const defaults = Object.keys(options).reduce<Record<string, unknown>>((result, key) => {
    const value = options[key]?.default
    if (value !== undefined) result[key] = value
    return result
  }, {})
  const refProps = toRef(props)

  return computed(() => {
    const preserved: Record<string, unknown> = {}
    const assigned = vm?.vnode.props ?? {}
    Object.keys(assigned).forEach(key => {
      preserved[camelize(key)] = assigned[key]
    })
    return Object.keys({ ...defaults, ...preserved }).reduce<Partial<T>>((result, key) => {
      if (refProps.value[key] !== undefined)
        result[key as keyof T] = refProps.value[key] as T[keyof T]
      return result
    }, {}) as T
  })
}
