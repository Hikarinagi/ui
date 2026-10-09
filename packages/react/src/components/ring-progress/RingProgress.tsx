'use client'

import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useProgressValue, type ProgressFormat } from '../progress/hooks/useProgressValue'
import {
  ringProgress,
  ringProgressArc,
  ringProgressCenter,
  ringProgressLabel,
  ringProgressRoot,
  ringProgressSvg,
  ringProgressTrack,
  type RingProgressVariants,
} from './ring-progress.variants'
import { ProgressRoot } from '../../primitives/progress'

export interface RingProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number | null
  max?: number
  label?: string
  showValue?: boolean
  format?: ProgressFormat
  tone?: RingProgressVariants['tone']
  size?: RingProgressVariants['size']
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function RingProgress({
  value = null,
  max = 100,
  label,
  showValue = false,
  format,
  tone,
  size,
  className,
  children,
  ...attrs
}: RingProgressProps) {
  const { current, text, name } = useProgressValue({ value, max, label, format })
  const offset = current === null ? 75 : max > 0 ? 100 - (current * 100) / max : 100

  return (
    <div data-hn-ring-progress="" className={cn(ringProgress(), className)}>
      <ProgressRoot
        aria-label={name}
        aria-valuetext={format ? text : undefined}
        {...attrs}
        value={current}
        max={max}
        className={ringProgressRoot({ size })}
      >
        <svg viewBox="0 0 100 100" aria-hidden="true" className={ringProgressSvg()}>
          <circle cx="50" cy="50" r="45" strokeWidth="10" className={ringProgressTrack()} />
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="10"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={offset}
            strokeLinecap={offset < 100 ? 'round' : undefined}
            className={ringProgressArc({ tone })}
          />
        </svg>
        {hasContent(children) || (showValue && text) ? (
          <div className={ringProgressCenter()}>{hasContent(children) ? children : text}</div>
        ) : null}
      </ProgressRoot>
      {label ? <span className={ringProgressLabel()}>{label}</span> : null}
    </div>
  )
}
