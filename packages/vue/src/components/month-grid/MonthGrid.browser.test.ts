import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, reactive } from 'vue'
import { renderToString } from 'vue/server-renderer'
import axe from 'axe-core'
import MonthGrid from './MonthGrid.vue'
import type { MonthGridProps, MonthGridDay } from './types'
import { provideUiLocale, enUS } from '../../locale'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})
function setup(initial: MonthGridProps = {}, slots: Record<string, unknown> = {}, english = false) {
  const props = reactive({ month: '2026-09', today: '2026-09-21', ...initial })
  const changed = vi.fn()
  const w = mount(
    defineComponent({
      setup() {
        if (english) provideUiLocale(enUS)
        return () =>
          h(
            MonthGrid,
            {
              ...props,
              'onUpdate:month': (value: string | undefined) => {
                props.month = value ?? ''
              },
              onRangeChange: changed,
              style: 'width:672px',
            },
            slots,
          )
      },
    }),
    { attachTo: document.body, global: { stubs: { transition: false } } },
  )
  wrappers.push(w)
  return {
    w,
    props,
    changed,
    grid: w.getComponent(MonthGrid),
    prev: () => w.get('button[aria-label="上个月"]'),
    next: () => w.get('button[aria-label="下个月"]'),
  }
}

it('uses a display table without selected dates or automatic day controls', async () => {
  const s = setup()
  expect(s.w.findAll('td')).toHaveLength(42)
  expect(s.w.findAll('td button')).toHaveLength(0)
  expect(s.w.findAll('[aria-selected]')).toHaveLength(0)
  expect(s.w.find('time[aria-current="date"]').attributes('datetime')).toBe('2026-09-21')
  await s.w.get('td[data-date="2026-09-18"]').trigger('click')
  expect(s.props.month).toBe('2026-09')
  expect(
    (
      await axe.run(s.w.element, {
        rules: { region: { enabled: false }, 'color-contrast': { enabled: false } },
      })
    ).violations,
  ).toEqual([])
})

it('navigates controlled months and reports the complete visible range', async () => {
  const s = setup()
  expect(s.changed).toHaveBeenCalledWith({
    month: '2026-09',
    start: '2026-08-31',
    end: '2026-10-11',
  })
  const height = (s.grid.element as HTMLElement).offsetHeight
  await userEvent.click(s.next().element)
  expect(s.props.month).toBe('2026-10')
  expect(s.changed).toHaveBeenLastCalledWith({
    month: '2026-10',
    start: '2026-09-28',
    end: '2026-11-08',
  })
  expect((s.grid.element as HTMLElement).offsetHeight).toBe(height)
  await userEvent.click(s.w.get('button[aria-label="回到本月"]').element)
  expect(s.props.month).toBe('2026-09')
  s.props.month = '2024-02'
  await nextTick()
  expect(s.w.find('td[data-date="2024-02-29"]').exists()).toBe(true)
})

it('enforces month navigation limits and provides disabled metadata for caller-owned actions', async () => {
  const s = setup(
    { min: '2026-09-10', max: '2026-10-20' },
    {
      default: (day: MonthGridDay) => h('button', { disabled: day.isDisabled }, day.date),
    },
  )
  expect(s.prev().attributes('disabled')).toBeDefined()
  expect(s.w.get('td[data-date="2026-09-09"] button').attributes('disabled')).toBeDefined()
  expect(s.w.get('td[data-date="2026-09-10"] button').attributes('disabled')).toBeUndefined()
  await userEvent.click(s.next().element)
  expect(s.next().attributes('disabled')).toBeDefined()
  s.props.disabled = true
  await nextTick()
  expect(s.w.findAll('button').every(b => b.attributes('disabled') !== undefined)).toBe(true)
})

it('leaves nested action semantics and keyboard navigation to slots', async () => {
  const click = vi.fn()
  const s = setup(
    {},
    {
      default: (day: MonthGridDay) =>
        day.date === '2026-09-21' ? h('button', { onClick: click }, 'Review') : null,
    },
  )
  const button = s.w.get('td button').element as HTMLButtonElement
  button.focus()
  await userEvent.keyboard('{Enter}')
  expect(click).toHaveBeenCalledOnce()
  expect(s.props.month).toBe('2026-09')
  expect(s.w.findAll('[aria-selected]')).toHaveLength(0)
})

it('reuses month and year pickers, closes after choosing, and restores heading focus', async () => {
  const s = setup()
  const heading = s.w.get('button[aria-label^="选择月份:"]').element
  await userEvent.click(heading)
  await vi.waitFor(() =>
    expect(document.querySelector('[data-reka-month-picker-cell-trigger]')).not.toBeNull(),
  )
  const year = document.querySelector('button[aria-label="选择年份"]')!
  await userEvent.click(year)
  await vi.waitFor(() =>
    expect(
      document.querySelector('[data-reka-year-picker-cell-trigger][data-value="2027-01-01"]'),
    ).not.toBeNull(),
  )
  await userEvent.click(
    document.querySelector('[data-reka-year-picker-cell-trigger][data-value="2027-01-01"]')!,
  )
  await vi.waitFor(() =>
    expect(
      document.querySelector('[data-reka-month-picker-cell-trigger][data-value="2027-03-01"]'),
    ).not.toBeNull(),
  )
  await userEvent.click(
    document.querySelector('[data-reka-month-picker-cell-trigger][data-value="2027-03-01"]')!,
  )
  await vi.waitFor(() => expect(s.props.month).toBe('2027-03'))
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(document.activeElement).toBe(heading)
})

it('supports compact weeks, hidden outside days and replacing the complete day cell', async () => {
  const s = setup(
    { month: '2026-02', weekStartsOn: 0, fixedWeeks: false, showOutsideDays: false },
    { day: (day: MonthGridDay) => h('span', `Day ${day.day}`) },
  )
  expect(s.w.findAll('td')).toHaveLength(28)
  expect(s.w.findAll('time')).toHaveLength(0)
  s.props.weekStartsOn = 1
  await nextTick()
  expect(s.w.findAll('td')).toHaveLength(35)
  expect(s.w.get('td[data-date="2026-01-26"]').text()).toBe('')
  expect(s.w.get('td[data-date="2026-02-01"]').text()).toBe('Day 1')
})

it('localizes weekday headings and fits narrow RTL containers without growing columns', async () => {
  const s = setup(
    {},
    { default: () => h('span', 'AnUnbrokenLongEventTitleThatShouldNeverResizeItsCalendarColumn') },
    true,
  )
  expect(s.w.findAll('th')[0]!.text()).toBe('Sun')
  s.grid.element.setAttribute('dir', 'rtl')
  s.grid.element.setAttribute('style', 'width:280px')
  await nextTick()
  expect(s.w.get('table').element.getBoundingClientRect().width).toBeLessThanOrEqual(280)
  const cells = s.w
    .findAll('td')
    .slice(0, 7)
    .map(c => c.element.getBoundingClientRect())
  expect(cells[0]!.x).toBeGreaterThan(cells[1]!.x)
  expect(cells.every(c => Math.abs(c.width - cells[0]!.width) < 1)).toBe(true)
})

it('hydrates the same date cells and slot controls without changing the first layout', async () => {
  const app = defineComponent({
    render: () =>
      h(
        MonthGrid,
        { month: '2026-09', today: '2026-09-21' },
        {
          default: (day: MonthGridDay) =>
            day.date === '2026-09-21' ? h('button', 'Review') : null,
        },
      ),
  })
  const host = document.createElement('div')
  host.style.width = '672px'
  host.innerHTML = await renderToString(createSSRApp(app))
  document.body.append(host)
  const cells = [...host.querySelectorAll('td')]
  const button = host.querySelector('td button')
  const height = host.offsetHeight
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const client = createSSRApp(app)
  try {
    client.mount(host)
    await nextTick()
    expect([...host.querySelectorAll('td')]).toEqual(cells)
    expect(host.querySelector('td button')).toBe(button)
    expect(host.offsetHeight).toBe(height)
    expect(warn.mock.calls.filter(args => String(args[0]).includes('Hydration'))).toEqual([])
  } finally {
    client.unmount()
  }
})

it('keeps the portalled month picker in RTL and supports keyboard back navigation', async () => {
  const s = setup({ dir: 'rtl' }, {}, true)
  const heading = s.w.get('button[aria-haspopup="dialog"]').element
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
    expect(document.activeElement?.hasAttribute('data-reka-year-picker-cell-trigger')).toBe(true),
  )
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() =>
    expect(document.activeElement?.hasAttribute('data-reka-month-picker-cell-trigger')).toBe(true),
  )
  expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(document.activeElement).toBe(heading)
  expect(s.props.month).toBe('2026-09')
})

it('composes date content, adjacent status and header actions without replacing navigation or semantics', async () => {
  const s = setup(
    {},
    {
      date: (day: MonthGridDay) => h('span', `Day ${day.dayLabel}`),
      'day-trailing': (day: MonthGridDay) => (day.isToday ? h('span', 'Team review') : null),
      'header-actions': () => h('button', 'Filter events'),
    },
  )
  const date = s.w.get('time[datetime="2026-09-21"]')
  expect(date.text()).toBe('Day 21')
  expect(date.attributes('aria-current')).toBe('date')
  expect(date.attributes('aria-label')).toContain('2026')
  expect(s.w.get('td[data-date="2026-09-21"]').text()).toContain('Team review')
  await userEvent.click(s.next().element)
  expect(s.props.month).toBe('2026-10')
  expect(s.w.get('[data-hn-month-grid-header]').text()).toContain('Filter events')
  await userEvent.click(s.w.get('button[aria-haspopup="dialog"]').element)
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
  s.props.showHeader = false
  await nextTick()
  expect(s.w.find('[data-hn-month-grid-header]').exists()).toBe(false)
  await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
  expect(s.w.find('caption').text()).toContain('2026年10月')
})

it('applies caller classes to the intended surfaces and keeps geometry independent of control size', async () => {
  const s = setup({
    size: 'sm',
    dayMinHeight: 120,
    dayPadding: 0,
    cellClass: day => (day.isToday ? 'bg-accent-soft py-3' : undefined),
    dayClass: day => (day.isToday ? 'gap-0 items-center' : undefined),
  })
  const cell = s.w.get('td[data-date="2026-09-21"]').element
  const content = cell.querySelector('[data-hn-month-grid-day]')!
  const navHeight = s.next().element.getBoundingClientRect().height
  const cellStyle = getComputedStyle(cell)
  expect(parseFloat(cellStyle.paddingTop)).toBeGreaterThan(0)
  expect(cellStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(getComputedStyle(content).gap).toBe('0px')
  for (const width of [672, 280]) {
    ;(s.grid.element as HTMLElement).style.width = `${width}px`
    expect(getComputedStyle(content).paddingTop).toBe('0px')
    expect(content.getBoundingClientRect().height).toBe(120)
  }
  s.props.dayMinHeight = '9rem'
  s.props.dayPadding = '0.75rem'
  await nextTick()
  expect(content.getBoundingClientRect().height).toBe(144)
  expect(getComputedStyle(content).paddingTop).toBe('12px')
  expect(s.next().element.getBoundingClientRect().height).toBe(navHeight)
  s.props.dayClass = 'p-0 gap-0'
  await nextTick()
  expect(getComputedStyle(content).paddingTop).toBe('0px')
})

it('lets full-day actions fill the content area and receive the complete date context', async () => {
  const click = vi.fn()
  const metadata = new Map<string, MonthGridDay>()
  const s = setup(
    { showHeader: false, dayPadding: 0, dayMinHeight: 104 },
    {
      day: (day: MonthGridDay) => {
        metadata.set(day.date, day)
        return h(
          'button',
          { class: 'flex-1 w-full', disabled: day.isPast, onClick: click, 'aria-label': day.label },
          day.dayLabel,
        )
      },
    },
  )
  const content = s.w.get('td[data-date="2026-09-21"] [data-hn-month-grid-day]').element
  const button = content.querySelector('button')!
  expect(button.getBoundingClientRect().height).toBe(content.getBoundingClientRect().height)
  expect(button.getBoundingClientRect().width).toBe(content.getBoundingClientRect().width)
  expect(s.w.find('button button').exists()).toBe(false)
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
