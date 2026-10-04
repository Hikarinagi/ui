import { expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { MonthGrid } from './MonthGrid'

it('renders a complete six-week semantic table and slot content on the server', () => {
  const html = renderToString(
    <MonthGrid month="2026-09" today="2026-09-21" label="Schedule">
      {({ date }) => (date === '2026-09-21' ? <a href="/meeting">Design review</a> : null)}
    </MonthGrid>,
  )
  expect(html.match(/<td/g)).toHaveLength(42)
  expect(html.match(/scope="col"/g)).toHaveLength(7)
  expect(html).toContain('<caption class="sr-only">Schedule · 2026年9月</caption>')
  expect(html).toContain('Design review')
  expect(html).toMatch(/datetime="2026-09-21"/i)
  expect(html).toContain('aria-current="date"')
  expect(html).not.toContain('aria-selected')
  expect(html).not.toContain('role="grid"')
})
it('supports compact weeks and hides outside content while preserving table cells', () => {
  const html = renderToString(
    <MonthGrid
      month="2026-02"
      today="2026-02-10"
      fixedWeeks={false}
      showOutsideDays={false}
      weekStartsOn={1}
    />,
  )
  expect(html.match(/<td/g)).toHaveLength(35)
  expect(html).toContain('data-date="2026-01-26"')
  expect(html).not.toMatch(/datetime="2026-01-26"/i)
})
it('renders deterministic defaults from today and clamps the displayed month to valid bounds', () => {
  const html = renderToString(
    <MonthGrid today="2026-09-21" month="invalid" min="2026-10-12" max="2026-10-28" />,
  )
  expect(html).toContain('2026年10月')
  expect(html).toMatch(/data-date="2026-10-11"[^>]*data-disabled/)
  expect(html).not.toMatch(/data-date="2026-10-12"[^>]*data-disabled/)
})

it('renders customized geometry, date content and state classes without a client or header spacer', () => {
  const html = renderToString(
    <MonthGrid
      month="2026-09"
      today="2026-09-21"
      showHeader={false}
      dayMinHeight="7rem"
      dayPadding={0}
      cellClass={day => (day.isToday ? 'bg-accent-soft' : undefined)}
      dayClass="gap-0"
      renderDate={({ dayLabel }) => <b>{dayLabel}</b>}
      renderDayTrailing={day =>
        day.weekday === 1 && day.isToday ? <span>Team review</span> : null
      }
    />,
  )
  expect(html).not.toContain('data-hn-month-grid-header')
  expect(html).toContain('--hn-month-grid-cell:7rem;')
  expect(html).toMatch(/--hn-month-grid-padding:0px;?/)
  expect(html).toMatch(/data-date="2026-09-21"[^>]*bg-accent-soft/)
  expect(html).toContain('<b>21</b>')
  expect(html).toContain('Team review')
  expect(html).toContain('aria-current="date"')
})
