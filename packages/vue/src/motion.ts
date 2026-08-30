export type Bezier = readonly [number, number, number, number]

export const EASE = {
  enter: [0, 0, 0.2, 1],
  enterStrong: [0.05, 0.7, 0.1, 1],
  exit: [0.4, 0, 1, 1],
  move: [0.4, 0, 0.2, 1],
  press: [0.3, 1.2, 0.6, 1],
} as const satisfies Record<string, Bezier>

export const DURATION = {
  fast: 0.2,
  base: 0.3,
  slow: 0.45,
  exit: 0.2,
} as const

export const TRAVEL = {
  sm: 4,
  md: 10,
} as const

export const STAGGER = 0.024

export const cssEase = (bezier: Bezier) => `cubic-bezier(${bezier.join(',')})`

export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE.move },
  base: { duration: DURATION.base, ease: EASE.move },
  enter: { duration: DURATION.base, ease: EASE.enter },
  enterStrong: { duration: DURATION.slow, ease: EASE.enterStrong },
  exit: { duration: DURATION.exit, ease: EASE.exit },
  press: { duration: DURATION.fast, ease: EASE.press },
  layout: { duration: DURATION.base, ease: EASE.move },
} as const

export type TransitionName = keyof typeof TRANSITION

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}
