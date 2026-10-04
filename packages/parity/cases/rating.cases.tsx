import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Rating', [
  {
    name: 'value with class and label',
    vue: () => h(V.Rating, { modelValue: 3, class: 'gap-2', 'aria-label': '评分' }),
    react: () => <R.Rating value={3} className="gap-2" aria-label="评分" />,
  },
  {
    name: 'unbound',
    vue: () => h(V.Rating),
    react: () => <R.Rating />,
  },
  {
    name: 'half steps',
    vue: () => h(V.Rating, { modelValue: 2.5, step: 0.5 }),
    react: () => <R.Rating value={2.5} step={0.5} />,
  },
  {
    name: 'max',
    vue: () => h(V.Rating, { modelValue: 7, max: 10 }),
    react: () => <R.Rating value={7} max={10} />,
  },
  {
    name: 'scaled half steps',
    vue: () => h(V.Rating, { modelValue: 7, max: 10, stars: 5, step: 0.5 }),
    react: () => <R.Rating value={7} max={10} stars={5} step={0.5} />,
  },
  {
    name: 'scaled with a name renders the score input',
    vue: () => h(V.Rating, { modelValue: 7, max: 10, stars: 5, name: 'score' }),
    react: () => <R.Rating value={7} max={10} stars={5} name="score" />,
  },
  {
    name: 'name renders the radio group input',
    vue: () => h(V.Rating, { modelValue: 4, name: 'score', required: true }),
    react: () => <R.Rating value={4} name="score" required />,
  },
  {
    name: 'readonly',
    vue: () => h(V.Rating, { modelValue: 4.3, readonly: true, class: 'gap-1' }),
    react: () => <R.Rating value={4.3} readonly className="gap-1" />,
  },
  {
    name: 'scaled readonly',
    vue: () => h(V.Rating, { modelValue: 8.6, max: 10, stars: 5, readonly: true }),
    react: () => <R.Rating value={8.6} max={10} stars={5} readonly />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Rating, { size, modelValue: 2 }),
    react: () => <R.Rating size={size} value={2} />,
  })),
  {
    name: 'disabled',
    vue: () => h(V.Rating, { modelValue: 2, disabled: true }),
    react: () => <R.Rating value={2} disabled />,
  },
  {
    name: 'rtl',
    vue: () => h(V.Rating, { modelValue: 2, dir: 'rtl' }),
    react: () => <R.Rating value={2} dir="rtl" />,
  },
  {
    name: 'inside an invalid field',
    vue: () =>
      h(V.FormField, { label: '评分', error: '请评分' }, () => h(V.Rating, { modelValue: 0 })),
    react: () => (
      <R.FormField label="评分" error="请评分">
        <R.Rating value={0} />
      </R.FormField>
    ),
  },
])
