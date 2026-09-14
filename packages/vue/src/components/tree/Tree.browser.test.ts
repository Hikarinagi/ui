import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ConfigProvider } from 'reka-ui'
import { h, nextTick, reactive, ref, type VNodeChild } from 'vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Tree from './Tree.vue'
import FormField from '../form-field/FormField.vue'
import type { TreeNode, TreeNodeSlot, TreeValue } from './types'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1000, 800)
})
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})
const nodes: TreeNode[] = [
  {
    value: 'root',
    label: 'Root',
    children: [
      {
        value: 'branch',
        label: 'Branch',
        children: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
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
]
const row = (name: string) => page.getByRole('treeitem', { name, exact: true })
function render(
  initial: Record<string, unknown> = {},
  slots: {
    node?: (props: TreeNodeSlot) => VNodeChild
    trailing?: (props: TreeNodeSlot) => VNodeChild
    empty?: () => VNodeChild
  } = {},
  rtl = false,
) {
  const props = reactive<Record<string, unknown> & { items: TreeNode[] }>({
    items: structuredClone(nodes),
    multiple: true,
    ...initial,
  })
  const model = ref<TreeValue | TreeValue[] | null>()
  const expanded = ref<TreeValue[]>()
  const updates = vi.fn()
  wrapper = mount(
    {
      setup: () => () =>
        h(ConfigProvider, { dir: rtl ? 'rtl' : 'ltr' }, () =>
          h('div', { dir: rtl ? 'rtl' : 'ltr', style: 'width:420px;padding:20px' }, [
            h('button', { 'data-before': '' }, 'Before'),
            h(
              Tree,
              {
                'aria-label': 'Nodes',
                ...props,
                modelValue: model.value,
                'onUpdate:modelValue': (value: TreeValue | TreeValue[] | null | undefined) => {
                  model.value = value
                  updates(value)
                },
                expanded: expanded.value,
                'onUpdate:expanded': (value: TreeValue[] | undefined) => {
                  expanded.value = value
                },
              },
              slots,
            ),
            h('button', { 'data-after': '' }, 'After'),
          ]),
        ),
    },
    { attachTo: document.body },
  )
  return { props, model, expanded, updates }
}
async function expand(name: string) {
  await userEvent.click(row(name).element().querySelector('[data-hn-tree-toggle]')!)
}

describe('Tree multi check', () => {
  it('checks collapsed descendants, paints mixed ancestors and keeps expansion separate from row selection', async () => {
    const demo = render()
    await row('Root').click()
    expect(demo.model.value).toEqual(['root', 'branch', 'a', 'b', 'c'])
    expect(row('Root').element().getAttribute('aria-expanded')).toBe('false')
    await expand('Root')
    expect(demo.updates).toHaveBeenCalledTimes(1)
    expect(row('Branch').element().getAttribute('aria-checked')).toBe('true')
    await expand('Branch')
    await row('Alpha').click()
    expect(demo.model.value).toEqual(['b', 'c'])
    expect(row('Root').element().getAttribute('aria-checked')).toBe('mixed')
    expect(row('Branch').element().getAttribute('aria-checked')).toBe('mixed')
    expect(row('Alpha').element().getAttribute('aria-checked')).toBe('false')
    expect(row('Root').element().hasAttribute('aria-selected')).toBe(false)
    expect(row('Root').element().querySelector('[data-state="indeterminate"] svg')).toBeTruthy()
    await expectNoA11yViolations(wrapper!.element)
    await expand('Root')
    expect(row('Root').element().getAttribute('aria-checked')).toBe('mixed')
    await row('Root').click()
    expect(demo.model.value).toEqual(['root', 'branch', 'a', 'b', 'c'])
    await row('Root').click()
    expect(demo.model.value).toEqual([])
  })
  it('derives checked parents from externally supplied leaf values without emitting on mount or expansion', async () => {
    const demo = render({ defaultExpanded: ['root', 'branch'] })
    demo.model.value = ['a', 'b']
    await nextTick()
    expect(row('Branch').element().getAttribute('aria-checked')).toBe('true')
    expect(row('Root').element().getAttribute('aria-checked')).toBe('mixed')
    await expand('Root')
    expect(demo.updates).not.toHaveBeenCalled()
    demo.model.value = []
    await nextTick()
    expect(row('Root').element().getAttribute('aria-checked')).toBe('false')
  })
  it('disabled subtrees do not change or prevent available siblings from fully checking their parent', async () => {
    const demo = render({ defaultExpanded: ['root', 'disabled'] })
    demo.model.value = ['locked-child']
    await nextTick()
    expect(row('Locked child').element().getAttribute('aria-disabled')).toBe('true')
    row('Locked child')
      .element()
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    row('Disabled')
      .element()
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(demo.updates).not.toHaveBeenCalled()
    await row('Root').click()
    expect(demo.model.value).toEqual(['root', 'branch', 'a', 'b', 'c', 'locked-child'])
    expect(row('Root').element().getAttribute('aria-checked')).toBe('true')
    await row('Root').click()
    expect(demo.model.value).toEqual(['locked-child'])
  })
  it('reacts to replacement items and handles numeric and string keys independently', async () => {
    const demo = render({
      items: [
        {
          value: 0,
          label: 'Zero',
          children: [
            { value: 1, label: 'Number' },
            { value: '1', label: 'String' },
          ],
        },
      ],
      defaultExpanded: [0],
    })
    await row('Number').click()
    expect(demo.model.value).toEqual([1])
    await row('String').click()
    expect(demo.model.value).toEqual([0, 1, '1'])
    demo.props.items = [
      { value: 0, label: 'New root', children: [{ value: 1, label: 'New number' }] },
    ]
    await nextTick()
    expect(row('New number').element().getAttribute('aria-checked')).toBe('true')
    await expand('New root')
    expect(demo.expanded.value).toEqual([])
    await expand('New root')
    expect(demo.expanded.value).toEqual([0])
  })
})

describe('Tree keyboard and presentation', () => {
  it.each([false, true])(
    'supports one tab stop, arrow navigation, expansion and Space checks with rtl=%s',
    async rtl => {
      const demo = render({}, {}, rtl)
      await userEvent.click(wrapper!.get('[data-before]').element)
      await userEvent.keyboard('{Tab}')
      expect(document.activeElement).toBe(row('Root').element())
      await userEvent.keyboard(rtl ? '{ArrowLeft}' : '{ArrowRight}')
      expect(demo.expanded.value).toEqual(['root'])
      await userEvent.keyboard(rtl ? '{ArrowLeft}' : '{ArrowRight}')
      expect(document.activeElement).toBe(row('Branch').element())
      await userEvent.keyboard(' ')
      expect(demo.model.value).toEqual(['branch', 'a', 'b'])
      await userEvent.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(row('Gamma').element())
      await userEvent.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(row('Empty branch').element())
      expect(row('Empty branch').element().hasAttribute('aria-expanded')).toBe(false)
      await userEvent.keyboard('{Home}')
      expect(document.activeElement).toBe(row('Root').element())
      await userEvent.keyboard('{End}')
      expect(document.activeElement).toBe(row('Empty branch').element())
      await userEvent.keyboard('{Tab}')
      expect(document.activeElement).toBe(wrapper!.get('[data-after]').element)
    },
  )
  it.each([false, true])('entering children skips disabled nodes with rtl=%s', async rtl => {
    const demo = render(
      {
        items: [
          {
            value: 'root',
            label: 'Root',
            children: [
              { value: 'disabled', label: 'Disabled first', disabled: true },
              { value: 'enabled', label: 'Enabled child' },
            ],
          },
        ],
      },
      {},
      rtl,
    )
    await row('Root').click()
    await userEvent.keyboard(rtl ? '{ArrowLeft}' : '{ArrowRight}')
    await userEvent.keyboard(rtl ? '{ArrowLeft}' : '{ArrowRight}')
    expect(document.activeElement).toBe(row('Enabled child').element())
    await userEvent.keyboard(rtl ? '{ArrowRight}' : '{ArrowLeft}')
    expect(document.activeElement).toBe(row('Root').element())
    demo.props.items = [
      {
        value: 'root',
        label: 'Root',
        children: [{ value: 'disabled', label: 'Disabled first', disabled: true }],
      },
    ]
    await nextTick()
    await userEvent.keyboard(rtl ? '{ArrowLeft}' : '{ArrowRight}')
    expect(document.activeElement).toBe(row('Root').element())
  })

  it('supports controlled expansion and single selection without checkbox semantics', async () => {
    const demo = render({ multiple: false, defaultExpanded: ['root'] })
    expect(row('Root').element().hasAttribute('aria-checked')).toBe(false)
    expect(row('Root').element().querySelector('[data-state]')).toBeNull()
    await row('Gamma').click()
    expect(demo.model.value).toBe('c')
    expect(row('Gamma').element().getAttribute('aria-selected')).toBe('true')
    await row('Gamma').click()
    expect(demo.model.value).toBeNull()
    demo.expanded.value = []
    await nextTick()
    expect(row('Root').element().getAttribute('aria-expanded')).toBe('false')
    await expectNoA11yViolations(wrapper!.element)
  })
  it('does not check or expand when the tree is globally disabled', async () => {
    const demo = render({ disabled: true })
    row('Root')
      .element()
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    row('Root').element().querySelector<HTMLElement>('[data-hn-tree-toggle]')!.click()
    await nextTick()
    expect(demo.model.value).toBeUndefined()
    expect(demo.expanded.value).toBeUndefined()
    expect(row('Root').element().getAttribute('aria-disabled')).toBe('true')
  })
  it('node and trailing slots receive current check, mixed, disabled and expanded states', async () => {
    const seen = new Map<TreeValue, TreeNodeSlot>()
    const demo = render(
      { defaultExpanded: ['root'] },
      {
        node: props => {
          seen.set(props.node.value, { ...props })
          return h('span', props.node.label)
        },
        trailing: props =>
          h(
            'span',
            { 'data-trailing': props.node.value },
            props.indeterminate ? 'Mixed' : props.selected ? 'Checked' : '',
          ),
      },
    )
    demo.model.value = ['a']
    await nextTick()
    expect(seen.get('root')).toMatchObject({
      selected: false,
      indeterminate: true,
      expanded: true,
      disabled: false,
    })
    expect(seen.get('disabled')?.disabled).toBe(true)
    expect(wrapper!.find('[data-trailing="root"]').text()).toBe('Mixed')
  })
  it('renders localized and custom empty states without invalid tree semantics', async () => {
    const demo = render({ items: [] })
    expect(wrapper!.get('[role="status"]').text()).toBe('暂无节点')
    await expectNoA11yViolations(wrapper!.element)
    demo.props.items = [{ value: 'leaf', label: 'Leaf' }]
    await nextTick()
    expect(wrapper!.find('[role="status"]').exists()).toBe(false)
    wrapper!.unmount()
    wrapper = undefined
    render({ items: [] }, { empty: () => h('span', 'Custom empty') })
    expect(wrapper!.get('[role="status"]').text()).toBe('Custom empty')
  })
  it('inherits accessible labels, descriptions and disabled state from FormField', async () => {
    wrapper = mount(FormField, {
      props: { label: 'Tree field', description: 'Field description', disabled: true },
      slots: { default: () => h(Tree, { items: nodes, multiple: true }) },
      attachTo: document.body,
    })
    const tree = wrapper.find('[role="tree"]')
    expect(document.getElementById(tree.attributes('aria-labelledby')!)?.textContent).toBe(
      'Tree field',
    )
    expect(tree.attributes('aria-describedby')).toBeTruthy()
    expect(tree.attributes('aria-disabled')).toBe('true')
    await expectNoA11yViolations(wrapper.element)
  })
})
