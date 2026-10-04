import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('NumberInput', [
  {
    name: 'default',
    vue: () => h(V.NumberInput),
    react: () => <R.NumberInput />,
  },
  {
    name: 'attrs go to the spinbutton',
    vue: () => h(V.NumberInput, { placeholder: '数量', id: 'qty', 'aria-label': '数量' }),
    react: () => <R.NumberInput placeholder="数量" id="qty" aria-label="数量" />,
  },
  {
    name: 'value with bounds',
    vue: () => h(V.NumberInput, { modelValue: 5, min: 0, max: 10 }),
    react: () => <R.NumberInput value={5} min={0} max={10} />,
  },
  {
    name: 'at the minimum',
    vue: () => h(V.NumberInput, { modelValue: 0, min: 0, max: 10 }),
    react: () => <R.NumberInput value={0} min={0} max={10} />,
  },
  {
    name: 'at the maximum with a decimal step',
    vue: () => h(V.NumberInput, { modelValue: 10, min: 0, max: 10, step: 0.5 }),
    react: () => <R.NumberInput value={10} min={0} max={10} step={0.5} />,
  },
  {
    name: 'null model',
    vue: () => h(V.NumberInput, { modelValue: null }),
    react: () => <R.NumberInput value={null} />,
  },
  {
    name: 'default value with currency format',
    vue: () =>
      h(V.NumberInput, {
        defaultValue: 1234.5,
        formatOptions: { style: 'currency', currency: 'CNY' },
      }),
    react: () => (
      <R.NumberInput defaultValue={1234.5} formatOptions={{ style: 'currency', currency: 'CNY' }} />
    ),
  },
  {
    name: 'locale and percent format',
    vue: () =>
      h(V.NumberInput, {
        modelValue: 0.25,
        locale: 'de-DE',
        formatOptions: { style: 'percent' },
        step: 0.01,
      }),
    react: () => (
      <R.NumberInput value={0.25} locale="de-DE" formatOptions={{ style: 'percent' }} step={0.01} />
    ),
  },
  {
    name: 'integer format uses numeric input mode',
    vue: () => h(V.NumberInput, { modelValue: 3, formatOptions: { maximumFractionDigits: 0 } }),
    react: () => <R.NumberInput value={3} formatOptions={{ maximumFractionDigits: 0 }} />,
  },
  {
    name: 'without controls',
    vue: () => h(V.NumberInput, { controls: false, modelValue: 2 }),
    react: () => <R.NumberInput controls={false} value={2} />,
  },
  ...(['primary', 'secondary', 'bare'] as const).map(variant => ({
    name: `variant ${variant}`,
    vue: () => h(V.NumberInput, { variant }),
    react: () => <R.NumberInput variant={variant} />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.NumberInput, { size }),
    react: () => <R.NumberInput size={size} />,
  })),
  {
    name: 'invalid',
    vue: () => h(V.NumberInput, { invalid: true }),
    react: () => <R.NumberInput invalid />,
  },
  {
    name: 'disabled',
    vue: () => h(V.NumberInput, { disabled: true, modelValue: 4 }),
    react: () => <R.NumberInput disabled value={4} />,
  },
  {
    name: 'readonly',
    vue: () => h(V.NumberInput, { readonly: true, modelValue: 5 }),
    react: () => <R.NumberInput readonly value={5} />,
  },
  {
    name: 'class',
    vue: () => h(V.NumberInput, { class: 'w-40', controls: false }),
    react: () => <R.NumberInput className="w-40" controls={false} />,
  },
])
