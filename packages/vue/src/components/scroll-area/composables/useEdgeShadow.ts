import { shallowRef, type ShallowRef } from 'vue'

export function useEdgeShadow(
  viewport: ShallowRef<HTMLElement | undefined>,
  opts: () => { direction: 'vertical' | 'horizontal' | 'both'; shadow: boolean },
) {
  const showXStart = shallowRef(false)
  const showXEnd = shallowRef(false)
  const showYStart = shallowRef(false)
  const showYEnd = shallowRef(false)

  function updateEdges() {
    const el = viewport.value
    const { direction, shadow } = opts()
    if (!el || !shadow) {
      showXStart.value = false
      showXEnd.value = false
      showYStart.value = false
      showYEnd.value = false
      return
    }
    const room = 1
    const x = direction !== 'vertical'
    const y = direction !== 'horizontal'
    showXStart.value = x && Math.abs(el.scrollLeft) > room
    showXEnd.value = x && Math.abs(el.scrollLeft) + el.clientWidth < el.scrollWidth - room
    showYStart.value = y && el.scrollTop > room
    showYEnd.value = y && el.scrollTop + el.clientHeight < el.scrollHeight - room
  }

  return { showXStart, showXEnd, showYStart, showYEnd, updateEdges }
}
