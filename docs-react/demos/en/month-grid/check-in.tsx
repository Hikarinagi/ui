'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button, Inline, MonthGrid, Stack, Text, type MonthGridDay } from '@hina-ui/react'

export default function Demo() {
  const [signed, setSigned] = useState([1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18])

  function cellClass(day: MonthGridDay) {
    if (day.isOutside) return
    if (signed.includes(day.day)) return 'bg-accent-soft/40'
    if (day.weekday === 0 || day.weekday === 6 || day.date === '2026-09-25') return 'bg-subtle'
  }

  return (
    <Stack className="w-full max-w-lg" gap="sm">
      <Inline justify="between">
        <Text weight="medium">Monthly check-ins</Text>
        <Text size="sm" tone="muted">
          September 2026
        </Text>
      </Inline>
      <MonthGrid
        month="2026-09"
        today="2026-09-21"
        showHeader={false}
        showOutsideDays={false}
        dayMinHeight={72}
        fixedWeeks={false}
        cellClass={cellClass}
        size="sm"
        label="September check-ins"
        renderDayTrailing={({ date, day, label }) =>
          signed.includes(day) ? (
            <Text
              as="span"
              tone="accent"
              className="inline-flex"
              aria-label={`${label} · Checked in`}
            >
              <Check className="size-3" aria-hidden="true" />
            </Text>
          ) : date === '2026-09-25' ? (
            <Text size="xs" tone="muted" aria-label="Team day off">
              Off
            </Text>
          ) : null
        }
      >
        {({ isToday, day, label }) =>
          isToday && !signed.includes(day) ? (
            <Button
              size="sm"
              variant="soft"
              className="hn-press-none h-6 min-w-0 px-1 text-xs"
              aria-label={`${label} · Check in`}
              onClick={() => setSigned([...signed, day])}
            >
              +1
            </Button>
          ) : null
        }
      </MonthGrid>
      <Text size="sm" tone="muted" role="status">
        {signed.length} check-ins this month. Tinted days are complete; September 25 is a team day
        off.
      </Text>
    </Stack>
  )
}
