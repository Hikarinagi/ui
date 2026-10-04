'use client'

import type { Ref, TimeHTMLAttributes } from 'react'
import { relativeTime } from '../../../../shared/src/lib/relative-time'
import { cn } from '../../lib/cn'
import { devWarn } from '../../lib/dev'
import { useUiLocale } from '../../locale'
import { useNow } from './hooks/useNow'

export interface TimeProps extends TimeHTMLAttributes<HTMLElement> {
  value?: string | number | Date | null
  format?: 'datetime' | 'date' | 'time' | 'relative'
  ref?: Ref<HTMLElement>
}

const absoluteOptions = {
  datetime: { dateStyle: 'medium', timeStyle: 'short' },
  date: { dateStyle: 'medium' },
  time: { timeStyle: 'short' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

function parse(value: TimeProps['value']) {
  if (value == null || value === '') return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    devWarn('Time', `value 无法解析为时间:${String(value)}`, String(value))
    return null
  }
  return parsed
}

export function Time({ value, format = 'datetime', className, ref, ...attrs }: TimeProps) {
  const t = useUiLocale()
  const date = parse(value)
  const now = useNow(format === 'relative')

  const text = !date
    ? t.time.unknown
    : format === 'relative'
      ? relativeTime(date, now, t.tag, t.time.justNow)
      : new Intl.DateTimeFormat(t.tag, absoluteOptions[format]).format(date)

  if (!date)
    return (
      <span ref={ref} {...attrs} className={cn(className)}>
        {text}
      </span>
    )

  const absolute = new Intl.DateTimeFormat(t.tag, absoluteOptions.datetime).format(date)

  return (
    <time
      ref={ref as Ref<HTMLTimeElement>}
      dateTime={date.toISOString()}
      title={format === 'relative' ? absolute : undefined}
      {...attrs}
      className={cn(className)}
    >
      {text}
    </time>
  )
}
