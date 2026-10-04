import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const icon = () => h('svg', { 'data-icon': 'mail' })

export default defineCases('Input', [
  {
    name: 'default',
    vue: () => h(V.Input),
    react: () => <R.Input />,
  },
  {
    name: 'attrs go to the native input',
    vue: () =>
      h(V.Input, {
        placeholder: '邮箱',
        type: 'email',
        name: 'email',
        id: 'mail',
        'aria-label': '邮箱',
        'data-probe': 'x',
      }),
    react: () => (
      <R.Input
        placeholder="邮箱"
        type="email"
        name="email"
        id="mail"
        aria-label="邮箱"
        data-probe="x"
      />
    ),
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.Input, { variant, placeholder: variant, 'aria-label': variant }),
    react: () => <R.Input variant={variant} placeholder={variant} aria-label={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Input, { size, placeholder: size }),
    react: () => <R.Input size={size} placeholder={size} />,
  })),
  {
    name: 'value',
    vue: () => h(V.Input, { modelValue: 'hina' }),
    react: () => <R.Input value="hina" />,
  },
  {
    name: 'clearable with a value',
    vue: () => h(V.Input, { clearable: true, modelValue: '星见', 'aria-label': '关键词' }),
    react: () => <R.Input clearable value="星见" aria-label="关键词" />,
  },
  {
    name: 'clearable without a value',
    vue: () => h(V.Input, { clearable: true, modelValue: '' }),
    react: () => <R.Input clearable value="" />,
  },
  {
    name: 'clearable but disabled',
    vue: () => h(V.Input, { clearable: true, modelValue: '星见', disabled: true }),
    react: () => <R.Input clearable value="星见" disabled />,
  },
  {
    name: 'leading and trailing',
    vue: () => h(V.Input, null, { leading: icon, trailing: () => 'kg' }),
    react: () => <R.Input leading={<svg data-icon="mail" />} trailing="kg" />,
  },
  {
    name: 'trailing kbd',
    vue: () =>
      h(V.Input, { 'aria-label': '快速跳转' }, { trailing: () => h(V.Kbd, null, () => '/') }),
    react: () => <R.Input aria-label="快速跳转" trailing={<R.Kbd>/</R.Kbd>} />,
  },
  {
    name: 'loading swaps the leading icon',
    vue: () => h(V.Input, { loading: true, modelValue: 'shion@hoshimi.moe' }, { leading: icon }),
    react: () => <R.Input loading value="shion@hoshimi.moe" leading={<svg data-icon="mail" />} />,
  },
  {
    name: 'loading at the end',
    vue: () => h(V.Input, { loading: true, modelValue: 'hoshimi' }),
    react: () => <R.Input loading value="hoshimi" />,
  },
  {
    name: 'hero: email, clearable, leading',
    vue: () =>
      h(
        V.Input,
        {
          type: 'email',
          clearable: true,
          modelValue: 'a@b.c',
          class: 'w-72',
          'aria-label': '邮箱',
        },
        { leading: icon },
      ),
    react: () => (
      <R.Input
        type="email"
        clearable
        value="a@b.c"
        className="w-72"
        aria-label="邮箱"
        leading={<svg data-icon="mail" />}
      />
    ),
  },
  {
    name: 'invalid',
    vue: () => h(V.Input, { invalid: true, modelValue: 'shion@' }),
    react: () => <R.Input invalid value="shion@" />,
  },
  {
    name: 'disabled',
    vue: () => h(V.Input, { disabled: true, modelValue: 'hoshimi' }),
    react: () => <R.Input disabled value="hoshimi" />,
  },
  {
    name: 'class merges onto the host',
    vue: () => h(V.Input, { class: 'w-40 border-transparent' }),
    react: () => <R.Input className="w-40 border-transparent" />,
  },
])
