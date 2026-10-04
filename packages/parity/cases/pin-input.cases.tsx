import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('PinInput', [
  {
    name: 'default',
    vue: () => h(V.PinInput, { 'aria-label': '验证码' }),
    react: () => <R.PinInput aria-label="验证码" />,
  },
  {
    name: 'partial value with class',
    vue: () => h(V.PinInput, { modelValue: '12', class: 'mt-2', 'aria-label': '验证码' }),
    react: () => <R.PinInput value="12" className="mt-2" aria-label="验证码" />,
  },
  {
    name: 'complete value',
    vue: () => h(V.PinInput, { modelValue: '2468', length: 4 }),
    react: () => <R.PinInput value="2468" length={4} />,
  },
  {
    name: 'length, mask, otp, placeholder, name, size and variant',
    vue: () =>
      h(V.PinInput, {
        length: 4,
        mask: true,
        otp: true,
        placeholder: '○',
        name: 'code',
        size: 'lg',
        variant: 'secondary',
      }),
    react: () => (
      <R.PinInput length={4} mask otp placeholder="○" name="code" size="lg" variant="secondary" />
    ),
  },
  {
    name: 'number type',
    vue: () => h(V.PinInput, { type: 'number', length: 4, modelValue: '07' }),
    react: () => <R.PinInput type="number" length={4} value="07" />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.PinInput, { size, length: 3 }),
    react: () => <R.PinInput size={size} length={3} />,
  })),
  {
    name: 'disabled and invalid',
    vue: () => h(V.PinInput, { disabled: true, invalid: true, length: 3, modelValue: '1' }),
    react: () => <R.PinInput disabled invalid length={3} value="1" />,
  },
  {
    name: 'inside a field',
    vue: () =>
      h(V.FormField, { label: '验证码', error: '验证码错误' }, () => h(V.PinInput, { length: 4 })),
    react: () => (
      <R.FormField label="验证码" error="验证码错误">
        <R.PinInput length={4} />
      </R.FormField>
    ),
  },
])
