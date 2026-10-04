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

export default defineCases('Combobox', [
  {
    name: 'placeholder from the locale',
    vue: () => h(V.Combobox, { options, 'aria-label': '类型' }),
    react: () => <R.Combobox options={options} aria-label="类型" />,
  },
  {
    name: 'custom placeholder',
    vue: () => h(V.Combobox, { options, placeholder: '找作品' }),
    react: () => <R.Combobox options={options} placeholder="找作品" />,
  },
  {
    name: 'selected label in the input',
    vue: () => h(V.Combobox, { options, modelValue: 'ln' }),
    react: () => <R.Combobox options={options} value="ln" />,
  },
  {
    name: 'grouped selected label',
    vue: () => h(V.Combobox, { options, modelValue: 'cd' }),
    react: () => <R.Combobox options={options} value="cd" />,
  },
  {
    name: 'search text wins over the selected label',
    vue: () => h(V.Combobox, { options, modelValue: 'ln', search: '轻' }),
    react: () => <R.Combobox options={options} value="ln" search="轻" />,
  },
  {
    name: 'selected option data without matching options',
    vue: () =>
      h(V.Combobox, {
        options: [],
        selectedOption: { value: 0, label: 'Zero' },
        modelValue: 0,
      }),
    react: () => <R.Combobox options={[]} selectedOption={{ value: 0, label: 'Zero' }} value={0} />,
  },
  {
    name: 'unknown value renders an empty input',
    vue: () => h(V.Combobox, { options, modelValue: 'missing' }),
    react: () => <R.Combobox options={options} value="missing" />,
  },
  ...(['primary', 'secondary'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.Combobox, { options, variant }),
    react: () => <R.Combobox options={options} variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Combobox, { options, size, modelValue: 'gal' }),
    react: () => <R.Combobox options={options} size={size} value="gal" />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.Combobox, { options, invalid: true }),
    react: () => <R.Combobox options={options} invalid />,
  },
  {
    name: 'disabled',
    vue: () => h(V.Combobox, { options, disabled: true, modelValue: 'gal', clearable: true }),
    react: () => <R.Combobox options={options} disabled value="gal" clearable />,
  },
  {
    name: 'clearable with a value',
    vue: () => h(V.Combobox, { options, clearable: true, modelValue: 'ln', 'aria-label': '类型' }),
    react: () => <R.Combobox options={options} clearable value="ln" aria-label="类型" />,
  },
  {
    name: 'clearable without a value',
    vue: () => h(V.Combobox, { options, clearable: true }),
    react: () => <R.Combobox options={options} clearable />,
  },
  {
    name: 'loading',
    vue: () => h(V.Combobox, { options, loading: true, modelValue: 'gal' }),
    react: () => <R.Combobox options={options} loading value="gal" />,
  },
  {
    name: 'ignore filter',
    vue: () => h(V.Combobox, { options, ignoreFilter: true }),
    react: () => <R.Combobox options={options} ignoreFilter />,
  },
  {
    name: 'open on the server',
    vue: () => h(V.Combobox, { options, open: true, modelValue: 'gal' }),
    react: () => <R.Combobox options={options} open value="gal" />,
  },
  {
    name: 'forwarded input attributes',
    vue: () =>
      h(V.Combobox, {
        options,
        id: 'kind',
        name: 'kind',
        'aria-describedby': 'hint',
        'data-testid': 'combobox',
        class: 'w-72',
      }),
    react: () => (
      <R.Combobox
        options={options}
        id="kind"
        name="kind"
        aria-describedby="hint"
        data-testid="combobox"
        className="w-72"
      />
    ),
  },
  {
    name: 'inside an input group',
    vue: () =>
      h(V.InputGroup, { size: 'sm' }, () => [
        h(V.InputGroupAddon, null, () => '类型'),
        h(V.Combobox, { options, modelValue: 'gal', 'aria-label': '类型' }),
      ]),
    react: () => (
      <R.InputGroup size="sm">
        <R.InputGroupAddon>类型</R.InputGroupAddon>
        <R.Combobox options={options} value="gal" aria-label="类型" />
      </R.InputGroup>
    ),
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: '类型', description: '选一个', error: '必填' }, () =>
        h(V.Combobox, { options }),
      ),
    react: () => (
      <R.FormField label="类型" description="选一个" error="必填">
        <R.Combobox options={options} />
      </R.FormField>
    ),
  },
  ...[false, true].map(open => ({
    name: `virtualized selection ${open ? 'open' : 'closed'} on the server`,
    vue: () => h(V.Combobox, { options: many, virtualize: true, modelValue: 7890, open }),
    react: () => <R.Combobox options={many} virtualize value={7890} open={open} />,
  })),
])
