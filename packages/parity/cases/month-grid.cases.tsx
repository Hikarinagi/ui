import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { vi } from 'vitest'
import VMonthGrid from '@hina-ui/vue/components/month-grid/MonthGrid.vue'
import type { MonthGridDay as VueMonthGridDay } from '@hina-ui/vue/components/month-grid/types'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { MonthGrid } from '@hina-ui/react/components/month-grid/MonthGrid'
import type { MonthGridDay, MonthGridProps } from '@hina-ui/react/components/month-grid/types'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases } from '../src/cases'

const TODAY = new Date(2026, 8, 18, 12, 0, 0)

function frozen<T>(render: () => T) {
  return () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(TODAY)
    queueMicrotask(() => vi.useRealTimers())
    return render()
  }
}

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

type Props = Omit<
  MonthGridProps,
  | 'ref'
  | 'children'
  | 'renderDay'
  | 'renderDate'
  | 'renderDayTrailing'
  | 'renderHeader'
  | 'renderHeaderActions'
  | 'renderWeekday'
  | 'renderFooter'
>

function vueProps(props: Props) {
  const { className, ...rest } = props
  return { ...(rest as Record<string, unknown>), ...(className ? { class: className } : {}) }
}

function both(name: string, props: Props, english = false) {
  return {
    name,
    vue: frozen((): VNode =>
      english
        ? h(English, null, () => h(VMonthGrid, vueProps(props)))
        : h(VMonthGrid, vueProps(props)),
    ),
    react: frozen((): ReactElement =>
      english ? (
        <UiLocaleProvider messages={enUS}>
          <MonthGrid {...props} />
        </UiLocaleProvider>
      ) : (
        <MonthGrid {...props} />
      ),
    ),
  }
}

const base = { month: '2026-09', today: '2026-09-21' }

export default defineCases('MonthGrid', [
  both('defaults from the frozen clock', {}),
  both('month with today', base),
  both('label', { ...base, label: 'Schedule' }),
  both('compact weeks with hidden outside days', {
    month: '2026-02',
    today: '2026-02-10',
    fixedWeeks: false,
    showOutsideDays: false,
    weekStartsOn: 1,
  }),
  both('invalid month clamps to bounds', {
    today: '2026-09-21',
    month: 'invalid',
    min: '2026-10-12',
    max: '2026-10-28',
  }),
  both('min and max disable navigation', { ...base, min: '2026-09-10', max: '2026-10-20' }),
  both('reversed bounds are ignored', { ...base, min: '2026-10-20', max: '2026-09-10' }),
  both('disabled', { ...base, disabled: true }),
  both('without header', { ...base, showHeader: false }),
  both('without today button', { ...base, showToday: false }),
  both('sunday start with narrow weekdays', { ...base, weekStartsOn: 0, weekdayFormat: 'narrow' }),
  both('long weekdays', { ...base, weekdayFormat: 'long' }),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { ...base, size })),
  both('geometry numbers', { ...base, dayMinHeight: 120, dayPadding: 0 }),
  both('geometry strings', { ...base, dayMinHeight: '7rem', dayPadding: '0.75rem' }),
  both('static cell and day classes', { ...base, cellClass: 'bg-subtle', dayClass: 'gap-0' }),
  both('function cell and day classes', {
    ...base,
    cellClass: (day: MonthGridDay) => (day.isToday ? 'bg-accent-soft py-3' : undefined),
    dayClass: (day: MonthGridDay) => (day.isToday ? 'gap-0 items-center' : undefined),
  }),
  both('rtl direction', { ...base, dir: 'rtl' }),
  both('class and attributes', {
    ...base,
    className: 'w-96',
    id: 'grid',
    style: { width: '672px' },
  }),
  both('english locale', base, true),
  {
    name: 'default slot and trailing content',
    vue: () =>
      h(VMonthGrid, base, {
        default: ({ date }: VueMonthGridDay) =>
          date === '2026-09-21' ? h('a', { href: '/meeting' }, 'Design review') : null,
        'day-trailing': (day: VueMonthGridDay) => (day.isToday ? h('span', 'Team review') : null),
      }),
    react: () => (
      <MonthGrid
        {...base}
        renderDayTrailing={day => (day.isToday ? <span>Team review</span> : null)}
      >
        {({ date }) => (date === '2026-09-21' ? <a href="/meeting">Design review</a> : null)}
      </MonthGrid>
    ),
  },
  {
    name: 'date, weekday, header actions and footer slots',
    vue: () =>
      h(VMonthGrid, base, {
        date: ({ dayLabel }: VueMonthGridDay) => h('b', dayLabel),
        weekday: ({ label }: { label: string }) => h('i', label),
        'header-actions': () => h('button', 'Filter events'),
        footer: ({ start, end }: { start: string; end: string }) => h('span', `${start} – ${end}`),
      }),
    react: () => (
      <MonthGrid
        {...base}
        renderDate={({ dayLabel }) => <b>{dayLabel}</b>}
        renderWeekday={({ label }) => <i>{label}</i>}
        renderHeaderActions={() => <button>Filter events</button>}
        renderFooter={({ start, end }) => <span>{`${start} – ${end}`}</span>}
      />
    ),
  },
  {
    name: 'custom header slot',
    vue: () =>
      h(VMonthGrid, base, {
        header: ({ label, canPrev }: { label: string; canPrev: boolean }) =>
          h('strong', `${label} ${canPrev}`),
      }),
    react: () => (
      <MonthGrid
        {...base}
        renderHeader={({ label, canPrev }) => <strong>{`${label} ${canPrev}`}</strong>}
      />
    ),
  },
  {
    name: 'replacing the complete day cell',
    vue: () =>
      h(
        VMonthGrid,
        { ...base, showOutsideDays: false, fixedWeeks: false },
        { day: (day: VueMonthGridDay) => h('span', `Day ${day.day}`) },
      ),
    react: () => (
      <MonthGrid
        {...base}
        showOutsideDays={false}
        fixedWeeks={false}
        renderDay={day => <span>{`Day ${day.day}`}</span>}
      />
    ),
  },
])
