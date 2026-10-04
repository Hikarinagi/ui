import { h } from 'vue'
import { Search } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Search as LucideSearch } from '@hina-ui/react/../node_modules/lucide-react'
import { lucide } from '@hina-ui/react/lib/icon'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const SearchIcon = lucide(LucideSearch)

const options = [
  { value: 'status', label: 'status:', description: 'HTTP 状态' },
  { value: 'off', label: 'disabled', disabled: true },
]

export default defineCases('Autocomplete', [
  {
    name: 'free text',
    vue: () => h(V.Autocomplete, { options, modelValue: 'entry:http sta', 'aria-label': 'Query' }),
    react: () => <R.Autocomplete options={options} value="entry:http sta" aria-label="Query" />,
  },
  {
    name: 'placeholder',
    vue: () => h(V.Autocomplete, { options, placeholder: '输入查询' }),
    react: () => <R.Autocomplete options={options} placeholder="输入查询" />,
  },
  {
    name: 'open on the server keeps the list closed',
    vue: () => h(V.Autocomplete, { options, open: true, modelValue: 'x' }),
    react: () => <R.Autocomplete options={options} open value="x" />,
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.Autocomplete, { options, variant }),
    react: () => <R.Autocomplete options={options} variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Autocomplete, { options, size }),
    react: () => <R.Autocomplete options={options} size={size} />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.Autocomplete, { options, invalid: true }),
    react: () => <R.Autocomplete options={options} invalid />,
  },
  {
    name: 'disabled',
    vue: () => h(V.Autocomplete, { options, disabled: true, modelValue: 'saved' }),
    react: () => <R.Autocomplete options={options} disabled value="saved" />,
  },
  {
    name: 'readonly',
    vue: () => h(V.Autocomplete, { options, readonly: true, modelValue: 'saved' }),
    react: () => <R.Autocomplete options={options} readonly value="saved" />,
  },
  {
    name: 'loading',
    vue: () => h(V.Autocomplete, { options, loading: true }),
    react: () => <R.Autocomplete options={options} loading />,
  },
  {
    name: 'leading and trailing slots',
    vue: () =>
      h(
        V.Autocomplete,
        { options, class: 'w-80' },
        { leading: () => h(Search), trailing: () => h('kbd', '/') },
      ),
    react: () => (
      <R.Autocomplete
        options={options}
        className="w-80"
        leading={<SearchIcon />}
        trailing={<kbd>/</kbd>}
      />
    ),
  },
  {
    name: 'inside an input group',
    vue: () =>
      h(V.InputGroup, { size: 'lg' }, () => [
        h(V.InputGroupAddon, null, () => 'filter'),
        h(V.Autocomplete, { options, 'aria-label': 'Query' }),
      ]),
    react: () => (
      <R.InputGroup size="lg">
        <R.InputGroupAddon>filter</R.InputGroupAddon>
        <R.Autocomplete options={options} aria-label="Query" />
      </R.InputGroup>
    ),
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: 'Query', description: 'Filter requests' }, () =>
        h(V.Autocomplete, { options }),
      ),
    react: () => (
      <R.FormField label="Query" description="Filter requests">
        <R.Autocomplete options={options} />
      </R.FormField>
    ),
  },
])
