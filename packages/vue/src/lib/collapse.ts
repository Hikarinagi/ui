import {
  getCurrentInstance,
  onBeforeUpdate,
  onMounted,
  shallowRef,
  type ComponentPublicInstance,
} from 'vue'
import {
  collapseHooks,
  writeCollapseGap,
  type CollapseAxis,
} from '../../../shared/src/lib/collapse'

export * from '../../../shared/src/lib/collapse'

export function useCollapseHooks(axis: CollapseAxis = 'y') {
  const instance = getCurrentInstance()
  let parent: Element | null = null

  function remember() {
    parent = (instance?.proxy?.$el as Node | null)?.parentElement ?? parent
  }

  onMounted(remember)
  onBeforeUpdate(remember)

  return collapseHooks(axis, () => parent)
}

export function useCollapseGap() {
  const content = shallowRef<ComponentPublicInstance | null>(null)

  function measure() {
    const el = content.value?.$el as Element | undefined
    if (el instanceof Element) writeCollapseGap(el, el.parentElement)
  }

  onMounted(measure)
  onBeforeUpdate(measure)

  return content
}
