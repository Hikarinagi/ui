import { defineComponent, h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { enUS as vueEnUS, provideUiLocale } from '@hina-ui/vue/locale'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases, type ParityCase } from '../src/cases'

type Props = Omit<R.TreeProps, 'ref' | 'renderNode' | 'renderTrailing' | 'empty'>

const nodes: R.TreeNode[] = [
  {
    value: 'root',
    label: 'Root',
    children: [
      {
        value: 'branch',
        label: 'Branch',
        description: 'Two leaves',
        children: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta', description: 'Second leaf' },
        ],
      },
      { value: 'c', label: 'Gamma' },
      {
        value: 'disabled',
        label: 'Disabled',
        disabled: true,
        children: [{ value: 'locked-child', label: 'Locked child' }],
      },
    ],
  },
  { value: 'empty-branch', label: 'Empty branch', children: [] },
  { value: 'leaf', label: 'Leaf' },
]
const keyed: R.TreeNode[] = [
  {
    value: 0,
    label: 'Zero',
    children: [
      { value: 1, label: 'Number' },
      { value: '1', label: 'String' },
    ],
  },
  { value: '', label: 'Empty string' },
]
const many = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Item ${value}`,
  disabled: value % 97 === 0,
}))
const nested = [{ value: 'root', label: 'All', children: many }]

const English = defineComponent({
  setup(_, { slots }) {
    provideUiLocale(vueEnUS)
    return () => slots.default?.()
  },
})

function vueProps(props: Props) {
  const { items, value, className, expanded, onValueChange, onExpandedChange, ...rest } = props
  return {
    items,
    ...(rest as Record<string, unknown>),
    ...(value !== undefined ? { modelValue: value } : {}),
    ...(expanded !== undefined ? { expanded } : {}),
    ...(className ? { class: className } : {}),
  }
}

function both(name: string, props: Props, options: { english?: boolean } = {}): ParityCase {
  return {
    name,
    vue: (): VNode => {
      const tree = h(V.Tree, vueProps(props))
      return options.english ? h(English, null, () => tree) : tree
    },
    react: (): ReactElement => {
      const tree = <R.Tree {...props} />
      return options.english ? <UiLocaleProvider messages={enUS}>{tree}</UiLocaleProvider> : tree
    },
  }
}

export default defineCases('Tree', [
  both('collapsed single selection', { items: nodes, 'aria-label': 'Nodes' }),
  both('expanded single selection', {
    items: nodes,
    defaultExpanded: ['root', 'branch'],
    value: 'a',
    'aria-label': 'Nodes',
  }),
  both('single selection of a parent', {
    items: nodes,
    defaultExpanded: ['root'],
    value: 'root',
  }),
  both('null single model', { items: nodes, value: null, defaultExpanded: ['root'] }),
  both('multiple with a mixed ancestor', {
    items: nodes,
    multiple: true,
    defaultExpanded: ['root', 'branch'],
    value: ['a'],
    'aria-label': 'Nodes',
  }),
  both('multiple with every enabled descendant checked', {
    items: nodes,
    multiple: true,
    defaultExpanded: ['root', 'branch', 'disabled'],
    value: ['root'],
  }),
  both('multiple collapsed with derived parents', {
    items: nodes,
    multiple: true,
    value: ['a', 'b', 'c'],
  }),
  both('multiple with values inside a disabled subtree', {
    items: nodes,
    multiple: true,
    defaultExpanded: ['root', 'disabled'],
    value: ['locked-child'],
  }),
  both('multiple without a model', { items: nodes, multiple: true, defaultExpanded: ['root'] }),
  both('controlled expansion', { items: nodes, expanded: ['root', 'disabled'], value: 'c' }),
  both('controlled empty expansion overrides defaults', {
    items: nodes,
    expanded: [],
    defaultExpanded: ['root'],
  }),
  both('disabled', {
    items: nodes,
    multiple: true,
    disabled: true,
    defaultExpanded: ['root'],
    value: ['c'],
  }),
  both('invalid', { items: nodes, invalid: true, defaultExpanded: ['root'] }),
  both('rtl direction attribute', { items: nodes, dir: 'rtl', defaultExpanded: ['root'] }),
  both('empty with a direction attribute', { items: [], dir: 'rtl' }),
  both('numeric and string keys', {
    items: keyed,
    multiple: true,
    defaultExpanded: [0],
    value: [1, ''],
  }),
  both('numeric single key', { items: keyed, defaultExpanded: [0], value: 1 }),
  both('class, id and labelling attributes', {
    items: nodes,
    className: 'w-80',
    id: 'tree-id',
    'aria-labelledby': 'tree-label',
    'aria-describedby': 'tree-help',
    'data-test': 'tree',
  }),
  both('style attribute merges with the roving focus outline', {
    items: nodes,
    style: { color: 'red', outline: '1px solid' },
  }),
  both('empty', { items: [] }),
  both('empty with labelling attributes', {
    items: [],
    'aria-label': 'Nothing',
    className: 'w-40',
    id: 'empty-tree',
  }),
  both('english empty', { items: [] }, { english: true }),
  both('virtualized', { items: nodes, virtualize: true, defaultExpanded: ['root', 'branch'] }),
  both('virtualized multiple', {
    items: nodes,
    virtualize: true,
    multiple: true,
    defaultExpanded: ['root', 'branch'],
    value: ['b'],
    'aria-label': 'Nodes',
  }),
  both('virtualized ten thousand nodes with a distant selection', {
    items: many,
    virtualize: true,
    value: 7890,
  }),
  both('virtualized nested ten thousand nodes', {
    items: nested,
    virtualize: { estimateSize: 36, overscan: 6 },
    multiple: true,
    defaultExpanded: ['root'],
    value: [7890],
    maxHeight: 320,
    'aria-label': '一万项',
  }),
  both('virtualized with a string max height and options', {
    items: nested,
    virtualize: { estimateSize: 32, overscan: 2 },
    defaultExpanded: ['root'],
    maxHeight: '12rem',
  }),
  both('virtualized disabled', {
    items: nodes,
    virtualize: true,
    disabled: true,
    defaultExpanded: ['root'],
  }),
  {
    name: 'node and trailing slots',
    vue: () =>
      h(
        V.Tree,
        { items: nodes, multiple: true, modelValue: ['a'], defaultExpanded: ['root', 'branch'] },
        {
          node: (props: V.TreeNodeSlot) =>
            h(
              'b',
              {
                'data-state': [props.selected, props.indeterminate, props.disabled, props.expanded]
                  .map(String)
                  .join(','),
              },
              props.node.label,
            ),
          trailing: (props: V.TreeNodeSlot) =>
            h('i', { 'data-trailing': props.node.value }, props.indeterminate ? 'Mixed' : ''),
        },
      ),
    react: () => (
      <R.Tree
        items={nodes}
        multiple
        value={['a']}
        defaultExpanded={['root', 'branch']}
        renderNode={props => (
          <b
            data-state={[props.selected, props.indeterminate, props.disabled, props.expanded]
              .map(String)
              .join(',')}
          >
            {props.node.label}
          </b>
        )}
        renderTrailing={props => (
          <i data-trailing={props.node.value}>{props.indeterminate ? 'Mixed' : ''}</i>
        )}
      />
    ),
  },
  {
    name: 'tabindex attribute yields to the roving focus group',
    vue: () => h(V.Tree, { items: nodes, tabindex: 3, title: 'Nodes' }),
    react: () => <R.Tree items={nodes} tabIndex={3} title="Nodes" />,
  },
  {
    name: 'custom empty slot',
    vue: () => h(V.Tree, { items: [] }, { empty: () => h('span', 'Custom empty') }),
    react: () => <R.Tree items={[]} empty={<span>Custom empty</span>} />,
  },
  {
    name: 'inside a form field',
    vue: () =>
      h(V.FormField, { label: 'Tree field', description: 'Pick nodes', disabled: true }, () =>
        h(V.Tree, { items: nodes, multiple: true }),
      ),
    react: () => (
      <R.FormField label="Tree field" description="Pick nodes" disabled>
        <R.Tree items={nodes} multiple />
      </R.FormField>
    ),
  },
  {
    name: 'empty inside an invalid form field',
    vue: () =>
      h(V.FormField, { label: 'Tree field', error: 'Required' }, () => h(V.Tree, { items: [] })),
    react: () => (
      <R.FormField label="Tree field" error="Required">
        <R.Tree items={[]} />
      </R.FormField>
    ),
  },
])
