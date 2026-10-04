'use client'

import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { devWarn } from '../../lib/dev'
import { useUiLocale } from '../../locale'

export interface NumberFormatProps extends HTMLAttributes<HTMLSpanElement> {
  value?: number | null
  format?: 'decimal' | 'compact' | 'percent' | 'currency'
  currency?: string
  precision?: number
  ref?: Ref<HTMLSpanElement>
}

export function NumberFormat({
  value,
  format = 'decimal',
  currency,
  precision,
  className,
  ...attrs
}: NumberFormatProps) {
  const t = useUiLocale()
  const valid = typeof value === 'number' && Number.isFinite(value)

  function formatText() {
    if (!valid) return '—'
    const options: Intl.NumberFormatOptions = {}
    if (format === 'compact') options.notation = 'compact'
    if (format === 'percent') options.style = 'percent'
    if (format === 'currency') {
      if (currency) {
        options.style = 'currency'
        options.currency = currency
      } else {
        devWarn('NumberFormat', 'currency 档需要 currency 代码,已退回 decimal')
      }
    }
    if (precision != null) options.maximumFractionDigits = precision
    return new Intl.NumberFormat(t.tag, options).format(value as number)
  }

  const full =
    valid && format === 'compact' ? new Intl.NumberFormat(t.tag).format(value as number) : undefined

  return (
    <span title={full} {...attrs} className={cn(className)}>
      {formatText()}
    </span>
  )
}
