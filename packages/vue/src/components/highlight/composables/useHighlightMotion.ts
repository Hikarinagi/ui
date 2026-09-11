import { computed } from 'vue'
import type { MotionProps } from 'motion-v'
import { TRANSITION, prefersReducedMotion } from '../../../motion'

export function useHighlightMotion(axis: () => 'x' | 'y' | 'both') {
  const transition = computed(() => (prefersReducedMotion() ? { duration: 0 } : TRANSITION.layout))
  const transformTemplate = computed<MotionProps['transformTemplate']>(() => {
    const direction = axis()
    if (direction === 'both') return undefined

    return (_, generated) => {
      if (!generated || generated === 'none' || typeof DOMMatrix === 'undefined') return generated

      const matrix = new DOMMatrix(generated)
      if (direction === 'x') matrix.m42 = 0
      else matrix.m41 = 0
      return matrix.toString()
    }
  })

  return { transition, transformTemplate }
}
