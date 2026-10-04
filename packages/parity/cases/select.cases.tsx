import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
  { label: '周边', options: [{ value: 'cd', label: '音乐 CD' }] },
]
const many = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))
const nativeValue = {
  ignoreAttributes: ['value'],
  reason:
    "Vue's server renderer serializes the hidden native select's `value` DOM property as a content attribute that <select> does not define; React DOM never emits it and both adapters assign the property on the client",
}

export default defineCases('Select', [
  {
    name: 'placeholder from the locale',
    vue: () => h(V.Select, { options, 'aria-label': '类型' }),
    react: () => <R.Select options={options} aria-label="类型" />,
  },
  {
    name: 'custom placeholder',
    vue: () => h(V.Select, { options, placeholder: '选择类型' }),
    react: () => <R.Select options={options} placeholder="选择类型" />,
  },
  {
    name: 'selected label',
    vue: () => h(V.Select, { options, modelValue: 'ln' }),
    react: () => <R.Select options={options} value="ln" />,
  },
  {
    name: 'grouped selected label',
    vue: () => h(V.Select, { options, modelValue: 'cd' }),
    react: () => <R.Select options={options} value="cd" />,
  },
  {
    name: 'value slot',
    vue: () =>
      h(
        V.Select,
        { options, modelValue: 'gal' },
        { value: ({ option }: { option: { label: string } }) => `已选：${option.label}` },
      ),
    react: () => (
      <R.Select
        options={options}
        value="gal"
        renderValue={({ option }) => `已选：${option.label}`}
      />
    ),
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.Select, { options, variant }),
    react: () => <R.Select options={options} variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Select, { options, size, modelValue: 'gal' }),
    react: () => <R.Select options={options} size={size} value="gal" />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.Select, { options, invalid: true }),
    react: () => <R.Select options={options} invalid />,
  },
  {
    name: 'disabled',
    vue: () => h(V.Select, { options, disabled: true, modelValue: 'gal' }),
    react: () => <R.Select options={options} disabled value="gal" />,
  },
  {
    name: 'clearable with a value',
    vue: () => h(V.Select, { options, clearable: true, modelValue: 'ln', 'aria-label': '类型' }),
    react: () => <R.Select options={options} clearable value="ln" aria-label="类型" />,
  },
  {
    name: 'clearable without a value',
    vue: () => h(V.Select, { options, clearable: true }),
    react: () => <R.Select options={options} clearable />,
  },
  {
    name: 'clearable but disabled',
    vue: () => h(V.Select, { options, clearable: true, disabled: true, modelValue: 'ln' }),
    react: () => <R.Select options={options} clearable disabled value="ln" />,
  },
  {
    name: 'native form value',
    vue: () =>
      h(V.Select, {
        options,
        name: 'kind',
        required: true,
        autocomplete: 'off',
        modelValue: 'ln',
      }),
    react: () => <R.Select options={options} name="kind" required autocomplete="off" value="ln" />,
    ...nativeValue,
  },
  {
    name: 'native form without a value',
    vue: () => h(V.Select, { options, name: 'kind' }),
    react: () => <R.Select options={options} name="kind" />,
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: '类型', error: '请选择', required: true }, () =>
        h(V.Select, { options }),
      ),
    react: () => (
      <R.FormField label="类型" error="请选择" required>
        <R.Select options={options} />
      </R.FormField>
    ),
  },
  {
    name: 'inside an input group',
    vue: () =>
      h(V.InputGroup, { size: 'lg' }, () => [
        h(V.InputGroupAddon, null, () => 'https://'),
        h(V.Select, { options, modelValue: 'gal', 'aria-label': '协议' }),
      ]),
    react: () => (
      <R.InputGroup size="lg">
        <R.InputGroupAddon>https://</R.InputGroupAddon>
        <R.Select options={options} value="gal" aria-label="协议" />
      </R.InputGroup>
    ),
  },
  ...[false, true].map(open => ({
    name: `virtualized distant selection ${open ? 'open' : 'closed'} on the server`,
    vue: () =>
      h(V.Select, { options: many, virtualize: true, modelValue: 7890, open, name: 'items' }),
    react: () => <R.Select options={many} virtualize value={7890} open={open} name="items" />,
    ...nativeValue,
  })),
])
