import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

export function useEmitAsProps<Name extends string>(emit: (name: Name, ...args: never[]) => void) {
  const vm = getCurrentInstance()
  const events = vm?.type.emits as Name[] | undefined
  const result: Record<string, (...args: never[]) => void> = {}
  if (!events?.length)
    console.warn(`No emitted event found. Please check component: ${vm?.type.__name}`)
  events?.forEach(event => {
    result[toHandlerKey(camelize(event))] = (...args) => emit(event, ...args)
  })
  return result
}
