'use client'

import { useMemo } from 'react'
import type { MotionProps } from 'motion/react'
import { TRANSITION, prefersReducedMotion } from '../../../motion'

export function useHighlightMotion(axis: 'x' | 'y' | 'both') {
  const transition = useMemo(
    () => (prefersReducedMotion() ? { duration: 0 } : TRANSITION.layout),
    [],
  )
  const transformTemplate = useMemo<MotionProps['transformTemplate']>(() => {
    if (axis === 'both') return undefined

    return (_, generated) => {
      if (!generated || generated === 'none' || typeof DOMMatrix === 'undefined') return generated

      const matrix = new DOMMatrix(generated)
      if (axis === 'x') matrix.m42 = 0
      else matrix.m41 = 0
      return matrix.toString()
    }
  }, [axis])

  return { transition, transformTemplate }
}
