import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import VDateField from '@hina-ui/vue/components/date-field/DateField.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInputGroup from '@hina-ui/vue/components/input-group/InputGroup.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { DateField, type DateFieldProps } from '@hina-ui/react/components/date-field/DateField'
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

type Props = Omit<DateFieldProps, 'ref' | 'leading' | 'trailing'>

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
      const field = h(VDateField, vueProps(props), slots)
      return options.english ? h(English, null, () => field) : field
    }),
    react: frozen((): ReactElement => {
      const field = <DateField {...props} {...extra} />
      return options.english ? <UiLocaleProvider messages={enUS}>{field}</UiLocaleProvider> : field
    }),
  }
}

export default defineCases('DateField', [
  both('empty uses today as the segment reference', { 'aria-label': '发布日期' }),
  both('null model', { value: null, 'aria-label': '发布日期' }),
  both('value', { value: '2026-09-04', 'aria-label': '日期' }),
  both('empty with placeholder', { value: null, placeholder: '2026-09-04', 'aria-label': '日期' }),
  both('class and id', { value: '2026-09-04', className: 'w-72', id: 'publish' }),
  both('minute granularity', { value: '2026-09-04T10:30', granularity: 'minute' }),
  both('hour granularity', { value: '2026-09-04T10:00', granularity: 'hour' }),
  both('second granularity', { value: '2026-09-04T10:30:15', granularity: 'second' }),
  both('empty minute granularity', { value: null, granularity: 'minute' }),
  both('12 hour cycle', { value: '2026-09-04T20:30', granularity: 'minute', hourCycle: 12 }),
  both('24 hour cycle', { value: '2026-09-04T08:05', granularity: 'minute', hourCycle: 24 }),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, { value: '2026-09-04', variant }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { value: '2026-09-04', size })),
  both('out of range is invalid', { value: '2026-09-04', max: '2026-09-01' }),
  both('below min is invalid', { value: '2026-09-04', min: '2026-09-10' }),
  both('inside range', { value: '2026-09-04', min: '2026-09-01', max: '2026-09-30' }),
  both('invalid and disabled', { value: '2026-09-04', invalid: true, disabled: true }),
  both('readonly', { value: '2026-09-04', readonly: true }),
  both('clearable with value', { value: '2026-09-04', clearable: true }),
  both('clearable without value', { value: null, clearable: true }),
  both('clearable and disabled', { value: '2026-09-04', clearable: true, disabled: true }),
  both('name', { value: '2026-09-04', name: 'publishedAt' }),
  both('leading slot', { value: '2026-09-04' }, { leading: '📅' }),
  both('trailing slot', { value: '2026-09-04', clearable: true }, { trailing: 'UTC' }),
  both('english', { value: '2026-09-04', clearable: true }, { english: true }),
  both('english empty', { value: null }, { english: true }),
  both('english minute', { value: '2026-09-04T20:30', granularity: 'minute' }, { english: true }),
  {
    name: 'inside a form field',
    vue: frozen(() =>
      h(VFormField, { label: '出生日期', required: true }, () =>
        h(VDateField, { modelValue: null }),
      ),
    ),
    react: frozen(() => (
      <FormField label="出生日期" required>
        <DateField value={null} />
      </FormField>
    )),
  },
  {
    name: 'inside an invalid form field',
    vue: frozen(() =>
      h(VFormField, { label: '出生日期', error: '请输入出生日期' }, () =>
        h(VDateField, { modelValue: '2026-09-04' }),
      ),
    ),
    react: frozen(() => (
      <FormField label="出生日期" error="请输入出生日期">
        <DateField value="2026-09-04" />
      </FormField>
    )),
  },
  {
    name: 'inside an input group',
    vue: frozen(() =>
      h(VInputGroup, { size: 'sm' }, () => h(VDateField, { modelValue: '2026-09-04' })),
    ),
    react: frozen(() => (
      <InputGroup size="sm">
        <DateField value="2026-09-04" />
      </InputGroup>
    )),
  },
  {
    name: 'right to left direction',
    vue: frozen(() =>
      h(VDateField, { dir: 'rtl', modelValue: '2026-09-04', 'aria-label': '日期' }),
    ),
    react: frozen(() => <DateField dir="rtl" value="2026-09-04" aria-label="日期" />),
  },
])
