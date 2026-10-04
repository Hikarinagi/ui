import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('SearchInput', [
  {
    name: 'default',
    vue: () => h(V.SearchInput),
    react: () => <R.SearchInput />,
  },
  {
    name: 'attrs override type and enterkeyhint',
    vue: () =>
      h(V.SearchInput, {
        placeholder: '搜索作品',
        autocomplete: 'off',
        type: 'text',
        enterkeyhint: 'go',
      }),
    react: () => (
      <R.SearchInput placeholder="搜索作品" autoComplete="off" type="text" enterKeyHint="go" />
    ),
  },
  {
    name: 'value shows the clear button',
    vue: () => h(V.SearchInput, { modelValue: '星见' }),
    react: () => <R.SearchInput value="星见" />,
  },
  {
    name: 'not clearable',
    vue: () => h(V.SearchInput, { modelValue: '星见', clearable: false }),
    react: () => <R.SearchInput value="星见" clearable={false} />,
  },
  {
    name: 'loading',
    vue: () => h(V.SearchInput, { loading: true, modelValue: '星见' }),
    react: () => <R.SearchInput loading value="星见" />,
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.SearchInput, { variant }),
    react: () => <R.SearchInput variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.SearchInput, { size }),
    react: () => <R.SearchInput size={size} />,
  })),
  {
    name: 'invalid passes through',
    vue: () => h(V.SearchInput, { invalid: true }),
    react: () => <R.SearchInput invalid />,
  },
  {
    name: 'disabled hides the clear button',
    vue: () => h(V.SearchInput, { modelValue: '星见', disabled: true }),
    react: () => <R.SearchInput value="星见" disabled />,
  },
  {
    name: 'class',
    vue: () => h(V.SearchInput, { class: 'w-72' }),
    react: () => <R.SearchInput className="w-72" />,
  },
])
