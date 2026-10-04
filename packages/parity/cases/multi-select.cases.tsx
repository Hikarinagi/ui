import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画', disabled: true },
  { label: '周边', options: [{ value: 'anime', label: '动画' }] },
]
const many = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))

export default defineCases('MultiSelect', [
  {
    name: 'placeholder',
    vue: () => h(V.MultiSelect, { options, 'aria-label': '类型' }),
    react: () => <R.MultiSelect options={options} aria-label="类型" />,
  },
  {
    name: 'custom placeholder',
    vue: () => h(V.MultiSelect, { options, placeholder: '选择标签' }),
    react: () => <R.MultiSelect options={options} placeholder="选择标签" />,
  },
  {
    name: 'chips with overflow',
    vue: () => h(V.MultiSelect, { options, modelValue: ['gal', 'ln', 'anime'] }),
    react: () => <R.MultiSelect options={options} value={['gal', 'ln', 'anime']} />,
  },
  {
    name: 'max visible and clearable',
    vue: () =>
      h(V.MultiSelect, {
        options,
        modelValue: ['gal', 'ln', 'anime'],
        maxVisible: 3,
        clearable: true,
      }),
    react: () => (
      <R.MultiSelect options={options} value={['gal', 'ln', 'anime']} maxVisible={3} clearable />
    ),
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.MultiSelect, { options, size, modelValue: ['gal', 'ln'] }),
    react: () => <R.MultiSelect options={options} size={size} value={['gal', 'ln']} />,
  })),
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.MultiSelect, { options, variant }),
    react: () => <R.MultiSelect options={options} variant={variant} />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.MultiSelect, { options, invalid: true }),
    react: () => <R.MultiSelect options={options} invalid />,
  },
  {
    name: 'disabled with chips and clear',
    vue: () =>
      h(V.MultiSelect, { options, disabled: true, clearable: true, modelValue: ['gal', 'ln'] }),
    react: () => <R.MultiSelect options={options} disabled clearable value={['gal', 'ln']} />,
  },
  {
    name: 'native form values',
    vue: () =>
      h(V.MultiSelect, {
        options,
        name: 'kind',
        required: true,
        autocomplete: 'off',
        modelValue: ['gal', 'anime'],
      }),
    react: () => (
      <R.MultiSelect
        options={options}
        name="kind"
        required
        autocomplete="off"
        value={['gal', 'anime']}
      />
    ),
  },
  {
    name: 'inside an input group',
    vue: () =>
      h(V.InputGroup, { size: 'sm' }, () => [
        h(V.InputGroupAddon, null, () => '标签'),
        h(V.MultiSelect, { options, modelValue: ['gal'], 'aria-label': '标签' }),
      ]),
    react: () => (
      <R.InputGroup size="sm">
        <R.InputGroupAddon>标签</R.InputGroupAddon>
        <R.MultiSelect options={options} value={['gal']} aria-label="标签" />
      </R.InputGroup>
    ),
  },
  ...[false, true].map(open => ({
    name: `virtualized distant selections ${open ? 'open' : 'closed'} on the server`,
    vue: () =>
      h(V.MultiSelect, {
        options: many,
        virtualize: true,
        name: 'items',
        modelValue: [7890, 9999],
        open,
      }),
    react: () => (
      <R.MultiSelect options={many} virtualize name="items" value={[7890, 9999]} open={open} />
    ),
  })),
])
