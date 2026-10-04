import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { vi } from 'vitest'
import VRangeCalendar from '@hina-ui/vue/components/range-calendar/RangeCalendar.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import {
  RangeCalendar,
  type RangeCalendarProps,
} from '@hina-ui/react/components/range-calendar/RangeCalendar'
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

type Props = Omit<RangeCalendarProps, 'ref'>

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
        ? h(English, null, () => h(VRangeCalendar, vueProps(props)))
        : h(VRangeCalendar, vueProps(props)),
    ),
    react: frozen((): ReactElement =>
      english ? (
        <UiLocaleProvider messages={enUS}>
          <RangeCalendar {...props} />
        </UiLocaleProvider>
      ) : (
        <RangeCalendar {...props} />
      ),
    ),
  }
}

const weekend = (date: string) => [0, 6].includes(new Date(`${date}T00:00`).getDay())

const range = { start: '2026-09-04', end: '2026-09-10' }

export default defineCases('RangeCalendar', [
  both('empty shows the current month with today marked', {}),
  both('placeholder month', { placeholder: '2026-09-01' }),
  both('selected range', { value: range }),
  both('start only', { value: { start: '2026-09-08', end: null } }),
  both('range across months', { value: { start: '2026-09-25', end: '2026-10-05' } }),
  both('reversed range is invalid', { value: { start: '2026-09-20', end: '2026-09-02' } }),
  both('min and max', { placeholder: '2026-09-01', min: '2026-09-07', max: '2026-09-25' }),
  both('unavailable weekends inside the range', { value: range, unavailable: weekend }),
  both('maximum days after picking a start', {
    value: { start: '2026-09-08', end: null },
    maximumDays: 7,
  }),
  both('maximum days with a complete range', { value: range, maximumDays: 7 }),
  both('week starts on sunday with short weekdays', {
    value: range,
    weekStartsOn: 0,
    weekdayFormat: 'short',
  }),
  both('compact weeks', { value: { start: '2026-02-10', end: '2026-02-12' }, fixedWeeks: false }),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { size, value: range })),
  both('readonly', { value: range, readonly: true }),
  both('disabled', { value: range, disabled: true }),
  both('class and attributes', { value: range, className: 'border', id: 'range' }),
  both('english locale', { value: range }, true),
])
