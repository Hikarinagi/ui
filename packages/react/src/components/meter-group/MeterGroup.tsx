'use client'

import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { toneAt } from '../../../../shared/src/lib/meter-group'
import { Indicator } from '../indicator/Indicator'
import type { ProgressFormat } from '../progress/hooks/useProgressValue'
import { progressTrack, type ProgressVariants } from '../progress/progress.variants'
import {
  meterGroup,
  meterHeader,
  meterLegend,
  meterLegendItem,
  meterSegment,
  meterValue,
} from './meter-group.variants'
import type { MeterItem } from './types'

export interface MeterGroupProps extends HTMLAttributes<HTMLDivElement> {
  items: MeterItem[]
  max?: number
  label?: string
  legend?: boolean
  format?: ProgressFormat
  size?: ProgressVariants['size']
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function MeterGroup({
  items,
  max = 100,
  label,
  legend = true,
  format,
  size,
  className,
  ...attrs
}: MeterGroupProps) {
  const t = useUiLocale()
  const percent = new Intl.NumberFormat(t.tag, { style: 'percent', maximumFractionDigits: 0 })

  function text(value: number) {
    if (format) return format(value, max)
    return percent.format(max > 0 ? value / max : 0)
  }

  const entries = items.map((item, index) => {
    const value = Math.min(Math.max(item.value, 0), max)
    const ratio = max > 0 ? value / max : 0
    return {
      ...item,
      value,
      tone: item.tone ?? toneAt(index),
      width: `${ratio * 100}%`,
      text: text(value),
    }
  })

  const total = text(
    Math.min(
      entries.reduce((sum, entry) => sum + entry.value, 0),
      max,
    ),
  )

  return (
    <div data-hn-meter-group="" className={cn(meterGroup(), className)}>
      {label ? (
        <div className={meterHeader()}>
          <span>{label}</span>
          <span className={meterValue()}>{total}</span>
        </div>
      ) : null}
      <div
        {...attrs}
        role="group"
        aria-label={label}
        className={cn(progressTrack({ size }), 'flex')}
      >
        {entries.map(entry => (
          <span
            key={entry.label}
            role="meter"
            aria-label={entry.label}
            aria-valuenow={entry.value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuetext={format ? entry.text : undefined}
            className={meterSegment({ tone: entry.tone })}
            style={{ width: entry.width }}
          />
        ))}
      </div>
      {legend ? (
        <div className={meterLegend()}>
          {entries.map(entry => (
            <span key={entry.label} className={meterLegendItem()}>
              <Indicator tone={entry.tone} size="sm" />
              <span>{entry.label}</span>
              <span className={meterValue()}>{entry.text}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
