'use client'

import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useProgressValue, type ProgressFormat } from './hooks/useProgressValue'
import {
  progress,
  progressBar,
  progressHeader,
  progressTrack,
  progressValue,
  type ProgressVariants,
} from './progress.variants'
import { ProgressIndicator, ProgressRoot } from '../../primitives/progress'

export type { ProgressFormat }

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number | null
  max?: number
  label?: string
  showValue?: boolean
  format?: ProgressFormat
  tone?: ProgressVariants['tone']
  size?: ProgressVariants['size']
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Progress({
  value = null,
  max = 100,
  label,
  showValue = false,
  format,
  tone,
  size,
  className,
  ...attrs
}: ProgressProps) {
  const { current, ratio, text, name } = useProgressValue({ value, max, label, format })

  return (
    <div
      data-hn-progress=""
      className={cn(progress(), className)}
      style={{ '--hn-progress-p': String(ratio) } as CSSProperties}
    >
      {label || (showValue && text) ? (
        <div className={progressHeader()}>
          {label ? <span>{label}</span> : null}
          {showValue && text ? <span className={progressValue()}>{text}</span> : null}
        </div>
      ) : null}
      <ProgressRoot
        aria-label={name}
        aria-valuetext={format ? text : undefined}
        {...attrs}
        value={current}
        max={max}
        className={progressTrack({ size })}
      >
        <ProgressIndicator className={progressBar({ tone })} />
      </ProgressRoot>
    </div>
  )
}
