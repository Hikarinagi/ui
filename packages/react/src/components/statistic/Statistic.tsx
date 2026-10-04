'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { NumberFormat } from '../number-format/NumberFormat'
import { Skeleton } from '../skeleton/Skeleton'
import {
  statistic,
  statisticAffix,
  statisticBody,
  statisticDelta,
  statisticIcon,
  statisticLabel,
  statisticValue,
  type StatisticVariants,
} from './statistic.variants'

const TrendingUpIcon = lucide(TrendingUp)
const TrendingDownIcon = lucide(TrendingDown)

export interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> {
  label: string
  value?: number | string | null
  format?: 'decimal' | 'compact' | 'percent' | 'currency'
  currency?: string
  precision?: number
  prefix?: string
  suffix?: string
  delta?: number
  deltaLabel?: string
  invert?: boolean
  loading?: boolean
  size?: StatisticVariants['size']
  icon?: ReactNode
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Statistic({
  label,
  value,
  format = 'decimal',
  currency,
  precision,
  prefix,
  suffix,
  delta,
  deltaLabel,
  invert = false,
  loading = false,
  size = 'md',
  icon,
  className,
  children,
  ...attrs
}: StatisticProps) {
  const t = useUiLocale()

  const deltaText =
    delta === undefined
      ? undefined
      : new Intl.NumberFormat(t.tag, {
          style: 'percent',
          maximumFractionDigits: 1,
          signDisplay: 'exceptZero',
        }).format(delta)

  const deltaTone = !delta ? 'neutral' : delta > 0 !== invert ? 'success' : 'danger'

  return (
    <div data-hn-statistic="" {...attrs} className={cn(statistic(), className)}>
      <div className={statisticBody()}>
        <span className={statisticLabel()}>{label}</span>
        <span className={statisticValue({ size })}>
          {loading ? (
            <Skeleton className="h-[1.25em] w-24" />
          ) : (
            <>
              {prefix ? <span className={statisticAffix()}>{prefix}</span> : null}
              {typeof value === 'number' ? (
                <NumberFormat
                  value={value}
                  format={format}
                  currency={currency}
                  precision={precision}
                />
              ) : (
                <span>{value ?? '—'}</span>
              )}
              {suffix ? <span className={statisticAffix()}>{suffix}</span> : null}
            </>
          )}
        </span>
        {deltaText ? (
          <span className={statisticDelta({ tone: deltaTone })}>
            {loading ? (
              <Skeleton className="h-[1.25em] w-16" />
            ) : (
              <>
                {delta! > 0 ? (
                  <TrendingUpIcon aria-hidden="true" />
                ) : delta! < 0 ? (
                  <TrendingDownIcon aria-hidden="true" />
                ) : null}
                <span>{deltaText}</span>
                {deltaLabel ? <span className="text-muted">{deltaLabel}</span> : null}
              </>
            )}
          </span>
        ) : null}
        {children}
      </div>
      {hasContent(icon) ? (
        <span aria-hidden="true" className={statisticIcon()}>
          {icon}
        </span>
      ) : null}
    </div>
  )
}
