import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('PasswordInput', [
  {
    name: 'default',
    vue: () => h(V.PasswordInput),
    react: () => <R.PasswordInput />,
  },
  {
    name: 'attrs go to the native input',
    vue: () =>
      h(V.PasswordInput, { autocomplete: 'current-password', placeholder: '密码', type: 'email' }),
    react: () => (
      <R.PasswordInput autoComplete="current-password" placeholder="密码" type="email" />
    ),
  },
  {
    name: 'visible',
    vue: () => h(V.PasswordInput, { visible: true, modelValue: 'secret' }),
    react: () => <R.PasswordInput visible value="secret" />,
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.PasswordInput, { variant }),
    react: () => <R.PasswordInput variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.PasswordInput, { size }),
    react: () => <R.PasswordInput size={size} />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.PasswordInput, { invalid: true, modelValue: '123' }),
    react: () => <R.PasswordInput invalid value="123" />,
  },
  {
    name: 'disabled',
    vue: () => h(V.PasswordInput, { disabled: true }),
    react: () => <R.PasswordInput disabled />,
  },
  {
    name: 'class',
    vue: () => h(V.PasswordInput, { class: 'w-72' }),
    react: () => <R.PasswordInput className="w-72" />,
  },
])
