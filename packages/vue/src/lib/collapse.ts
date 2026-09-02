import { getCurrentInstance, onBeforeUpdate, onMounted } from 'vue'

export type CollapseAxis = 'y' | 'x'

export function collapseGapOf(parent: Element | null, axis: CollapseAxis = 'y') {
  if (!parent) return '0px'
  const style = getComputedStyle(parent)
  const stacked = style.display.includes('flex') || style.display.includes('grid')
  const gap = axis === 'y' ? style.rowGap : style.columnGap
  return stacked && gap !== 'normal' ? gap : '0px'
}

export function writeCollapseGap(el: Element, parent: Element | null, axis: CollapseAxis = 'y') {
  ;(el as HTMLElement).style.setProperty('--hn-collapse-gap', collapseGapOf(parent, axis))
}

export function collapseHooks(axis: CollapseAxis = 'y', parentOf?: () => Element | null) {
  function beforeEnter(el: Element) {
    writeCollapseGap(el, el.parentElement ?? parentOf?.() ?? null, axis)
  }

  function beforeLeave(el: Element) {
    writeCollapseGap(el, el.parentElement, axis)
  }

  function afterEnter(el: Element) {
    ;(el as HTMLElement).style.removeProperty('--hn-collapse-gap')
  }

  return { beforeEnter, afterEnter, beforeLeave }
}

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
