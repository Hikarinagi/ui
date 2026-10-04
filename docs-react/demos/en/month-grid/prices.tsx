'use client'

import { useState } from 'react'
import { Button, Inline, MonthGrid, Stack, Text, type MonthGridDay } from '@hina-ui/react'
import { monthGridPrices } from '../../../../docs/app/demos/month-grid'

const prices = monthGridPrices()
const price = (date: string) => prices[date]

export default function Demo() {
  const [selected, setSelected] = useState('')

  function cellClass(day: MonthGridDay) {
    if (selected === day.date) return 'bg-accent-soft'
    if (!day.isOutside && (day.isPast || !price(day.date)?.rooms)) return 'bg-subtle'
  }

  return (
    <Stack className="w-full max-w-2xl" gap="sm">
      <Inline justify="between" wrap>
        <Text weight="medium">Nightly rates</Text>
        <Text size="sm" tone="muted">
          September 2026 · per night
        </Text>
      </Inline>
      <MonthGrid
        month="2026-09"
        today="2026-09-21"
        showHeader={false}
        showOutsideDays={false}
        fixedWeeks={false}
        dayMinHeight={104}
        dayPadding={0}
        cellClass={cellClass}
        dayClass="gap-0 @max-[480px]/hn-month-grid:min-h-24"
        label="September room rates"
        renderDay={({ date, dayLabel, label, isPast, isToday }) => (
          <Button
            asChild
            variant="ghost"
            tone="neutral"
            size="sm"
            ripple={false}
            disabled={isPast || !price(date)?.rooms}
            className="hn-press-none h-auto w-full flex-1 items-center justify-between gap-1 rounded-none border-0 px-1 py-2 text-center focus-visible:outline-offset-[-2px] @min-[480px]/hn-month-grid:items-start @min-[480px]/hn-month-grid:px-3 @min-[480px]/hn-month-grid:text-start"
            onClick={() => setSelected(date)}
          >
            <Stack
              as="button"
              {...{ type: 'button', disabled: isPast || !price(date)?.rooms }}
              aria-pressed={selected === date}
              aria-label={`${label}, ${price(date)?.rooms ? `¥${price(date)!.price}, ${price(date)!.rooms} rooms left` : 'Sold out'}`}
            >
              <Text
                as="time"
                {...{ dateTime: date }}
                aria-current={isToday ? 'date' : undefined}
                size="sm"
                tone={isToday ? 'accent' : 'default'}
                weight={isToday ? 'medium' : 'normal'}
              >
                {dayLabel}
              </Text>
              {price(date)?.rooms ? (
                <Text
                  size="xs"
                  tone={isPast ? 'muted' : 'accent'}
                  className="@min-[480px]/hn-month-grid:text-sm"
                >
                  ¥{price(date)!.price}
                </Text>
              ) : (
                <Text size="xs" tone="muted">
                  <Text as="span" size="inherit" className="@max-[480px]/hn-month-grid:hidden">
                    Sold out
                  </Text>
                  <Text
                    as="span"
                    size="inherit"
                    className="hidden @max-[480px]/hn-month-grid:inline"
                  >
                    Full
                  </Text>
                </Text>
              )}
              <Text size="xs" tone="muted" aria-hidden="true">
                <Text as="span" size="inherit" className="@max-[480px]/hn-month-grid:hidden">
                  {isPast ? 'Past' : price(date)?.rooms ? `${price(date)!.rooms} left` : 'Full'}
                </Text>
                <Text as="span" size="inherit" className="hidden @max-[480px]/hn-month-grid:inline">
                  {!isPast && price(date)?.rooms ? `${price(date)!.rooms} rm` : '—'}
                </Text>
              </Text>
            </Stack>
          </Button>
        )}
        renderFooter={() => (
          <Text size="sm" tone="muted" role="status">
            {selected
              ? `Selected ${selected}, ¥${price(selected)!.price} / night`
              : 'Choose an available date. Past dates and sold-out dates are disabled.'}
          </Text>
        )}
      />
      <Text size="sm" tone="muted">
        The action fills the day content area; cellClass controls its background. Prices,
        availability and selection belong to the caller.
      </Text>
    </Stack>
  )
}
