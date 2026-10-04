import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act, type ReactNode } from 'react'
import axe from 'axe-core'
import { MonthGrid } from './MonthGrid'
import type { MonthGridDay, MonthGridHeader, MonthGridProps } from './types'
import { UiLocaleProvider, enUS } from '../../locale'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  vi.restoreAllMocks()
})

type Props = Omit<
  MonthGridProps,
  | 'children'
  | 'renderDay'
  | 'renderDate'
  | 'renderDayTrailing'
  | 'renderHeader'
  | 'renderHeaderActions'
  | 'renderWeekday'
  | 'renderFooter'
  | 'ref'
>

interface Slots {
  default?: (day: MonthGridDay) => ReactNode
  day?: (day: MonthGridDay) => ReactNode
  date?: (day: MonthGridDay) => ReactNode
  'day-trailing'?: (day: MonthGridDay) => ReactNode
  'header-actions'?: (header: MonthGridHeader) => ReactNode
}

async function setup(initial: Props = {}, slots: Slots = {}, english = false) {
  const state = signal<Props>({ month: '2026-09', today: '2026-09-21', ...initial })
  const changed = vi.fn()
  function Harness() {
    const current = state.use()
    const grid = (
      <MonthGrid
        {...current}
        onMonthChange={value => {
          state.value = { ...state.value, month: value ?? '' }
        }}
        onRangeChange={changed}
        style={{ width: '672px', ...current.style }}
        renderDay={slots.day}
        renderDate={slots.date}
        renderDayTrailing={slots['day-trailing']}
        renderHeaderActions={slots['header-actions']}
      >
        {slots.default}
      </MonthGrid>
    )
    return english ? <UiLocaleProvider messages={enUS}>{grid}</UiLocaleProvider> : grid
  }
  const host = document.createElement('div')
  document.body.appendChild(host)
  await render(<Harness />, { container: host })
  const element = host.querySelector('[data-hn-month-grid]') as HTMLElement
  const props = new Proxy({} as Props, {
    get: (_, key) => state.value[key as keyof Props],
    set: (_, key, value) => {
      state.value = { ...state.value, [key]: value }
      return true
    },
  })
  return {
    host,
    props,
    changed,
    grid: { element },
    get: (selector: string) => host.querySelector(selector) as HTMLElement,
    all: (selector: string) => Array.from(host.querySelectorAll<HTMLElement>(selector)),
    prev: () => host.querySelector('button[aria-label="上个月"]') as HTMLElement,
    next: () => host.querySelector('button[aria-label="下个月"]') as HTMLElement,
  }
}

it('uses a display table without selected dates or automatic day controls', async () => {
  const s = await setup()
  expect(s.all('td')).toHaveLength(42)
  expect(s.all('td button')).toHaveLength(0)
  expect(s.all('[aria-selected]')).toHaveLength(0)
  expect(s.get('time[aria-current="date"]').getAttribute('datetime')).toBe('2026-09-21')
  s.get('td[data-date="2026-09-18"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await tick()
  expect(s.props.month).toBe('2026-09')
  expect(
    (
      await axe.run(s.host, {
        rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
      })
    ).violations,
  ).toEqual([])
})

it('navigates controlled months and reports the complete visible range', async () => {
  const s = await setup()
  expect(s.changed).toHaveBeenCalledWith({
    month: '2026-09',
    start: '2026-08-31',
    end: '2026-10-11',
  })
  const height = s.grid.element.offsetHeight
  await userEvent.click(s.next())
  expect(s.props.month).toBe('2026-10')
  expect(s.changed).toHaveBeenLastCalledWith({
    month: '2026-10',
    start: '2026-09-28',
    end: '2026-11-08',
  })
  expect(s.grid.element.offsetHeight).toBe(height)
  await userEvent.click(s.get('button[aria-label="回到本月"]'))
  expect(s.props.month).toBe('2026-09')
  s.props.month = '2024-02'
  await tick()
  expect(s.get('td[data-date="2024-02-29"]')).not.toBeNull()
})

it('enforces month navigation limits and provides disabled metadata for caller-owned actions', async () => {
  const s = await setup(
    { min: '2026-09-10', max: '2026-10-20' },
    {
      default: day => <button disabled={day.isDisabled}>{day.date}</button>,
    },
  )
  expect(s.prev().getAttribute('disabled')).not.toBeNull()
  expect(s.get('td[data-date="2026-09-09"] button').getAttribute('disabled')).not.toBeNull()
  expect(s.get('td[data-date="2026-09-10"] button').getAttribute('disabled')).toBeNull()
  await userEvent.click(s.next())
  expect(s.next().getAttribute('disabled')).not.toBeNull()
  s.props.disabled = true
  await tick()
  expect(s.all('button').every(b => b.getAttribute('disabled') !== null)).toBe(true)
})

it('leaves nested action semantics and keyboard navigation to slots', async () => {
  const click = vi.fn()
  const s = await setup(
    {},
    {
      default: day => (day.date === '2026-09-21' ? <button onClick={click}>Review</button> : null),
    },
  )
  const button = s.get('td button') as HTMLButtonElement
  button.focus()
  await userEvent.keyboard('{Enter}')
  expect(click).toHaveBeenCalledOnce()
  expect(s.props.month).toBe('2026-09')
  expect(s.all('[aria-selected]')).toHaveLength(0)
})

it('reuses month and year pickers, closes after choosing, and restores heading focus', async () => {
  const s = await setup()
  const heading = s.get('button[aria-label^="选择月份:"]')
  await userEvent.click(heading)
  await vi.waitFor(() =>
    expect(document.querySelector('[data-radix-month-picker-cell-trigger]')).not.toBeNull(),
  )
  const year = document.querySelector('button[aria-label="选择年份"]')!
  await userEvent.click(year)
  await vi.waitFor(() =>
    expect(
      document.querySelector('[data-radix-year-picker-cell-trigger][data-value="2027-01-01"]'),
    ).not.toBeNull(),
  )
  await userEvent.click(
    document.querySelector('[data-radix-year-picker-cell-trigger][data-value="2027-01-01"]')!,
  )
  await vi.waitFor(() =>
    expect(
      document.querySelector('[data-radix-month-picker-cell-trigger][data-value="2027-03-01"]'),
    ).not.toBeNull(),
  )
  await userEvent.click(
    document.querySelector('[data-radix-month-picker-cell-trigger][data-value="2027-03-01"]')!,
  )
  await vi.waitFor(() => expect(s.props.month).toBe('2027-03'))
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(document.activeElement).toBe(heading)
})

it('supports compact weeks, hidden outside days and replacing the complete day cell', async () => {
  const s = await setup(
    { month: '2026-02', weekStartsOn: 0, fixedWeeks: false, showOutsideDays: false },
    { day: day => <span>Day {day.day}</span> },
  )
  expect(s.all('td')).toHaveLength(28)
  expect(s.all('time')).toHaveLength(0)
  s.props.weekStartsOn = 1
  await tick()
  expect(s.all('td')).toHaveLength(35)
  expect(s.get('td[data-date="2026-01-26"]').textContent).toBe('')
  expect(s.get('td[data-date="2026-02-01"]').textContent).toBe('Day 1')
})

it('localizes weekday headings and fits narrow RTL containers without growing columns', async () => {
  const s = await setup(
    {},
    { default: () => <span>AnUnbrokenLongEventTitleThatShouldNeverResizeItsCalendarColumn</span> },
    true,
  )
  expect(s.all('th')[0]!.textContent).toBe('Sun')
  s.grid.element.setAttribute('dir', 'rtl')
  s.grid.element.setAttribute('style', 'width:280px')
  await tick()
  expect(s.get('table').getBoundingClientRect().width).toBeLessThanOrEqual(280)
  const cells = s
    .all('td')
    .slice(0, 7)
    .map(c => c.getBoundingClientRect())
  expect(cells[0]!.x).toBeGreaterThan(cells[1]!.x)
  expect(cells.every(c => Math.abs(c.width - cells[0]!.width) < 1)).toBe(true)
})

it('hydrates the same date cells and slot controls without changing the first layout', async () => {
  const app = (
    <MonthGrid month="2026-09" today="2026-09-21">
      {day => (day.date === '2026-09-21' ? <button>Review</button> : null)}
    </MonthGrid>
  )
  const host = document.createElement('div')
  host.style.width = '672px'
  host.innerHTML = renderToString(app)
  document.body.append(host)
  const cells = [...host.querySelectorAll('td')]
  const button = host.querySelector('td button')
  const height = host.offsetHeight
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  const active = Reflect.get(globalThis, 'IS_REACT_ACT_ENVIRONMENT')
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  let client!: ReturnType<typeof hydrateRoot>
  try {
    await act(async () => {
      client = hydrateRoot(host, app, { onRecoverableError: cause => console.warn(cause) })
    })
    expect([...host.querySelectorAll('td')]).toEqual(cells)
    expect(host.querySelector('td button')).toBe(button)
    expect(host.offsetHeight).toBe(height)
    expect(
      [...warn.mock.calls, ...error.mock.calls].filter(args => /hydrat/i.test(String(args[0]))),
    ).toEqual([])
  } finally {
    await act(async () => client.unmount())
    Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', active)
  }
})

it('keeps the portalled month picker in RTL and supports keyboard back navigation', async () => {
  const s = await setup({ dir: 'rtl' }, {}, true)
  const heading = s.get('button[aria-haspopup="dialog"]')
  await userEvent.click(heading)
  await vi.waitFor(() =>
    expect(document.activeElement?.getAttribute('data-value')).toBe('2026-09-01'),
  )
  expect(document.activeElement?.closest('[dir]')?.getAttribute('dir')).toBe('rtl')
  await userEvent.keyboard('{ArrowRight}')
  await vi.waitFor(() =>
    expect(document.activeElement?.getAttribute('data-value')).toBe('2026-08-01'),
  )
  const dialog = document.querySelector('[role="dialog"]')!
  expect(
    (
      await axe.run(dialog, {
        rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
      })
    ).violations,
  ).toEqual([])
  await userEvent.click(document.querySelector('button[aria-label="Choose a year"]')!)
  await vi.waitFor(() =>
    expect(document.activeElement?.hasAttribute('data-radix-year-picker-cell-trigger')).toBe(true),
  )
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() =>
    expect(document.activeElement?.hasAttribute('data-radix-month-picker-cell-trigger')).toBe(true),
  )
  expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(document.activeElement).toBe(heading)
  expect(s.props.month).toBe('2026-09')
})

it('composes date content, adjacent status and header actions without replacing navigation or semantics', async () => {
  const s = await setup(
    {},
    {
      date: day => <span>Day {day.dayLabel}</span>,
      'day-trailing': day => (day.isToday ? <span>Team review</span> : null),
      'header-actions': () => <button>Filter events</button>,
    },
  )
  const date = s.get('time[datetime="2026-09-21"]')
  expect(date.textContent).toBe('Day 21')
  expect(date.getAttribute('aria-current')).toBe('date')
  expect(date.getAttribute('aria-label')).toContain('2026')
  expect(s.get('td[data-date="2026-09-21"]').textContent).toContain('Team review')
  await userEvent.click(s.next())
  expect(s.props.month).toBe('2026-10')
  expect(s.get('[data-hn-month-grid-header]').textContent).toContain('Filter events')
  await userEvent.click(s.get('button[aria-haspopup="dialog"]'))
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
  s.props.showHeader = false
  await tick()
  expect(s.get('[data-hn-month-grid-header]')).toBeNull()
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(s.get('caption').textContent).toContain('2026年10月')
})

it('applies caller classes to the intended surfaces and keeps geometry independent of control size', async () => {
  const s = await setup({
    size: 'sm',
    dayMinHeight: 120,
    dayPadding: 0,
    cellClass: day => (day.isToday ? 'bg-accent-soft py-3' : undefined),
    dayClass: day => (day.isToday ? 'gap-0 items-center' : undefined),
  })
  const cell = s.get('td[data-date="2026-09-21"]')
  const content = cell.querySelector('[data-hn-month-grid-day]')!
  const navHeight = s.next().getBoundingClientRect().height
  const cellStyle = getComputedStyle(cell)
  expect(parseFloat(cellStyle.paddingTop)).toBeGreaterThan(0)
  expect(cellStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(getComputedStyle(content).gap).toBe('0px')
  for (const width of [672, 280]) {
    s.grid.element.style.width = `${width}px`
    expect(getComputedStyle(content).paddingTop).toBe('0px')
    expect(content.getBoundingClientRect().height).toBe(120)
  }
  s.props.dayMinHeight = '9rem'
  s.props.dayPadding = '0.75rem'
  await tick()
  expect(content.getBoundingClientRect().height).toBe(144)
  expect(getComputedStyle(content).paddingTop).toBe('12px')
  expect(s.next().getBoundingClientRect().height).toBe(navHeight)
  s.props.dayClass = 'p-0 gap-0'
  await tick()
  expect(getComputedStyle(content).paddingTop).toBe('0px')
})

it('lets full-day actions fill the content area and receive the complete date context', async () => {
  const click = vi.fn()
  const metadata = new Map<string, MonthGridDay>()
  const s = await setup(
    { showHeader: false, dayPadding: 0, dayMinHeight: 104 },
    {
      day: day => {
        metadata.set(day.date, day)
        return (
          <button
            className="flex-1 w-full"
            disabled={day.isPast}
            onClick={click}
            aria-label={day.label}
          >
            {day.dayLabel}
          </button>
        )
      },
    },
  )
  const content = s.get('td[data-date="2026-09-21"] [data-hn-month-grid-day]')
  const button = content.querySelector('button')!
  expect(button.getBoundingClientRect().height).toBe(content.getBoundingClientRect().height)
  expect(button.getBoundingClientRect().width).toBe(content.getBoundingClientRect().width)
  expect(s.get('button button')).toBeNull()
  expect(metadata.get('2026-09-21')).toMatchObject({
    day: 21,
    dayLabel: '21',
    weekday: 1,
    isToday: true,
    isPast: false,
    isFuture: false,
  })
  expect(metadata.get('2026-09-20')).toMatchObject({ weekday: 0, isPast: true })
  expect(metadata.get('2026-09-22')).toMatchObject({ weekday: 2, isFuture: true })
  button.focus()
  await userEvent.keyboard('{Enter}')
  expect(click).toHaveBeenCalledOnce()
})
