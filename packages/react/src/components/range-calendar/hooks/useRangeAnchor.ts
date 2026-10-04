'use client'

import { useState } from 'react'
import type { DateValue } from '@internationalized/date'
import { useWatch } from '../../../primitives/date-field/date/hooks'

export function useRangeAnchor(start: DateValue | undefined) {
  const [anchor, setAnchor] = useState<DateValue | undefined>(start)

  useWatch([start] as const, ([next]) => {
    setAnchor(next)
  })

  function onStartValue(next: DateValue | undefined) {
    setAnchor(next)
  }

  return { anchor, onStartValue }
}
