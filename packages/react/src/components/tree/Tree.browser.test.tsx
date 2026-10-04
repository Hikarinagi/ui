import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render as mount } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { expectNoA11yViolations } from '../../../test/axe'
import { signal, tick } from '../../../test/signal'
import { ConfigProvider } from '../../lib/config'
import { Tree, type TreeProps } from './Tree'
import { FormField } from '../form-field/FormField'
import type { TreeModel } from './hooks/useTree'
import type { TreeNode, TreeNodeSlot, TreeValue } from './types'
import '../../../test/browser.css'

let wrapper: { unmount: () => Promise<void> | void; container: HTMLElement } | undefined
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1000, 800)
})
afterEach(async () => {
  await wrapper?.unmount()
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
type Initial = Partial<TreeProps> & Record<string, unknown>
type Slots = {
  renderNode?: (props: TreeNodeSlot) => ReactNode
  renderTrailing?: (props: TreeNodeSlot) => ReactNode
  empty?: ReactNode
}
async function render(initial: Initial = {}, slots: Slots = {}, rtl = false) {
  const props = signal<Initial & { items: TreeNode[] }>({
    items: structuredClone(nodes),
    multiple: true,
    ...initial,
  })
  const model = signal<TreeModel | undefined>(undefined)
  const expanded = signal<TreeValue[] | undefined>(undefined)
  const updates = vi.fn()
  function Harness() {
    const current = props.use()
    const value = model.use()
    const open = expanded.use()
    return (
      <ConfigProvider dir={rtl ? 'rtl' : 'ltr'}>
        <div dir={rtl ? 'rtl' : 'ltr'} style={{ width: 420, padding: 20 }}>
          <button data-before="">Before</button>
          <Tree
            aria-label="Nodes"
            {...current}
            {...slots}
            value={value}
            onValueChange={next => {
              model.value = next
              updates(next)
            }}
            expanded={open}
            onExpandedChange={next => {
              expanded.value = next
            }}
          />
          <button data-after="">After</button>
        </div>
      </ConfigProvider>
    )
  }
  wrapper = await mount(<Harness />)
  return {
    props: {
      get items() {
        return props.value.items
      },
      set items(items: TreeNode[]) {
        props.value = { ...props.value, items }
      },
    },
    model,
    expanded,
    updates,
  }
}
const element = () => wrapper!.container.firstElementChild as HTMLElement
async function expand(name: string) {
  await userEvent.click(row(name).element().querySelector('[data-hn-tree-toggle]')!)
}

describe('Tree multi check', () => {
  it('checks collapsed descendants, paints mixed ancestors and keeps expansion separate from row selection', async () => {
    const demo = await render()
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
    await expectNoA11yViolations(element())
    await expand('Root')
    expect(row('Root').element().getAttribute('aria-checked')).toBe('mixed')
    await row('Root').click()
    expect(demo.model.value).toEqual(['root', 'branch', 'a', 'b', 'c'])
    await row('Root').click()
    expect(demo.model.value).toEqual([])
  })
  it('derives checked parents from externally supplied leaf values without emitting on mount or expansion', async () => {
    const demo = await render({ defaultExpanded: ['root', 'branch'] })
    demo.model.value = ['a', 'b']
    await tick()
    expect(row('Branch').element().getAttribute('aria-checked')).toBe('true')
    expect(row('Root').element().getAttribute('aria-checked')).toBe('mixed')
    await expand('Root')
    expect(demo.updates).not.toHaveBeenCalled()
    demo.model.value = []
    await tick()
    expect(row('Root').element().getAttribute('aria-checked')).toBe('false')
  })
  it('disabled subtrees do not change or prevent available siblings from fully checking their parent', async () => {
    const demo = await render({ defaultExpanded: ['root', 'disabled'] })
    demo.model.value = ['locked-child']
    await tick()
    expect(row('Locked child').element().getAttribute('aria-disabled')).toBe('true')
    row('Locked child')
      .element()
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    row('Disabled')
      .element()
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await tick()
    expect(demo.updates).not.toHaveBeenCalled()
    await row('Root').click()
    expect(demo.model.value).toEqual(['root', 'branch', 'a', 'b', 'c', 'locked-child'])
    expect(row('Root').element().getAttribute('aria-checked')).toBe('true')
    await row('Root').click()
    expect(demo.model.value).toEqual(['locked-child'])
  })
  it('reacts to replacement items and handles numeric and string keys independently', async () => {
    const demo = await render({
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
    await tick()
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
      const demo = await render({}, {}, rtl)
      await userEvent.click(element().querySelector('[data-before]')!)
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
      expect(document.activeElement).toBe(element().querySelector('[data-after]'))
    },
  )
  it.each([false, true])('entering children skips disabled nodes with rtl=%s', async rtl => {
    const demo = await render(
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
    await tick()
    await userEvent.keyboard(rtl ? '{ArrowLeft}' : '{ArrowRight}')
    expect(document.activeElement).toBe(row('Root').element())
  })

  it('supports controlled expansion and single selection without checkbox semantics', async () => {
    const demo = await render({ multiple: false, defaultExpanded: ['root'] })
    expect(row('Root').element().hasAttribute('aria-checked')).toBe(false)
    expect(row('Root').element().querySelector('[data-state]')).toBeNull()
    await row('Gamma').click()
    expect(demo.model.value).toBe('c')
    expect(row('Gamma').element().getAttribute('aria-selected')).toBe('true')
    await row('Gamma').click()
    expect(demo.model.value).toBeNull()
    demo.expanded.value = []
    await tick()
    expect(row('Root').element().getAttribute('aria-expanded')).toBe('false')
    await expectNoA11yViolations(element())
  })
  it('does not check or expand when the tree is globally disabled', async () => {
    const demo = await render({ disabled: true })
    row('Root')
      .element()
      .dispatchEvent(new MouseEvent('click', { bubbles: true }))
    row('Root').element().querySelector<HTMLElement>('[data-hn-tree-toggle]')!.click()
    await tick()
    expect(demo.model.value).toBeUndefined()
    expect(demo.expanded.value).toBeUndefined()
    expect(row('Root').element().getAttribute('aria-disabled')).toBe('true')
  })
  it('node and trailing slots receive current check, mixed, disabled and expanded states', async () => {
    const seen = new Map<TreeValue, TreeNodeSlot>()
    const demo = await render(
      { defaultExpanded: ['root'] },
      {
        renderNode: props => {
          seen.set(props.node.value, { ...props })
          return <span>{props.node.label}</span>
        },
        renderTrailing: props => (
          <span data-trailing={props.node.value}>
            {props.indeterminate ? 'Mixed' : props.selected ? 'Checked' : ''}
          </span>
        ),
      },
    )
    demo.model.value = ['a']
    await tick()
    expect(seen.get('root')).toMatchObject({
      selected: false,
      indeterminate: true,
      expanded: true,
      disabled: false,
    })
    expect(seen.get('disabled')?.disabled).toBe(true)
    expect(element().querySelector('[data-trailing="root"]')!.textContent).toBe('Mixed')
  })
  it('renders localized and custom empty states without invalid tree semantics', async () => {
    const demo = await render({ items: [] })
    expect(element().querySelector('[role="status"]')!.textContent).toBe('暂无节点')
    await expectNoA11yViolations(element())
    demo.props.items = [{ value: 'leaf', label: 'Leaf' }]
    await tick()
    expect(element().querySelector('[role="status"]')).toBeNull()
    await wrapper!.unmount()
    wrapper = undefined
    await render({ items: [] }, { empty: <span>Custom empty</span> })
    expect(element().querySelector('[role="status"]')!.textContent).toBe('Custom empty')
  })
  it('inherits accessible labels, descriptions and disabled state from FormField', async () => {
    wrapper = await mount(
      <FormField label="Tree field" description="Field description" disabled>
        <Tree items={nodes} multiple />
      </FormField>,
    )
    const tree = wrapper.container.querySelector('[role="tree"]')!
    expect(document.getElementById(tree.getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Tree field',
    )
    expect(tree.getAttribute('aria-describedby')).toBeTruthy()
    expect(tree.getAttribute('aria-disabled')).toBe('true')
    await expectNoA11yViolations(element())
  })
})
