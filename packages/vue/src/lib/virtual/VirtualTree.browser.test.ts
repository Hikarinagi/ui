import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { ConfigProvider } from 'reka-ui'
import { userEvent } from 'vitest/browser'
import Tree from '../../components/tree/Tree.vue'
import TreeSelect from '../../components/tree-select/TreeSelect.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

const children = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Node ${String(value).padStart(5, '0')}`,
  disabled: value === 0 || value === 9999,
}))
const items = [{ value: 'root', label: 'Root', children }]
const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})
const rows = () => [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')]
async function ready() {
  await vi.waitFor(() => expect(document.querySelector('[data-hn-virtual-tree]')).not.toBeNull())
  await vi.waitFor(() =>
    expect(document.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
  )
  expect(rows().length).toBeLessThan(50)
}

describe('virtual trees', () => {
  it('restores the parent after external collapse without taking focus from another control', async () => {
    const wrapper = mount(Tree, {
      attachTo: document.body,
      props: { items, virtualize: true, expanded: ['root'] },
    })
    wrappers.push(wrapper)
    await ready()
    rows()[0]!.focus()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Node 09998'))
    await wrapper.setProps({ expanded: [] })
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Root'))
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    await wrapper.setProps({ items: [{ value: 'other', label: 'Other', children: [] }] })
    expect(document.activeElement).toBe(outside)
  })
  it.each(['ltr', 'rtl'] as const)(
    'navigates children, distant parents and disabled nodes in %s',
    async dir => {
      const model = ref<Array<string | number>>([])
      const wrapper = mount(
        defineComponent(
          () => () =>
            h(ConfigProvider, { dir }, () =>
              h(Tree, {
                items,
                virtualize: true,
                multiple: true,
                modelValue: model.value,
                'aria-label': 'Nodes',
                'onUpdate:modelValue': value => {
                  model.value = value as number[]
                },
              }),
            ),
        ),
        { attachTo: document.body },
      )
      wrappers.push(wrapper)
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
      await expectNoA11yViolations(wrapper.element)
    },
  )

  it('searches unmounted descendants and transfers focus from input to the actual first and last nodes', async () => {
    const wrapper = mount(TreeSelect, {
      attachTo: document.body,
      props: { items, virtualize: true, searchable: true, open: true, defaultExpanded: ['root'] },
      attrs: { 'aria-label': 'Nodes' },
    })
    wrappers.push(wrapper)
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
    await vi.waitFor(() => expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([7890]))
  })
})
