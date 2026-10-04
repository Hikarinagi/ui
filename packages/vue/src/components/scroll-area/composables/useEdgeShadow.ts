import { shallowRef, type ShallowRef } from 'vue'
import { scrollEdges, type ScrollDirection } from '../../../../../shared/src/lib/scroll-area'

export function useEdgeShadow(
  viewport: ShallowRef<HTMLElement | undefined>,
  opts: () => { direction: ScrollDirection; shadow: boolean },
) {
  const showXStart = shallowRef(false)
  const showXEnd = shallowRef(false)
  const showYStart = shallowRef(false)
  const showYEnd = shallowRef(false)

  function updateEdges() {
    const { direction, shadow } = opts()
    const edges = scrollEdges(viewport.value, direction, shadow)
    showXStart.value = edges.xStart
    showXEnd.value = edges.xEnd
    showYStart.value = edges.yStart
    showYEnd.value = edges.yEnd
  }

  return { showXStart, showXEnd, showYStart, showYEnd, updateEdges }
}
