import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import VDateRangeField from '@hina-ui/vue/components/date-range-field/DateRangeField.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInputGroup from '@hina-ui/vue/components/input-group/InputGroup.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import {
  DateRangeField,
  type DateRangeFieldProps,
} from '@hina-ui/react/components/date-range-field/DateRangeField'
import { FormField } from '@hina-ui/react/components/form-field/FormField'
import { InputGroup } from '@hina-ui/react/components/input-group/InputGroup'
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

type Props = Omit<DateRangeFieldProps, 'ref' | 'leading' | 'trailing'>

function vueProps(props: Props) {
  const { value, className, ...rest } = props
  return {
    ...(rest as Record<string, unknown>),
    ...(value !== undefined ? { modelValue: value } : {}),
    ...(className ? { class: className } : {}),
  }
}

function both(
  name: string,
  props: Props,
  options: { english?: boolean; leading?: string; trailing?: string } = {},
) {
  const slots: Record<string, () => VNode> = {}
  if (options.leading) slots.leading = () => h('span', options.leading)
  if (options.trailing) slots.trailing = () => h('span', options.trailing)
  const extra: { leading?: ReactNode; trailing?: ReactNode } = {}
  if (options.leading) extra.leading = <span>{options.leading}</span>
  if (options.trailing) extra.trailing = <span>{options.trailing}</span>
  return {
    name,
    vue: frozen((): VNode => {
      const field = h(VDateRangeField, vueProps(props), slots)
      return options.english ? h(English, null, () => field) : field
    }),
    react: frozen((): ReactElement => {
      const field = <DateRangeField {...props} {...extra} />
      return options.english ? <UiLocaleProvider messages={enUS}>{field}</UiLocaleProvider> : field
    }),
  }
}

const range = { start: '2026-09-01', end: '2026-09-30' }

export default defineCases('DateRangeField', [
  both('empty', { 'aria-label': '活动期间' }),
  both('null model', { value: null, 'aria-label': '活动期间' }),
  both('value', { value: range, 'aria-label': '期间' }),
  both('start only', { value: { start: '2026-09-01', end: null } }),
  both('end only', { value: { start: null, end: '2026-09-30' } }),
  both('empty with placeholder', { value: null, placeholder: '2026-09-04' }),
  both('class and id', { value: range, className: 'w-96', id: 'period' }),
  both('minute granularity', {
    value: { start: '2026-09-01T09:00', end: '2026-09-01T18:30' },
    granularity: 'minute',
  }),
  both('empty minute granularity', { value: null, granularity: 'minute' }),
  both('12 hour cycle', {
    value: { start: '2026-09-01T09:00', end: '2026-09-01T18:30' },
    granularity: 'minute',
    hourCycle: 12,
  }),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, { value: range, variant }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { value: range, size })),
  both('reversed is invalid', { value: { start: '2026-09-30', end: '2026-09-01' } }),
  both('above max is invalid', {
    value: { start: '2026-09-01', end: '2026-10-02' },
    max: '2026-09-30',
  }),
  both('inside range', { value: range, min: '2026-09-01', max: '2026-09-30' }),
  both('invalid and disabled', { value: null, invalid: true, disabled: true }),
  both('readonly', { value: range, readonly: true }),
  both('clearable with value', { value: range, clearable: true }),
  both('clearable without value', { value: null, clearable: true }),
  both('name', { value: range, name: 'period' }),
  both('leading slot', { value: range }, { leading: '📅' }),
  both('trailing slot', { value: range, clearable: true }, { trailing: 'UTC' }),
  both('english', { value: range, clearable: true }, { english: true }),
  both('english empty', { value: null }, { english: true }),
  {
    name: 'inside a form field',
    vue: frozen(() =>
      h(VFormField, { label: '活动期间', required: true }, () =>
        h(VDateRangeField, { modelValue: null }),
      ),
    ),
    react: frozen(() => (
      <FormField label="活动期间" required>
        <DateRangeField value={null} />
      </FormField>
    )),
  },
  {
    name: 'inside an input group',
    vue: frozen(() =>
      h(VInputGroup, { size: 'sm' }, () => h(VDateRangeField, { modelValue: range })),
    ),
    react: frozen(() => (
      <InputGroup size="sm">
        <DateRangeField value={range} />
      </InputGroup>
    )),
  },
])
