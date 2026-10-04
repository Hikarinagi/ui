import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import VNumberFormat from '@hina-ui/vue/components/number-format/NumberFormat.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import {
  NumberFormat,
  type NumberFormatProps,
} from '@hina-ui/react/components/number-format/NumberFormat'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases } from '../src/cases'

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

function both(name: string, props: Omit<NumberFormatProps, 'ref'>) {
  const { className, ...rest } = props
  return {
    name,
    vue: (): VNode => h(VNumberFormat, { ...(rest as Record<string, unknown>), class: className }),
    react: (): ReactElement => <NumberFormat {...props} />,
  }
}

export default defineCases('NumberFormat', [
  both('decimal default', { value: 1234567.891 }),
  both('compact carries the full number in title', { value: 12000, format: 'compact' }),
  both('percent', { value: 0.42, format: 'percent' }),
  both('currency', { value: 1234.5, format: 'currency', currency: 'CNY' }),
  both('currency without a code falls back to decimal', { value: 1234.5, format: 'currency' }),
  both('precision 2', { value: 3.14159, precision: 2 }),
  both('precision 0 with percent', { value: 0.964, format: 'percent', precision: 0 }),
  both('null', { value: null }),
  both('undefined', {}),
  both('NaN', { value: Number.NaN }),
  both('Infinity with compact has no title', {
    value: Number.POSITIVE_INFINITY,
    format: 'compact',
  }),
  both('class and attributes', { value: 42, className: 'tabular-nums', id: 'n' }),
  both('caller title overrides the full number', {
    value: 12000,
    format: 'compact',
    title: 'twelve thousand',
  }),
  {
    name: 'compact follows the provided locale',
    vue: () => h(English, null, () => h(VNumberFormat, { value: 1234567, format: 'compact' })),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <NumberFormat value={1234567} format="compact" />
      </UiLocaleProvider>
    ),
  },
])
