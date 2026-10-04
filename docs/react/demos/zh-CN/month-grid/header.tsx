'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton, Inline, MonthGrid, Select, Stack, Switch, Text } from '@hina-ui/react'

const options = [
  { label: '2026 年 9 月', value: '2026-09' },
  { label: '2026 年 10 月', value: '2026-10' },
  { label: '2026 年 11 月', value: '2026-11' },
]

export default function Demo() {
  const [month, setMonth] = useState('2026-09')
  const [fixed, setFixed] = useState(false)
  const [outside, setOutside] = useState(false)

  return (
    <Stack className="w-full max-w-lg">
      <Inline gap="lg" wrap>
        <Switch checked={fixed} onCheckedChange={setFixed}>
          固定六周
        </Switch>
        <Switch checked={outside} onCheckedChange={setOutside}>
          显示相邻月份
        </Switch>
      </Inline>
      <MonthGrid
        month={month}
        onMonthChange={value => setMonth(value ?? '')}
        today="2026-09-21"
        min="2026-09-10"
        max="2026-11-20"
        fixedWeeks={fixed}
        showOutsideDays={outside}
        weekStartsOn={0}
        size="sm"
        label="开放日期范围"
        renderHeader={({ prev, next, canPrev, canNext }) => (
          <>
            <IconButton label="上个月" size="sm" disabled={!canPrev} onClick={prev}>
              <ChevronLeft className="rtl:rotate-180" />
            </IconButton>
            <Select
              value={month}
              onValueChange={value => setMonth(String(value))}
              options={options}
              size="sm"
              aria-label="月份"
              className="min-w-0 flex-1"
            />
            <IconButton label="下个月" size="sm" disabled={!canNext} onClick={next}>
              <ChevronRight className="rtl:rotate-180" />
            </IconButton>
          </>
        )}
        renderFooter={() => (
          <Text size="xs" tone="muted">
            开放范围：9 月 10 日至 11 月 20 日。每周从周日开始。
          </Text>
        )}
      >
        {({ isDisabled, isOutside }) =>
          !isOutside ? (
            <Text size="xs" tone="muted" className="text-center">
              {isDisabled ? '—' : '开放'}
            </Text>
          ) : null
        }
      </MonthGrid>
    </Stack>
  )
}
