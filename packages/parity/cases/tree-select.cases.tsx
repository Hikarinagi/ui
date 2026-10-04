import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases, type ParityCase } from '../src/cases'

type Props = Omit<R.TreeSelectProps, 'ref' | 'renderNode'>

const regions: R.TreeSelectNode[] = [
  {
    value: 'jp',
    label: '日本',
    children: [
      {
        value: 'kanto',
        label: '关东',
        children: [
          { value: 'tokyo', label: '东京' },
          { value: 'yokohama', label: '横滨', description: '神奈川' },
        ],
      },
      { value: 'osaka', label: '大阪', disabled: true },
    ],
  },
  { value: 'cn', label: '中国', children: [{ value: 'shanghai', label: '上海' }] },
  { value: 0, label: 'Zero' },
]
const many = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

function vueProps(props: Props) {
  const { value, className, onValueChange, onOpenChange, onSearchChange, ...rest } = props
  return {
    ...(rest as Record<string, unknown>),
    ...(value !== undefined ? { modelValue: value } : {}),
    ...(className ? { class: className } : {}),
  }
}

function both(name: string, props: Props, options: { english?: boolean } = {}): ParityCase {
  return {
    name,
    vue: (): VNode => {
      const select = h(V.TreeSelect, vueProps(props))
      return options.english ? h(English, null, () => select) : select
    },
    react: (): ReactElement => {
      const select = <R.TreeSelect {...props} />
      return options.english ? (
        <UiLocaleProvider messages={enUS}>{select}</UiLocaleProvider>
      ) : (
        select
      )
    },
  }
}

export default defineCases('TreeSelect', [
  both('placeholder from the locale', { items: regions, 'aria-label': '地区' }),
  both('english placeholder', { items: regions, 'aria-label': 'Region' }, { english: true }),
  both('custom placeholder', { items: regions, placeholder: '选择地区' }),
  both('nested selected label', { items: regions, value: 'yokohama', 'aria-label': '地区' }),
  both('numeric zero selected', { items: regions, value: 0 }),
  both('null model', { items: regions, value: null }),
  both('unknown value keeps the placeholder', { items: regions, value: 'missing' }),
  ...(['primary', 'secondary', 'bare'] as const).map(variant =>
    both(`variant ${variant}`, { items: regions, variant, value: 'tokyo' }),
  ),
  ...(['sm', 'md', 'lg'] as const).map(size =>
    both(`size ${size}`, { items: regions, size, value: 'tokyo', 'aria-label': size }),
  ),
  both('invalid', { items: regions, invalid: true, placeholder: '请选择地区' }),
  both('disabled', { items: regions, disabled: true, value: 'tokyo' }),
  both('searchable with a custom search placeholder', {
    items: regions,
    searchable: true,
    searchPlaceholder: '搜索节点',
    search: '东',
  }),
  both('style and native attributes reach the trigger', {
    items: regions,
    style: { color: 'red' },
    title: 'Region',
    tabIndex: 2,
  }),
  both('default expansion', { items: regions, defaultExpanded: ['jp', 'kanto'] }),
  both('class, id and labelling attributes', {
    items: regions,
    className: 'w-64',
    id: 'region',
    'aria-labelledby': 'region-label',
    'aria-describedby': 'region-help',
    'data-test': 'tree-select',
  }),
  ...[false, true].map(open =>
    both(`virtualized distant selection ${open ? 'open' : 'closed'} on the server`, {
      items: many,
      virtualize: true,
      value: 7890,
      open,
    }),
  ),
  both('open on the server', { items: regions, value: 'tokyo', open: true, searchable: true }),
  {
    name: 'custom node slot does not change the trigger',
    vue: () =>
      h(
        V.TreeSelect,
        { items: regions, modelValue: 'tokyo' },
        { node: ({ node }: { node: V.TreeSelectNode }) => h('b', node.label) },
      ),
    react: () => (
      <R.TreeSelect items={regions} value="tokyo" renderNode={({ node }) => <b>{node.label}</b>} />
    ),
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: '地区', description: '选择一个节点', required: true }, () =>
        h(V.TreeSelect, { items: regions, searchable: true }),
      ),
    react: () => (
      <R.FormField label="地区" description="选择一个节点" required>
        <R.TreeSelect items={regions} searchable />
      </R.FormField>
    ),
  },
  {
    name: 'inside an invalid disabled form field',
    vue: () =>
      h(V.FormField, { label: '地区', error: '请选择', disabled: true }, () =>
        h(V.TreeSelect, { items: regions }),
      ),
    react: () => (
      <R.FormField label="地区" error="请选择" disabled>
        <R.TreeSelect items={regions} />
      </R.FormField>
    ),
  },
  {
    name: 'inside an input group',
    vue: () =>
      h(V.InputGroup, { size: 'lg', invalid: true }, () => [
        h(V.InputGroupAddon, null, () => '地区'),
        h(V.TreeSelect, { items: regions, modelValue: 'tokyo', 'aria-label': '地区' }),
      ]),
    react: () => (
      <R.InputGroup size="lg" invalid>
        <R.InputGroupAddon>地区</R.InputGroupAddon>
        <R.TreeSelect items={regions} value="tokyo" aria-label="地区" />
      </R.InputGroup>
    ),
  },
  {
    name: 'inside a disabled input group',
    vue: () =>
      h(V.InputGroup, { disabled: true }, () => [
        h(V.TreeSelect, { items: regions, 'aria-label': '地区' }),
      ]),
    react: () => (
      <R.InputGroup disabled>
        <R.TreeSelect items={regions} aria-label="地区" />
      </R.InputGroup>
    ),
  },
])
