'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton, Inline, MonthGrid, Select, Stack, Switch, Text } from '@hina-ui/react'

const options = [
  { label: 'September 2026', value: '2026-09' },
  { label: 'October 2026', value: '2026-10' },
  { label: 'November 2026', value: '2026-11' },
]

export default function Demo() {
  const [month, setMonth] = useState('2026-09')
  const [fixed, setFixed] = useState(false)
  const [outside, setOutside] = useState(false)

  return (
    <Stack className="w-full max-w-lg">
      <Inline gap="lg" wrap>
        <Switch checked={fixed} onCheckedChange={setFixed}>
          Fixed six weeks
        </Switch>
        <Switch checked={outside} onCheckedChange={setOutside}>
          Adjacent months
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
        label="Available dates"
        renderHeader={({ prev, next, canPrev, canNext }) => (
          <>
            <IconButton label="Previous month" size="sm" disabled={!canPrev} onClick={prev}>
              <ChevronLeft className="rtl:rotate-180" />
            </IconButton>
            <Select
              value={month}
              onValueChange={value => setMonth(String(value))}
              options={options}
              size="sm"
              aria-label="Month"
              className="min-w-0 flex-1"
            />
            <IconButton label="Next month" size="sm" disabled={!canNext} onClick={next}>
              <ChevronRight className="rtl:rotate-180" />
            </IconButton>
          </>
        )}
        renderFooter={() => (
          <Text size="xs" tone="muted">
            Available September 10 – November 20. Weeks begin on Sunday.
          </Text>
        )}
      >
        {({ isDisabled, isOutside }) =>
          !isOutside ? (
            <Text size="xs" tone="muted" className="text-center">
              {isDisabled ? '—' : 'Open'}
            </Text>
          ) : null
        }
      </MonthGrid>
    </Stack>
  )
}
