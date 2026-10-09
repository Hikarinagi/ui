'use client'

import { useRef, type Ref, type TimeHTMLAttributes } from 'react'
import { relativeTime } from '../../../../shared/src/lib/relative-time'
import { cn } from '../../lib/cn'
import { devWarn } from '../../lib/dev'
import { useUiLocale } from '../../locale'
import { useComposedRefs } from '../../primitives/utils/compose-refs'
import { useLayoutEffect } from '../../primitives/utils/layout-effect'
import { Tooltip } from '../tooltip/Tooltip'
import { useTooltipProviderPresence } from '../tooltip/context'
import { useNow } from './hooks/useNow'

export interface TimeProps extends TimeHTMLAttributes<HTMLElement> {
  value?: string | number | Date | null
  format?: 'datetime' | 'date' | 'time' | 'relative'
  tooltip?: boolean
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

export function Time({
  value,
  format = 'datetime',
  tooltip = true,
  className,
  ref,
  ...attrs
}: TimeProps) {
  const t = useUiLocale()
  const date = parse(value)
  const now = useNow(format === 'relative')
  const provided = useTooltipProviderPresence()
  const node = useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, node)

  const text = !date
    ? t.time.unknown
    : format === 'relative'
      ? relativeTime(date, now, t.tag, t.time.justNow)
      : new Intl.DateTimeFormat(t.tag, absoluteOptions[format]).format(date)

  useLayoutEffect(() => {
    const element = node.current
    if (date && element && element.textContent !== text) element.textContent = text
  })

  if (!date)
    return (
      <span ref={ref} {...attrs} className={cn(className)}>
        {text}
      </span>
    )

  const time = (
    <time
      ref={composedRef as Ref<HTMLTimeElement>}
      dateTime={date.toISOString()}
      suppressHydrationWarning
      {...attrs}
      className={cn(className)}
    >
      {text}
    </time>
  )

  if (!provided || !tooltip || format !== 'relative') return time
  return (
    <Tooltip content={new Intl.DateTimeFormat(t.tag, absoluteOptions.datetime).format(date)}>
      {time}
    </Tooltip>
  )
}
