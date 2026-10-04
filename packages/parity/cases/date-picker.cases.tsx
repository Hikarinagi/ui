import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import VPicker from '@hina-ui/vue/components/date-picker/DatePicker.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import VInputGroup from '@hina-ui/vue/components/input-group/InputGroup.vue'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { DatePicker, type DatePickerProps } from '@hina-ui/react/components/date-picker/DatePicker'
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

type Props = Omit<DatePickerProps, 'leading'>

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
      const field = <DatePicker {...props} {...extra} />
      return options.english ? <UiLocaleProvider messages={enUS}>{field}</UiLocaleProvider> : field
    }),
  }
}

export default defineCases('DatePicker', [
  both('empty', { 'aria-label': '发布日期' }),
  both('value', { value: '2026-09-04', 'aria-label': '发布日期' }),
  both('class and id', { value: '2026-09-04', className: 'w-72', id: 'publish' }),
  both('placeholder', { value: null, placeholder: '2026-09-01' }),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, { value: '2026-09-04', variant }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { value: '2026-09-04', size })),
  both('disabled and invalid', { value: '2026-09-04', disabled: true, invalid: true }),
  both('out of range', { value: '2026-09-04', min: '2026-09-10', max: '2026-09-20' }),
  both('readonly', { value: '2026-09-04', readonly: true }),
  both('clearable', { value: '2026-09-04', clearable: true }),
  both('name', { value: '2026-09-04', name: 'publishedAt' }),
  both('open renders the trigger expanded', { value: '2026-09-04', open: true }),
  both('leading slot', { value: '2026-09-04' }, { leading: '📅' }),
  both('english', { value: '2026-09-04', clearable: true }, { english: true }),
  {
    name: 'inside a form field',
    vue: frozen(() =>
      h(VFormField, { label: '发布日期', required: true }, () => h(VPicker, { modelValue: null })),
    ),
    react: frozen(() => (
      <FormField label="发布日期" required>
        <DatePicker value={null} />
      </FormField>
    )),
  },
  {
    name: 'inside an input group',
    vue: frozen(() =>
      h(VInputGroup, { size: 'sm' }, () => h(VPicker, { modelValue: '2026-09-04' })),
    ),
    react: frozen(() => (
      <InputGroup size="sm">
        <DatePicker value="2026-09-04" />
      </InputGroup>
    )),
  },
])
