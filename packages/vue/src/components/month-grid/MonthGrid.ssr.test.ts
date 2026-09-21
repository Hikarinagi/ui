import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import MonthGrid from './MonthGrid.vue'
import type { MonthGridDay } from './types'

it('renders a complete six-week semantic table and slot content on the server', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          MonthGrid,
          { month: '2026-09', today: '2026-09-21', label: 'Schedule' },
          {
            default: ({ date }: MonthGridDay) =>
              date === '2026-09-21' ? h('a', { href: '/meeting' }, 'Design review') : null,
          },
        ),
    }),
  )
  expect(html.match(/<td/g)).toHaveLength(42)
  expect(html.match(/scope="col"/g)).toHaveLength(7)
  expect(html).toContain('<caption class="sr-only">Schedule · 2026年9月</caption>')
  expect(html).toContain('Design review')
  expect(html).toContain('datetime="2026-09-21"')
  expect(html).toContain('aria-current="date"')
  expect(html).not.toContain('aria-selected')
  expect(html).not.toContain('role="grid"')
})
it('supports compact weeks and hides outside content while preserving table cells', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(MonthGrid, {
          month: '2026-02',
          today: '2026-02-10',
          fixedWeeks: false,
          showOutsideDays: false,
          weekStartsOn: 1,
        }),
    }),
  )
  expect(html.match(/<td/g)).toHaveLength(35)
  expect(html).toContain('data-date="2026-01-26"')
  expect(html).not.toContain('datetime="2026-01-26"')
})
it('renders deterministic defaults from today and clamps the displayed month to valid bounds', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(MonthGrid, {
          today: '2026-09-21',
          month: 'invalid',
          min: '2026-10-12',
          max: '2026-10-28',
        }),
    }),
  )
  expect(html).toContain('2026年10月')
  expect(html).toMatch(/data-date="2026-10-11"[^>]*data-disabled/)
  expect(html).not.toMatch(/data-date="2026-10-12"[^>]*data-disabled/)
})

it('renders customized geometry, date content and state classes without a client or header spacer', async () => {
  const html = await renderToString(
    createSSRApp({
      render: () =>
        h(
          MonthGrid,
          {
            month: '2026-09',
            today: '2026-09-21',
            showHeader: false,
            dayMinHeight: '7rem',
            dayPadding: 0,
            cellClass: (day: MonthGridDay) => (day.isToday ? 'bg-accent-soft' : undefined),
            dayClass: 'gap-0',
          },
          {
            date: ({ dayLabel }: MonthGridDay) => h('b', dayLabel),
            'day-trailing': (day: MonthGridDay) =>
              day.weekday === 1 && day.isToday ? h('span', 'Team review') : null,
          },
        ),
    }),
  )
  expect(html).not.toContain('data-hn-month-grid-header')
  expect(html).toContain('--hn-month-grid-cell:7rem;')
  expect(html).toContain('--hn-month-grid-padding:0px;')
  expect(html).toMatch(/data-date="2026-09-21"[^>]*bg-accent-soft/)
  expect(html).toContain('<b>21</b>')
  expect(html).toContain('Team review')
  expect(html).toContain('aria-current="date"')
})
