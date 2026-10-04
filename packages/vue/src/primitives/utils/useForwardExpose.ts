import {
  computed,
  getCurrentInstance,
  onUpdated,
  ref,
  triggerRef,
  type ComponentPublicInstance,
} from 'vue'
import { unrefElement, type MaybeElementRef } from '@vueuse/core'

export function useForwardExpose<T extends ComponentPublicInstance>() {
  const instance = getCurrentInstance()!
  const currentRef = ref<Element | T | null>()
  const currentElement = computed<HTMLElement>(() => resolveCurrentElement())

  onUpdated(() => {
    if (currentElement.value !== resolveCurrentElement()) triggerRef(currentRef)
  })

  function resolveCurrentElement() {
    const current = currentRef.value
    return current &&
      '$el' in current &&
      ['#text', '#comment'].includes((current.$el as Node).nodeName)
      ? current.$el.nextElementSibling
      : unrefElement(currentRef as MaybeElementRef)
  }

  const localExpose: Record<string, unknown> = Object.assign({}, instance.exposed)
  const exposed: Record<string, unknown> = {}

  for (const key in instance.props)
    Object.defineProperty(exposed, key, {
      enumerable: true,
      configurable: true,
      get: () => instance.props[key],
    })

  if (Object.keys(localExpose).length > 0)
    for (const key in localExpose)
      Object.defineProperty(exposed, key, {
        enumerable: true,
        configurable: true,
        get: () => localExpose[key],
      })

  Object.defineProperty(exposed, '$el', {
    enumerable: true,
    configurable: true,
    get: () => instance.vnode.el,
  })
  instance.exposed = exposed

  function forwardRef(target: Element | T | null) {
    currentRef.value = target
    if (!target) return

    Object.defineProperty(exposed, '$el', {
      enumerable: true,
      configurable: true,
      get: () => (target instanceof Element ? target : target.$el),
    })

    if (!(target instanceof Element) && !Object.hasOwn(target, '$el')) {
      const childExposed = target.$.exposed
      const merged = Object.assign({}, exposed)
      for (const key in childExposed)
        Object.defineProperty(merged, key, {
          enumerable: true,
          configurable: true,
          get: () => childExposed[key],
        })
      instance.exposed = merged
    }
  }

  return { forwardRef, currentRef, currentElement }
}
