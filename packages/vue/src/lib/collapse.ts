import { getCurrentInstance, onBeforeUpdate, onMounted } from 'vue'

export function collapseHooks(axis: 'y' | 'x' = 'y', parentOf?: () => Element | null) {
  function gapOf(parent: Element | null) {
    if (!parent) return '0px'
    const style = getComputedStyle(parent)
    const stacked = style.display.includes('flex') || style.display.includes('grid')
    const gap = axis === 'y' ? style.rowGap : style.columnGap
    return stacked && gap !== 'normal' ? gap : '0px'
  }

  function write(el: Element, parent: Element | null) {
    ;(el as HTMLElement).style.setProperty('--hn-collapse-gap', gapOf(parent))
  }

  function beforeEnter(el: Element) {
    write(el, el.parentElement ?? parentOf?.() ?? null)
  }

  function beforeLeave(el: Element) {
    write(el, el.parentElement)
  }

  function afterEnter(el: Element) {
    ;(el as HTMLElement).style.removeProperty('--hn-collapse-gap')
  }

  return { beforeEnter, afterEnter, beforeLeave }
}

export function useCollapseHooks(axis: 'y' | 'x' = 'y') {
  const instance = getCurrentInstance()
  let parent: Element | null = null

  function remember() {
    parent = (instance?.proxy?.$el as Node | null)?.parentElement ?? parent
  }

  onMounted(remember)
  onBeforeUpdate(remember)

  return collapseHooks(axis, () => parent)
}
