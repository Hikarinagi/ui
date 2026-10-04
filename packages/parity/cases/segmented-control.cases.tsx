import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结', disabled: true },
]

export default defineCases('SegmentedControl', [
  {
    name: 'unbound selects the first enabled option',
    vue: () => h(V.SegmentedControl, { options, class: 'w-64', 'aria-label': '连载状态' }),
    react: () => <R.SegmentedControl options={options} className="w-64" aria-label="连载状态" />,
  },
  {
    name: 'selected value',
    vue: () => h(V.SegmentedControl, { options, modelValue: 'ongoing' }),
    react: () => <R.SegmentedControl options={options} value="ongoing" />,
  },
  {
    name: 'first option disabled',
    vue: () =>
      h(V.SegmentedControl, {
        options: [{ value: 'x', label: 'X', disabled: true }, ...options.slice(0, 2)],
      }),
    react: () => (
      <R.SegmentedControl
        options={[{ value: 'x', label: 'X', disabled: true }, ...options.slice(0, 2)]}
      />
    ),
  },
  {
    name: 'disabled',
    vue: () => h(V.SegmentedControl, { options, disabled: true }),
    react: () => <R.SegmentedControl options={options} disabled />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.SegmentedControl, { options, size }),
    react: () => <R.SegmentedControl options={options} size={size} />,
  })),
  {
    name: 'block',
    vue: () => h(V.SegmentedControl, { options, block: true }),
    react: () => <R.SegmentedControl options={options} block />,
  },
  {
    name: 'vertical',
    vue: () => h(V.SegmentedControl, { options, orientation: 'vertical' }),
    react: () => <R.SegmentedControl options={options} orientation="vertical" />,
  },
  {
    name: 'option slot keeps the label as the name',
    vue: () =>
      h(
        V.SegmentedControl,
        { options, modelValue: 'all' },
        {
          option: ({ option }: { option: { label: string } }) => [
            h('svg', { 'data-icon': 'list' }),
            option.label,
          ],
        },
      ),
    react: () => (
      <R.SegmentedControl
        options={options}
        value="all"
        renderOption={({ option }) => (
          <>
            <svg data-icon="list" />
            {option.label}
          </>
        )}
      />
    ),
  },
  {
    name: 'numeric values',
    vue: () =>
      h(V.SegmentedControl, {
        options: [
          { value: 1, label: '一' },
          { value: 2, label: '二' },
        ],
        modelValue: 2,
      }),
    react: () => (
      <R.SegmentedControl
        options={[
          { value: 1, label: '一' },
          { value: 2, label: '二' },
        ]}
        value={2}
      />
    ),
  },
  {
    name: 'inside a field',
    vue: () =>
      h(V.FormField, { label: '状态', description: '筛选' }, () =>
        h(V.SegmentedControl, { options }),
      ),
    react: () => (
      <R.FormField label="状态" description="筛选">
        <R.SegmentedControl options={options} />
      </R.FormField>
    ),
  },
])
