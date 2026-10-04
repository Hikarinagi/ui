import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const marks = [{ value: 0, label: '低' }, { value: 50 }, { value: 100, label: '高' }]

export default defineCases('RangeSlider', [
  {
    name: 'value, class and attrs on the root',
    vue: () => h(V.RangeSlider, { modelValue: [20, 60], class: 'w-64', 'aria-label': '价格区间' }),
    react: () => <R.RangeSlider value={[20, 60]} className="w-64" aria-label="价格区间" />,
  },
  {
    name: 'unbound value covers the range',
    vue: () => h(V.RangeSlider, { min: 10, max: 50 }),
    react: () => <R.RangeSlider min={10} max={50} />,
  },
  {
    name: 'marks and format',
    vue: () => h(V.RangeSlider, { modelValue: [25, 75], marks, format: (v: number) => `¥${v}` }),
    react: () => <R.RangeSlider value={[25, 75]} marks={marks} format={v => `¥${v}`} />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.RangeSlider, { size, modelValue: [10, 90] }),
    react: () => <R.RangeSlider size={size} value={[10, 90]} />,
  })),
  {
    name: 'disabled',
    vue: () => h(V.RangeSlider, { modelValue: [1, 2], disabled: true }),
    react: () => <R.RangeSlider value={[1, 2]} disabled />,
  },
  {
    name: 'explicit rtl',
    vue: () => h(V.RangeSlider, { modelValue: [25, 75], dir: 'rtl', marks }),
    react: () => <R.RangeSlider value={[25, 75]} dir="rtl" marks={marks} />,
  },
  {
    name: 'min steps and step',
    vue: () => h(V.RangeSlider, { modelValue: [20, 60], step: 10, minSteps: 2 }),
    react: () => <R.RangeSlider value={[20, 60]} step={10} minSteps={2} />,
  },
  {
    name: 'tooltips with a provider',
    vue: () => h(V.TooltipProvider, null, () => h(V.RangeSlider, { modelValue: [20, 60] })),
    react: () => (
      <R.TooltipProvider>
        <R.RangeSlider value={[20, 60]} />
      </R.TooltipProvider>
    ),
  },
  {
    name: 'inside a field',
    vue: () =>
      h(V.FormField, { label: '价格', error: '区间过窄' }, () =>
        h(V.RangeSlider, { modelValue: [20, 30], style: { marginTop: '4px' } }),
      ),
    react: () => (
      <R.FormField label="价格" error="区间过窄">
        <R.RangeSlider value={[20, 30]} style={{ marginTop: '4px' }} />
      </R.FormField>
    ),
  },
])
