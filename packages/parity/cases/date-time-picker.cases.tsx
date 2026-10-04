import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import VPicker from '@hina-ui/vue/components/date-time-picker/DateTimePicker.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInputGroup from '@hina-ui/vue/components/input-group/InputGroup.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import {
  DateTimePicker,
  type DateTimePickerProps,
} from '@hina-ui/react/components/date-time-picker/DateTimePicker'
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

type Props = Omit<DateTimePickerProps, 'leading'>

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
      const field = <DateTimePicker {...props} {...extra} />
      return options.english ? <UiLocaleProvider messages={enUS}>{field}</UiLocaleProvider> : field
    }),
  }
}

export default defineCases('DateTimePicker', [
  both('empty', { 'aria-label': '发布时间' }),
  both('value', { value: '2026-09-04T20:30', 'aria-label': '发布时间' }),
  both('class and id', { value: '2026-09-04T20:30', className: 'w-80', id: 'starts' }),
  both('placeholder', { value: null, placeholder: '2026-09-01T09:00' }),
  both('second granularity', { value: '2026-09-04T20:30:15', granularity: 'second' }),
  both('12 hour cycle', { value: '2026-09-04T20:30', hourCycle: 12 }),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, { value: '2026-09-04T20:30', variant }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size =>
    both(`size ${size}`, { value: '2026-09-04T20:30', size }),
  ),
  both('disabled and invalid', { value: '2026-09-04T20:30', disabled: true, invalid: true }),
  both('out of range', { value: '2026-09-04T20:30', max: '2026-09-01T00:00' }),
  both('readonly', { value: '2026-09-04T20:30', readonly: true }),
  both('clearable', { value: '2026-09-04T20:30', clearable: true }),
  both('open renders the trigger expanded', { value: '2026-09-04T20:30', open: true }),
  both('leading slot', { value: '2026-09-04T20:30' }, { leading: '⏰' }),
  both('english', { value: '2026-09-04T20:30', clearable: true }, { english: true }),
  {
    name: 'inside a form field',
    vue: frozen(() =>
      h(VFormField, { label: '开始时间', required: true }, () => h(VPicker, { modelValue: null })),
    ),
    react: frozen(() => (
      <FormField label="开始时间" required>
        <DateTimePicker value={null} />
      </FormField>
    )),
  },
  {
    name: 'inside an input group',
    vue: frozen(() =>
      h(VInputGroup, { size: 'sm' }, () => h(VPicker, { modelValue: '2026-09-04T20:30' })),
    ),
    react: frozen(() => (
      <InputGroup size="sm">
        <DateTimePicker value="2026-09-04T20:30" />
      </InputGroup>
    )),
  },
])
