'use client'

import { useMemo, useState } from 'react'
import { Button, MonthGrid, Popover, SegmentedControl, Stack, Tag, Text } from '@hina-ui/react'
import { monthGridSchedule } from '../../month-grid'

const events = monthGridSchedule('en')
const filters = [
  { value: 'all', label: 'All' },
  { value: 'design', label: 'Design' },
  { value: 'release', label: 'Release' },
]

export default function Demo() {
  const [month, setMonth] = useState('2026-09')
  const [category, setCategory] = useState<string | number>('all')
  const [completed, setCompleted] = useState<number[]>([])
  const filtered = useMemo(
    () => events.filter(event => category === 'all' || event.kind === category),
    [category],
  )
  const visible = filtered.filter(event => event.date.startsWith(month))
  const byDate = useMemo(() => {
    const result = new Map<string, typeof events>()
    for (const event of filtered) result.set(event.date, [...(result.get(event.date) ?? []), event])
    return result
  }, [filtered])
  const onDate = (date: string) => byDate.get(date) ?? []

  function toggle(id: number) {
    setCompleted(
      completed.includes(id) ? completed.filter(value => value !== id) : [...completed, id],
    )
  }

  return (
    <Stack className="w-full max-w-4xl" gap="sm">
      <MonthGrid
        month={month}
        onMonthChange={value => setMonth(value ?? '')}
        today="2026-09-21"
        dayMinHeight={124}
        dayClass="@max-[520px]/hn-month-grid:min-h-20"
        label="Team schedule"
        renderHeaderActions={() => (
          <SegmentedControl
            value={category}
            onValueChange={setCategory}
            options={filters}
            size="sm"
            aria-label="Schedule category"
          />
        )}
        renderDayTrailing={({ date }) =>
          onDate(date).length ? (
            <Text
              size="xs"
              tone="muted"
              aria-label={`${onDate(date).length} events`}
              className="@max-[520px]/hn-month-grid:hidden"
            >
              {onDate(date).length}
            </Text>
          ) : null
        }
        renderFooter={() => (
          <Text size="sm" tone="muted">
            {visible.length} events this month,{' '}
            {visible.filter(event => completed.includes(event.id)).length} completed.
          </Text>
        )}
      >
        {({ date, label }) =>
          onDate(date).length ? (
            <Stack gap="xs" className="min-w-0">
              {onDate(date)
                .slice(0, 2)
                .map(event => (
                  <Text
                    key={event.id}
                    size="xs"
                    className={`min-w-0 truncate rounded-sm border-s-2 bg-subtle px-1 py-0.5 @max-[520px]/hn-month-grid:hidden ${event.kind === 'design' ? 'border-accent' : 'border-warning'} ${completed.includes(event.id) ? 'text-muted line-through' : ''}`}
                  >
                    {event.title}
                  </Text>
                ))}
              <Popover
                aria-label={`${label} · events`}
                content={
                  <Stack className="w-60" gap="lg">
                    <Text size="sm" weight="medium">
                      {label}
                    </Text>
                    {onDate(date).map(event => (
                      <Stack key={event.id} gap="xs">
                        <Text size="sm">
                          {event.time} · {event.title}
                        </Text>
                        <Button
                          size="sm"
                          variant="link"
                          tone="neutral"
                          className="self-start"
                          onClick={() => toggle(event.id)}
                        >
                          {completed.includes(event.id) ? 'Undo completion' : 'Mark complete'}
                        </Button>
                        {completed.includes(event.id) && (
                          <Tag size="sm" tone="success" className="self-start">
                            Completed
                          </Tag>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                }
              >
                <Button
                  asChild
                  variant="ghost"
                  tone="neutral"
                  size="sm"
                  ripple={false}
                  className="hn-press-none h-auto w-full min-w-0 justify-start px-1 py-1"
                >
                  <Text
                    as="button"
                    {...{ type: 'button' }}
                    size="xs"
                    className="truncate text-start"
                    aria-label={`${label}, ${onDate(date).length} events`}
                  >
                    <Text as="span" size="inherit" className="@max-[520px]/hn-month-grid:hidden">
                      {onDate(date).length > 2 ? `+${onDate(date).length - 2} more` : 'Details'}
                    </Text>
                    <Text
                      as="span"
                      size="inherit"
                      className="hidden @max-[520px]/hn-month-grid:inline"
                    >
                      {onDate(date).length}
                    </Text>
                  </Text>
                </Button>
              </Popover>
            </Stack>
          ) : null
        }
      </MonthGrid>
      <Text size="sm" tone="muted">
        Filter by category while keeping the default month navigation. Each day shows two entries
        with a details popover; narrow layouts use counts.
      </Text>
    </Stack>
  )
}
