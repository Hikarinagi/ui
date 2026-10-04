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

export default defineCases('Listbox', [
  {
    name: 'groups, descriptions and disabled options',
    vue: () => h(V.Listbox, { options, 'aria-label': '类型' }),
    react: () => <R.Listbox options={options} aria-label="类型" />,
  },
  {
    name: 'single selection',
    vue: () => h(V.Listbox, { options, modelValue: 'ln' }),
    react: () => <R.Listbox options={options} value="ln" />,
  },
  {
    name: 'multiple selection',
    vue: () => h(V.Listbox, { options, multiple: true, modelValue: ['gal', 'cd'] }),
    react: () => <R.Listbox options={options} multiple value={['gal', 'cd']} />,
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.Listbox, { options, variant, modelValue: 'gal' }),
    react: () => <R.Listbox options={options} variant={variant} value="gal" />,
  })),
  {
    name: 'disabled',
    vue: () => h(V.Listbox, { options, disabled: true, modelValue: 'gal' }),
    react: () => <R.Listbox options={options} disabled value="gal" />,
  },
  {
    name: 'empty',
    vue: () => h(V.Listbox, { options: [] }),
    react: () => <R.Listbox options={[]} />,
  },
  {
    name: 'max height and unpadded',
    vue: () => h(V.Listbox, { options, maxHeight: '8rem', padded: false }),
    react: () => <R.Listbox options={options} maxHeight="8rem" padded={false} />,
  },
  {
    name: 'custom option and trailing content',
    vue: () =>
      h(
        V.Listbox,
        { options, modelValue: 'gal' },
        {
          option: ({ option, selected }: { option: { label: string }; selected: boolean }) =>
            h('b', { 'data-selected': String(selected) }, option.label),
          trailing: ({ selected }: { selected: boolean }) =>
            h('i', { 'data-tail': '' }, selected ? 'yes' : 'no'),
        },
      ),
    react: () => (
      <R.Listbox
        options={options}
        value="gal"
        renderOption={({ option, selected }) => (
          <b data-selected={String(selected)}>{option.label}</b>
        )}
        renderTrailing={({ selected }) => <i data-tail="">{selected ? 'yes' : 'no'}</i>}
      />
    ),
  },
  {
    name: 'virtualized with a distant selection',
    vue: () => h(V.Listbox, { options: many, virtualize: true, modelValue: 7890 }),
    react: () => <R.Listbox options={many} virtualize value={7890} />,
  },
  {
    name: 'virtualized groups',
    vue: () =>
      h(V.Listbox, {
        options: [
          { label: 'A', options: many.slice(0, 5) },
          { label: 'B', options: many.slice(5, 10) },
        ],
        virtualize: { estimateSize: 32, overscan: 2 },
        'aria-label': 'Items',
      }),
    react: () => (
      <R.Listbox
        options={[
          { label: 'A', options: many.slice(0, 5) },
          { label: 'B', options: many.slice(5, 10) },
        ]}
        virtualize={{ estimateSize: 32, overscan: 2 }}
        aria-label="Items"
      />
    ),
  },
])
