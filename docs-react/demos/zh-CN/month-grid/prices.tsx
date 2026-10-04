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
        <Text weight="medium">每日房价</Text>
        <Text size="sm" tone="muted">
          2026 年 9 月 · 每晚
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
        label="九月房价"
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
              aria-label={`${label}，${price(date)?.rooms ? `¥${price(date)!.price}，剩余 ${price(date)!.rooms} 间` : '售罄'}`}
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
                <Text size="xs" tone="muted" className="max-w-full truncate">
                  售罄
                </Text>
              )}
              <Text size="xs" tone="muted" aria-hidden="true">
                <Text as="span" size="inherit" className="@max-[480px]/hn-month-grid:hidden">
                  {isPast ? '已过期' : price(date)?.rooms ? `余 ${price(date)!.rooms} 间` : '无房'}
                </Text>
                <Text as="span" size="inherit" className="hidden @max-[480px]/hn-month-grid:inline">
                  {!isPast && price(date)?.rooms ? `${price(date)!.rooms}间` : '—'}
                </Text>
              </Text>
            </Stack>
          </Button>
        )}
        renderFooter={() => (
          <Text size="sm" tone="muted" role="status">
            {selected
              ? `已选择 ${selected}，¥${price(selected)!.price} / 晚`
              : '选择可预订的日期。已过期及售罄日期不可操作。'}
          </Text>
        )}
      />
      <Text size="sm" tone="muted">
        整格按钮铺满内部空间，背景由 cellClass 控制。价格、库存与选中状态均由业务持有。
      </Text>
    </Stack>
  )
}
