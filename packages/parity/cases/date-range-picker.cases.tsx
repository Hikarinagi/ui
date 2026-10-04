import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import VPicker from '@hina-ui/vue/components/date-range-picker/DateRangePicker.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInputGroup from '@hina-ui/vue/components/input-group/InputGroup.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import {
  DateRangePicker,
  type DateRangePickerProps,
} from '@hina-ui/react/components/date-range-picker/DateRangePicker'
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

type Props = Omit<DateRangePickerProps, 'leading'>

function vueProps(props: Props) {
  const { value, className, open, ...rest } = props
  return {
    ...(rest as Record<string, unknown>),
    ...(value !== undefined ? { modelValue: value } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(className ? { class: className } : {}),
  }
}

function both(name: string, props: Props, options: { english?: boolean; leading?: string } = {}) {
  const slots: Record<string, () => VNode> = {}
  if (options.leading) slots.leading = () => h('span', options.leading)
  const extra: { leading?: ReactNode } = {}
  if (options.leading) extra.leading = <span>{options.leading}</span>
  return {
    name,
    vue: frozen((): VNode => {
      const field = h(VPicker, vueProps(props), slots)
      return options.english ? h(English, null, () => field) : field
    }),
    react: frozen((): ReactElement => {
      const field = <DateRangePicker {...props} {...extra} />
      return options.english ? <UiLocaleProvider messages={enUS}>{field}</UiLocaleProvider> : field
    }),
  }
}

const range = { start: '2026-09-04', end: '2026-09-10' }

export default defineCases('DateRangePicker', [
  both('empty', { 'aria-label': '活动期间' }),
  both('value', { value: range, 'aria-label': '活动期间' }),
  both('start only', { value: { start: '2026-09-04', end: null } }),
  both('class and id', { value: range, className: 'w-96', id: 'period' }),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, { value: range, variant }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { value: range, size })),
  both('disabled and invalid', { value: range, disabled: true, invalid: true }),
  both('reversed', { value: { start: '2026-09-10', end: '2026-09-04' } }),
  both('readonly', { value: range, readonly: true }),
  both('clearable', { value: range, clearable: true }),
  both('maximum days', { value: range, maximumDays: 7 }),
  both('open renders the trigger expanded', { value: range, open: true }),
  both('leading slot', { value: range }, { leading: '📅' }),
  both('english', { value: range, clearable: true }, { english: true }),
  {
    name: 'inside a form field',
    vue: frozen(() =>
      h(VFormField, { label: '活动期间', required: true }, () => h(VPicker, { modelValue: null })),
    ),
    react: frozen(() => (
      <FormField label="活动期间" required>
        <DateRangePicker value={null} />
      </FormField>
    )),
  },
  {
    name: 'inside an input group',
    vue: frozen(() => h(VInputGroup, { size: 'lg' }, () => h(VPicker, { modelValue: range }))),
    react: frozen(() => (
      <InputGroup size="lg">
        <DateRangePicker value={range} />
      </InputGroup>
    )),
  },
])
