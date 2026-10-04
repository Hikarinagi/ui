import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { vi } from 'vitest'
import VCalendar from '@hina-ui/vue/components/calendar/Calendar.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { Calendar, type CalendarProps } from '@hina-ui/react/components/calendar/Calendar'
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

type Props = Omit<CalendarProps, 'ref'>

function vueProps(props: Props) {
  const { value, className, ...rest } = props
  return {
    ...(rest as Record<string, unknown>),
    ...(value !== undefined ? { modelValue: value } : {}),
    ...(className ? { class: className } : {}),
  }
}

function both(name: string, props: Props, english = false) {
  return {
    name,
    vue: frozen((): VNode =>
      english
        ? h(English, null, () => h(VCalendar, vueProps(props)))
        : h(VCalendar, vueProps(props)),
    ),
    react: frozen((): ReactElement =>
      english ? (
        <UiLocaleProvider messages={enUS}>
          <Calendar {...props} />
        </UiLocaleProvider>
      ) : (
        <Calendar {...props} />
      ),
    ),
  }
}

const weekend = (date: string) => [0, 6].includes(new Date(`${date}T00:00`).getDay())

export default defineCases('Calendar', [
  both('empty shows the current month with today marked', {}),
  both('placeholder month', { placeholder: '2026-09-01' }),
  both('selected value', { value: '2026-09-04' }),
  both('null value with placeholder', { value: null, placeholder: '2026-03-15' }),
  both('min and max disable outside days and paging', {
    value: '2026-09-10',
    min: '2026-09-07',
    max: '2026-09-25',
  }),
  both('min before the view keeps paging enabled', {
    value: '2026-09-10',
    min: '2026-07-01',
    max: '2026-12-31',
  }),
  both('unavailable weekends', { value: '2026-09-04', unavailable: weekend }),
  both('selected unavailable day is invalid', { value: '2026-09-05', unavailable: weekend }),
  both('week starts on sunday with short weekdays', {
    value: '2026-09-04',
    weekStartsOn: 0,
    weekdayFormat: 'short',
  }),
  both('compact weeks', { value: '2026-02-10', fixedWeeks: false }),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { size, value: '2026-09-04' })),
  both('readonly', { value: '2026-09-04', readonly: true }),
  both('disabled', { value: '2026-09-04', disabled: true }),
  both('class and attributes', { value: '2026-09-04', className: 'border', id: 'cal' }),
  both('english locale', { value: '2026-09-04' }, true),
  both('english locale with sunday start', { value: '2026-09-04', weekStartsOn: 0 }, true),
  both('today outside the shown month', { value: '2024-02-29' }),
])
