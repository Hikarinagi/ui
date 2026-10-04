import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import VTimeField from '@hina-ui/vue/components/time-field/TimeField.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInputGroup from '@hina-ui/vue/components/input-group/InputGroup.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { TimeField, type TimeFieldProps } from '@hina-ui/react/components/time-field/TimeField'
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

type Props = Omit<TimeFieldProps, 'ref' | 'leading' | 'trailing'>

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
      const field = h(VTimeField, vueProps(props), slots)
      return options.english ? h(English, null, () => field) : field
    }),
    react: frozen((): ReactElement => {
      const field = <TimeField {...props} {...extra} />
      return options.english ? <UiLocaleProvider messages={enUS}>{field}</UiLocaleProvider> : field
    }),
  }
}

export default defineCases('TimeField', [
  both('empty', { 'aria-label': '开播时间' }),
  both('null model', { value: null, 'aria-label': '开播时间' }),
  both('value', { value: '09:30', 'aria-label': '时间' }),
  both('empty with placeholder', { value: null, placeholder: '09:00' }),
  both('class and id', { value: '09:30', className: 'w-40', id: 'starts' }),
  both('second granularity', { value: '09:30:15', granularity: 'second' }),
  both('hour granularity', { value: '09:00', granularity: 'hour' }),
  both('12 hour cycle', { value: '20:30', hourCycle: 12 }),
  both('12 hour cycle morning', { value: '00:15', hourCycle: 12 }),
  both('24 hour cycle', { value: '08:05', hourCycle: 24 }),
  both('empty 12 hour cycle', { value: null, hourCycle: 12 }),
  both('minute step', { value: '09:30', minuteStep: 15 }),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, { value: '09:30', variant }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { value: '09:30', size })),
  both('above max is invalid', { value: '23:00', max: '18:00' }),
  both('below min is invalid', { value: '07:00', min: '09:00' }),
  both('inside range', { value: '12:00', min: '09:00', max: '18:00' }),
  both('invalid and disabled', { value: '12:00', invalid: true, disabled: true }),
  both('readonly', { value: '09:30', readonly: true }),
  both('clearable with value', { value: '09:30', clearable: true }),
  both('clearable without value', { value: null, clearable: true }),
  both('name', { value: '09:30', name: 'startsAt' }),
  both('leading slot', { value: '09:30' }, { leading: '⏰' }),
  both('trailing slot', { value: '09:30', clearable: true }, { trailing: 'UTC' }),
  both('english', { value: '20:30', clearable: true }, { english: true }),
  both('english empty', { value: null }, { english: true }),
  {
    name: 'inside a form field',
    vue: frozen(() =>
      h(VFormField, { label: '开始时间', required: true }, () =>
        h(VTimeField, { modelValue: null }),
      ),
    ),
    react: frozen(() => (
      <FormField label="开始时间" required>
        <TimeField value={null} />
      </FormField>
    )),
  },
  {
    name: 'inside an input group',
    vue: frozen(() => h(VInputGroup, { size: 'lg' }, () => h(VTimeField, { modelValue: '09:30' }))),
    react: frozen(() => (
      <InputGroup size="lg">
        <TimeField value="09:30" />
      </InputGroup>
    )),
  },
])
