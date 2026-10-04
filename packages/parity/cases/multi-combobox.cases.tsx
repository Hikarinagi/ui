import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
  { value: 3, label: 'Nitroplus', disabled: true },
  { label: '海外', options: [{ value: 4, label: 'Sekai Project' }] },
]
const many = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))

export default defineCases('MultiCombobox', [
  {
    name: 'placeholder from the locale',
    vue: () => h(V.MultiCombobox, { options, 'aria-label': '制作公司' }),
    react: () => <R.MultiCombobox options={options} aria-label="制作公司" />,
  },
  {
    name: 'custom placeholder',
    vue: () => h(V.MultiCombobox, { options, placeholder: '添加公司' }),
    react: () => <R.MultiCombobox options={options} placeholder="添加公司" />,
  },
  {
    name: 'selected chips hide the placeholder',
    vue: () => h(V.MultiCombobox, { options, modelValue: [1, 4], class: 'w-72' }),
    react: () => <R.MultiCombobox options={options} value={[1, 4]} className="w-72" />,
  },
  {
    name: 'unknown values show the value itself',
    vue: () => h(V.MultiCombobox, { options, modelValue: [1, 42] }),
    react: () => <R.MultiCombobox options={options} value={[1, 42]} />,
  },
  {
    name: 'selected option data',
    vue: () =>
      h(V.MultiCombobox, {
        options: [],
        modelValue: [0, '0'],
        selectedOptions: [
          { value: 0, label: 'Number' },
          { value: '0', label: 'String' },
        ],
      }),
    react: () => (
      <R.MultiCombobox
        options={[]}
        value={[0, '0']}
        selectedOptions={[
          { value: 0, label: 'Number' },
          { value: '0', label: 'String' },
        ]}
      />
    ),
  },
  {
    name: 'search text',
    vue: () => h(V.MultiCombobox, { options, modelValue: [1], search: 'ni' }),
    react: () => <R.MultiCombobox options={options} value={[1]} search="ni" />,
  },
  ...(['primary', 'secondary'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.MultiCombobox, { options, variant }),
    react: () => <R.MultiCombobox options={options} variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.MultiCombobox, { options, size, modelValue: [1, 2] }),
    react: () => <R.MultiCombobox options={options} size={size} value={[1, 2]} />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.MultiCombobox, { options, invalid: true }),
    react: () => <R.MultiCombobox options={options} invalid />,
  },
  {
    name: 'disabled with chips and clear',
    vue: () => h(V.MultiCombobox, { options, disabled: true, clearable: true, modelValue: [1, 2] }),
    react: () => <R.MultiCombobox options={options} disabled clearable value={[1, 2]} />,
  },
  {
    name: 'clearable with chips',
    vue: () => h(V.MultiCombobox, { options, clearable: true, modelValue: [1] }),
    react: () => <R.MultiCombobox options={options} clearable value={[1]} />,
  },
  {
    name: 'loading',
    vue: () => h(V.MultiCombobox, { options, loading: true, ignoreFilter: true }),
    react: () => <R.MultiCombobox options={options} loading ignoreFilter />,
  },
  {
    name: 'native form values',
    vue: () => h(V.MultiCombobox, { options, name: 'studios', modelValue: [1, 4] }),
    react: () => <R.MultiCombobox options={options} name="studios" value={[1, 4]} />,
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: '公司', description: '可多选' }, () =>
        h(V.MultiCombobox, { options, modelValue: [2] }),
      ),
    react: () => (
      <R.FormField label="公司" description="可多选">
        <R.MultiCombobox options={options} value={[2]} />
      </R.FormField>
    ),
  },
  ...[false, true].map(open => ({
    name: `virtualized distant selections ${open ? 'open' : 'closed'} on the server`,
    vue: () =>
      h(V.MultiCombobox, {
        options: many,
        virtualize: true,
        name: 'items',
        modelValue: [7890, 9999],
        open,
      }),
    react: () => (
      <R.MultiCombobox options={many} virtualize name="items" value={[7890, 9999]} open={open} />
    ),
  })),
])
