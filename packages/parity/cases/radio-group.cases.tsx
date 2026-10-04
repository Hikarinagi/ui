import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看', description: '正在追' },
  { value: 'done', label: '看过', disabled: true },
]

export default defineCases('RadioGroup', [
  {
    name: 'default',
    vue: () => h(V.RadioGroup, { options, class: 'w-64', 'aria-label': '状态' }),
    react: () => <R.RadioGroup options={options} className="w-64" aria-label="状态" />,
  },
  {
    name: 'selected value',
    vue: () => h(V.RadioGroup, { options, modelValue: 'doing' }),
    react: () => <R.RadioGroup options={options} value="doing" />,
  },
  {
    name: 'numeric values',
    vue: () =>
      h(V.RadioGroup, {
        options: [
          { value: 1, label: '一' },
          { value: 2, label: '二' },
        ],
        modelValue: 2,
      }),
    react: () => (
      <R.RadioGroup
        options={[
          { value: 1, label: '一' },
          { value: 2, label: '二' },
        ]}
        value={2}
      />
    ),
  },
  {
    name: 'horizontal block with control at the end',
    vue: () =>
      h(V.RadioGroup, { options, orientation: 'horizontal', block: true, controlPlacement: 'end' }),
    react: () => (
      <R.RadioGroup options={options} orientation="horizontal" block controlPlacement="end" />
    ),
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.RadioGroup, { options, size, modelValue: 'wish' }),
    react: () => <R.RadioGroup options={options} size={size} value="wish" />,
  })),
  {
    name: 'disabled',
    vue: () => h(V.RadioGroup, { options, disabled: true, modelValue: 'wish' }),
    react: () => <R.RadioGroup options={options} disabled value="wish" />,
  },
  {
    name: 'invalid',
    vue: () => h(V.RadioGroup, { options, invalid: true }),
    react: () => <R.RadioGroup options={options} invalid />,
  },
  {
    name: 'option slot',
    vue: () =>
      h(
        V.RadioGroup,
        { options },
        { option: ({ option }: { option: { label: string } }) => `[${option.label}]` },
      ),
    react: () => (
      <R.RadioGroup options={options} renderOption={({ option }) => `[${option.label}]`} />
    ),
  },
  {
    name: 'name renders the hidden input',
    vue: () => h(V.RadioGroup, { options, name: 'status', modelValue: 'wish', required: true }),
    react: () => <R.RadioGroup options={options} name="status" value="wish" required />,
  },
  {
    name: 'orientation and dir attributes',
    vue: () => h(V.RadioGroup, { options, orientation: 'horizontal', dir: 'rtl', loop: false }),
    react: () => <R.RadioGroup options={options} orientation="horizontal" dir="rtl" loop={false} />,
  },
  {
    name: 'inside a field',
    vue: () =>
      h(V.FormField, { label: '可见范围', error: '请选择', required: true }, () =>
        h(V.RadioGroup, { options }),
      ),
    react: () => (
      <R.FormField label="可见范围" error="请选择" required>
        <R.RadioGroup options={options} />
      </R.FormField>
    ),
  },
])
