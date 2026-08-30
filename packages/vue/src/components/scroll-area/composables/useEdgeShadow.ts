import { computed, shallowRef, watch, type ShallowRef } from 'vue'

interface EdgeShadowOptions {
  direction: 'vertical' | 'horizontal' | 'both'
  shadow: boolean
}

type AxisEdge = 'start' | 'end' | 'both' | undefined

interface EdgeState {
  x?: AxisEdge
  y?: AxisEdge
}

function axisEdge(el: HTMLElement, vertical: boolean): AxisEdge {
  const scrollStart = vertical ? el.scrollTop : Math.abs(el.scrollLeft)
  const scrollSize = vertical ? el.scrollHeight : el.scrollWidth
  const clientSize = vertical ? el.clientHeight : el.clientWidth

  const hasScrollBefore = scrollStart > 0
  const hasScrollAfter = scrollStart + clientSize < scrollSize - 1

  return hasScrollBefore && hasScrollAfter
    ? 'both'
    : hasScrollBefore
      ? 'start'
      : hasScrollAfter
        ? 'end'
        : undefined
}

export function useEdgeShadow(
  viewport: ShallowRef<HTMLElement | undefined>,
  options: () => EdgeShadowOptions,
) {
  const edges = shallowRef<EdgeState>({})

  function updateEdges() {
    const el = viewport.value
    const { direction, shadow } = options()
    if (!el || !shadow) {
      edges.value = {}
      return
    }
    edges.value = {
      x: direction === 'vertical' ? undefined : axisEdge(el, false),
      y: direction === 'horizontal' ? undefined : axisEdge(el, true),
    }
  }

  const show = (axis: 'x' | 'y', side: 'start' | 'end') =>
    computed(() => edges.value[axis] === side || edges.value[axis] === 'both')

  watch(() => options(), updateEdges)

  return {
    showXStart: show('x', 'start'),
    showXEnd: show('x', 'end'),
    showYStart: show('y', 'start'),
    showYEnd: show('y', 'end'),
    updateEdges,
  }
}
