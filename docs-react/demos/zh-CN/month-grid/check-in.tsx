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
        <Text weight="medium">每月签到</Text>
        <Text size="sm" tone="muted">
          2026 年 9 月
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
        label="九月签到记录"
        renderDayTrailing={({ date, day, label }) =>
          signed.includes(day) ? (
            <Text as="span" tone="accent" className="inline-flex" aria-label={`${label} · 已签到`}>
              <Check className="size-3" aria-hidden="true" />
            </Text>
          ) : date === '2026-09-25' ? (
            <Text size="xs" tone="muted" aria-label="团队休假日">
              休
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
              aria-label={`${label} · 签到`}
              onClick={() => setSigned([...signed, day])}
            >
              签到
            </Button>
          ) : null
        }
      </MonthGrid>
      <Text size="sm" tone="muted" role="status">
        本月已签到 {signed.length} 天。浅色底表示已签到；25 日为团队休假日。
      </Text>
    </Stack>
  )
}
