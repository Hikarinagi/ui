import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const marks = [{ value: 0, label: '慢' }, { value: 50 }, { value: 100, label: '快' }]

export default defineCases('Slider', [
  {
    name: 'default',
    vue: () => h(V.Slider, { 'aria-label': '音量' }),
    react: () => <R.Slider aria-label="音量" />,
  },
  {
    name: 'value, class and attrs on the thumb',
    vue: () => h(V.Slider, { modelValue: 30, class: 'w-64', 'aria-label': '音量', 'data-x': '1' }),
    react: () => <R.Slider value={30} className="w-64" aria-label="音量" data-x="1" />,
  },
  {
    name: 'min, max, step and format',
    vue: () =>
      h(V.Slider, { modelValue: 2.5, min: 1, max: 5, step: 0.5, format: (v: number) => `${v} 星` }),
    react: () => <R.Slider value={2.5} min={1} max={5} step={0.5} format={v => `${v} 星`} />,
  },
  {
    name: 'unbound value sits at min',
    vue: () => h(V.Slider, { min: 10 }),
    react: () => <R.Slider min={10} />,
  },
  {
    name: 'marks with labels',
    vue: () => h(V.Slider, { modelValue: 50, marks }),
    react: () => <R.Slider value={50} marks={marks} />,
  },
  {
    name: 'marks without labels',
    vue: () => h(V.Slider, { modelValue: 50, marks: [{ value: 25 }, { value: 75 }] }),
    react: () => <R.Slider value={50} marks={[{ value: 25 }, { value: 75 }]} />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Slider, { size, modelValue: 40 }),
    react: () => <R.Slider size={size} value={40} />,
  })),
  {
    name: 'disabled',
    vue: () => h(V.Slider, { modelValue: 1, disabled: true }),
    react: () => <R.Slider value={1} disabled />,
  },
  {
    name: 'explicit rtl',
    vue: () => h(V.Slider, { modelValue: 25, dir: 'rtl', marks }),
    react: () => <R.Slider value={25} dir="rtl" marks={marks} />,
  },
  {
    name: 'tooltip trigger with a provider',
    vue: () => h(V.TooltipProvider, null, () => h(V.Slider, { modelValue: 1 })),
    react: () => (
      <R.TooltipProvider>
        <R.Slider value={1} />
      </R.TooltipProvider>
    ),
  },
  {
    name: 'always-open label',
    vue: () => h(V.TooltipProvider, null, () => h(V.Slider, { modelValue: 1, label: 'always' })),
    react: () => (
      <R.TooltipProvider>
        <R.Slider value={1} label="always" />
      </R.TooltipProvider>
    ),
  },
  {
    name: 'no label with a provider',
    vue: () => h(V.TooltipProvider, null, () => h(V.Slider, { modelValue: 1, label: 'none' })),
    react: () => (
      <R.TooltipProvider>
        <R.Slider value={1} label="none" />
      </R.TooltipProvider>
    ),
  },
  {
    name: 'inside a field',
    vue: () =>
      h(V.FormField, { label: '音量', description: '0 到 100' }, () =>
        h(V.Slider, { modelValue: 20 }),
      ),
    react: () => (
      <R.FormField label="音量" description="0 到 100">
        <R.Slider value={20} />
      </R.FormField>
    ),
  },
])
