import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import type { ReactNode } from 'react'
import { ConfigProvider } from '../config'
import { Tree } from '../../components/tree/Tree'
import type { TreeModel } from '../../components/tree/hooks/useTree'
import type { TreeNode, TreeValue } from '../../components/tree/types'
import { TreeSelect } from '../../components/tree-select/TreeSelect'
import { expectNoA11yViolations } from '../../../test/axe'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const children = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Node ${String(value).padStart(5, '0')}`,
  disabled: value === 0 || value === 9999,
}))
const items = [{ value: 'root', label: 'Root', children }]
const wrappers: Array<{ unmount: () => Promise<void> | void }> = []
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})
const rows = () => [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')]
async function mount(ui: ReactNode) {
  const host = document.body.appendChild(document.createElement('div'))
  const screen = await render(ui, { container: host })
  wrappers.push(screen)
  return host
}
async function ready() {
  await vi.waitFor(() => expect(document.querySelector('[data-hn-virtual-tree]')).not.toBeNull())
  await vi.waitFor(() =>
    expect(document.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
  )
  expect(rows().length).toBeLessThan(50)
}

describe('virtual trees', () => {
  it('restores the parent after external collapse without taking focus from another control', async () => {
    const props = signal<{ items: TreeNode[]; expanded: TreeValue[] }>({
      items,
      expanded: ['root'],
    })
    function Harness() {
      const current = props.use()
      return <Tree items={current.items} virtualize expanded={current.expanded} />
    }
    await mount(<Harness />)
    await ready()
    rows()[0]!.focus()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Node 09998'))
    props.value = { ...props.value, expanded: [] }
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Root'))
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    props.value = { ...props.value, items: [{ value: 'other', label: 'Other', children: [] }] }
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(document.activeElement).toBe(outside)
  })
  it.each(['ltr', 'rtl'] as const)(
    'navigates children, distant parents and disabled nodes in %s',
    async dir => {
      const model = signal<TreeModel>([])
      function Harness() {
        const value = model.use()
        return (
          <ConfigProvider dir={dir}>
            <Tree
              items={items}
              virtualize
              multiple
              value={value}
              aria-label="Nodes"
              onValueChange={next => {
                model.value = next
              }}
            />
          </ConfigProvider>
        )
      }
      const host = await mount(<Harness />)
      await ready()
      rows()[0]!.focus()
      const expand = dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}'
      const collapse = dir === 'rtl' ? '{ArrowRight}' : '{ArrowLeft}'
      await userEvent.keyboard(expand)
      await vi.waitFor(() => expect(rows()[0]!.getAttribute('aria-expanded')).toBe('true'))
      await userEvent.keyboard(expand)
      await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Node 00001'))
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Node 09998'))
      expect(document.activeElement?.getAttribute('aria-setsize')).toBe('10000')
      await userEvent.keyboard(' ')
      await vi.waitFor(() => expect(model.value).toEqual([9998]))
      await userEvent.keyboard(collapse)
      await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Root'))
      expect(document.activeElement?.getAttribute('aria-checked')).toBe('mixed')
      await userEvent.keyboard(collapse)
      await vi.waitFor(() => expect(rows()).toHaveLength(1))
      expect(rows()[0]!.getAttribute('aria-checked')).toBe('mixed')
      await expectNoA11yViolations(host.firstElementChild!)
    },
  )

  it('searches unmounted descendants and transfers focus from input to the actual first and last nodes', async () => {
    const emitted: unknown[] = []
    await mount(
      <TreeSelect
        items={items}
        virtualize
        searchable
        open
        defaultExpanded={['root']}
        aria-label="Nodes"
        onValueChange={value => emitted.push(value)}
      />,
    )
    await ready()
    const input = document.querySelector<HTMLInputElement>('[role="searchbox"]')!
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowUp}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Node 09998'))
    await userEvent.keyboard('{Home}{ArrowUp}')
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    await userEvent.fill(input, 'Node 07890')
    await vi.waitFor(() => expect(rows()).toHaveLength(2))
    await userEvent.keyboard('{ArrowUp}{Enter}')
    await vi.waitFor(() => expect(emitted.at(-1)).toEqual(7890))
  })
})
