import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
]

export default defineCases('CheckboxGroup', [
  {
    name: 'default',
    vue: () => h(V.CheckboxGroup, { options, class: 'w-64', 'aria-label': '类型' }),
    react: () => <R.CheckboxGroup options={options} className="w-64" aria-label="类型" />,
  },
  {
    name: 'selected values',
    vue: () => h(V.CheckboxGroup, { options, modelValue: ['ln'] }),
    react: () => <R.CheckboxGroup options={options} value={['ln']} />,
  },
  {
    name: 'horizontal',
    vue: () => h(V.CheckboxGroup, { options, orientation: 'horizontal' }),
    react: () => <R.CheckboxGroup options={options} orientation="horizontal" />,
  },
  {
    name: 'horizontal block with control at the end',
    vue: () =>
      h(V.CheckboxGroup, {
        options,
        orientation: 'horizontal',
        block: true,
        controlPlacement: 'end',
      }),
    react: () => (
      <R.CheckboxGroup options={options} orientation="horizontal" block controlPlacement="end" />
    ),
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.CheckboxGroup, { options, size, modelValue: ['gal'] }),
    react: () => <R.CheckboxGroup options={options} size={size} value={['gal']} />,
  })),
  {
    name: 'disabled',
    vue: () => h(V.CheckboxGroup, { options, disabled: true, modelValue: ['gal'] }),
    react: () => <R.CheckboxGroup options={options} disabled value={['gal']} />,
  },
  {
    name: 'invalid',
    vue: () => h(V.CheckboxGroup, { options, invalid: true }),
    react: () => <R.CheckboxGroup options={options} invalid />,
  },
  {
    name: 'option slot',
    vue: () =>
      h(
        V.CheckboxGroup,
        { options },
        { option: ({ option }: { option: { label: string } }) => `[${option.label}]` },
      ),
    react: () => (
      <R.CheckboxGroup options={options} renderOption={({ option }) => `[${option.label}]`} />
    ),
  },
  {
    name: 'name renders one hidden input per value',
    vue: () => h(V.CheckboxGroup, { options, name: 'kinds', modelValue: ['gal', 'ln'] }),
    react: () => <R.CheckboxGroup options={options} name="kinds" value={['gal', 'ln']} />,
  },
  {
    name: 'inside a field the group is labelled and options keep their own ids',
    vue: () =>
      h(V.FormField, { label: '兴趣', description: '选一到两项', error: '至少一项' }, () =>
        h(V.CheckboxGroup, { options }),
      ),
    react: () => (
      <R.FormField label="兴趣" description="选一到两项" error="至少一项">
        <R.CheckboxGroup options={options} />
      </R.FormField>
    ),
  },
])
