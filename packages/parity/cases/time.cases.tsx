import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import VTime from '@hina-ui/vue/components/time/Time.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { Time, type TimeProps } from '@hina-ui/react/components/time/Time'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases } from '../src/cases'

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

const value = '2026-03-14T09:30:00+08:00'

function both(name: string, props: Omit<TimeProps, 'ref'>) {
  const { className, ...rest } = props
  return {
    name,
    vue: (): VNode => h(VTime, { ...(rest as Record<string, unknown>), class: className }),
    react: (): ReactElement => <Time {...props} />,
  }
}

function provided(name: string, props: Omit<TimeProps, 'ref'>) {
  const entry = both(name, props)
  return {
    name,
    vue: (): VNode => h(VTooltipProvider, null, () => entry.vue()),
    react: (): ReactElement => <TooltipProvider>{entry.react()}</TooltipProvider>,
  }
}

export default defineCases('Time', [
  both('datetime default', { value }),
  both('date', { value, format: 'date' }),
  both('time', { value, format: 'time' }),
  both('Date instance', { value: new Date(value) }),
  both('epoch milliseconds', { value: Date.parse(value), format: 'date' }),
  both('relative minutes', { value: Date.now() - 3 * 60_000, format: 'relative' }),
  provided('relative inside a tooltip provider', { value, format: 'relative' }),
  provided('relative with the tooltip off inside a provider', {
    value,
    format: 'relative',
    tooltip: false,
  }),
  provided('absolute format inside a tooltip provider', { value, format: 'date' }),
  both('relative just now', { value: Date.now() - 10_000, format: 'relative' }),
  both('relative future days', { value: Date.now() + 2 * 86_400_000 + 60_000, format: 'relative' }),
  both('null falls back to a span', { value: null }),
  both('empty string falls back to a span', { value: '' }),
  both('unparsable value falls back to a span', { value: '昨天下午' }),
  both('class and attributes on time', { value, className: 'text-muted', id: 't' }),
  both('class and attributes on the fallback span', {
    value: null,
    className: 'text-muted',
    id: 't',
  }),
  {
    name: 'caller title and datetime override',
    vue: () => h(VTime, { value, format: 'relative', title: 'custom', datetime: '2026' }),
    react: () => <Time value={value} format="relative" title="custom" dateTime="2026" />,
  },
  {
    name: 'locale tag drives Intl',
    vue: () => h(English, null, () => h(VTime, { value, format: 'date' })),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <Time value={value} format="date" />
      </UiLocaleProvider>
    ),
  },
  {
    name: 'unknown text follows the locale',
    vue: () => h(English, null, () => h(VTime, { value: null })),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <Time value={null} />
      </UiLocaleProvider>
    ),
  },
])
