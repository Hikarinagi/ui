import { afterEach, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import Select from '../../components/select/Select.vue'
import MultiSelect from '../../components/multi-select/MultiSelect.vue'
import Combobox from '../../components/combobox/Combobox.vue'
import MultiCombobox from '../../components/multi-combobox/MultiCombobox.vue'
import TreeSelect from '../../components/tree-select/TreeSelect.vue'
import ScrollArea from '../../components/scroll-area/ScrollArea.vue'
import '../../../test/browser.css'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  delete document.documentElement.dataset.density
})

const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

it.each(['Select', 'MultiSelect', 'Combobox', 'MultiCombobox', 'TreeSelect'] as const)(
  '%s renders the selected neighborhood with an initialized scrollbar from the first frame',
  async name => {
    const open = ref(false)
    const shared = {
      virtualize: true,
      get open() {
        return open.value
      },
      'aria-label': 'Items',
    }
    const render = {
      Select: () => h(Select, { ...shared, options, modelValue: 7890 }),
      MultiSelect: () => h(MultiSelect, { ...shared, options, modelValue: [7890] }),
      Combobox: () => h(Combobox, { ...shared, options, modelValue: 7890 }),
      MultiCombobox: () => h(MultiCombobox, { ...shared, options, modelValue: [7890] }),
      TreeSelect: () => h(TreeSelect, { ...shared, items: options, modelValue: 7890 }),
    }[name]
    wrapper = mount(
      { render },
      { attachTo: document.body, global: { stubs: { transition: false } } },
    )
    await nextTick()
    open.value = true
    await nextTick()
    let area = wrapper.findComponent(ScrollArea)
    let root = area.element as HTMLElement
    const host = area.get<HTMLElement>('[data-overlayscrollbars-initialize]').element
    expect(area.vm.instance).toBeUndefined()
    expect(area.vm.viewport).toBeUndefined()
    const visibleRows = () => {
      const viewport = area.vm.viewport!
      const rect = viewport.getBoundingClientRect()
      return [...root.querySelectorAll<HTMLElement>('[role="option"], [role="treeitem"]')]
        .filter(row => {
          const box = row.getBoundingClientRect()
          return box.bottom > rect.top && box.top < rect.bottom
        })
        .map(row => row.textContent?.trim())
    }
    for (let index = 0; index < 6; index++) {
      await frame()
      expect(area.vm.instance).toBeDefined()
      expect(area.vm.viewport?.hasAttribute('data-overlayscrollbars-viewport')).toBe(true)
      expect(visibleRows().length).toBeGreaterThan(4)
      expect(visibleRows()).toContain('Item 7890')
      expect(area.element.querySelectorAll('[data-index]').length).toBeLessThan(50)
      const selected = root
        .querySelector<HTMLElement>('[data-index="7890"]')!
        .getBoundingClientRect()
      const viewport = area.vm.viewport!.getBoundingClientRect()
      expect(selected.top).toBeGreaterThanOrEqual(viewport.top - 1)
      expect(selected.bottom).toBeLessThanOrEqual(viewport.bottom + 1)
      if (index > 1)
        expect(
          Math.abs(selected.top + selected.height / 2 - viewport.top - viewport.height / 2),
        ).toBeLessThan(1)
    }
    const offset = area.vm.viewport!.scrollTop
    root
      .querySelector<HTMLElement>('[data-index="7890"] [role]')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    await frame()
    await frame()
    expect(Math.abs(area.vm.viewport!.scrollTop - offset)).toBeLessThan(1)
    area.vm.viewport!.scrollTop += 600
    await frame()
    await frame()
    const before = visibleRows()
    expect(before).not.toContain('Item 7890')
    await frame()
    expect(area.vm.viewport).not.toBe(host)
    expect(visibleRows()).toEqual(before)
    open.value = false
    await nextTick()
    await vi.waitFor(() => expect(root.isConnected).toBe(false))
    open.value = true
    await nextTick()
    area = wrapper.findComponent(ScrollArea)
    root = area.element as HTMLElement
    for (let index = 0; index < 4; index++) await frame()
    const selected = root.querySelector<HTMLElement>('[data-index="7890"]')!.getBoundingClientRect()
    const viewport = area.vm.viewport!.getBoundingClientRect()
    expect(
      Math.abs(selected.top + selected.height / 2 - viewport.top - viewport.height / 2),
    ).toBeLessThan(1)
  },
)

it.each([0, 9999])(
  'keeps selected index %i fully visible at the scroll boundary',
  async modelValue => {
    wrapper = mount(Select, {
      attachTo: document.body,
      props: { options, modelValue, virtualize: true, open: true },
      attrs: { 'aria-label': 'Items' },
      global: { stubs: { transition: false } },
    })
    await nextTick()
    for (let index = 0; index < 5; index++) await frame()
    const area = wrapper.findComponent(ScrollArea)
    const row = (area.element as HTMLElement)
      .querySelector<HTMLElement>(`[data-index="${modelValue}"]`)!
      .getBoundingClientRect()
    const viewport = area.vm.viewport!
    const bounds = viewport.getBoundingClientRect()
    expect(row.top).toBeGreaterThanOrEqual(bounds.top - 1)
    expect(row.bottom).toBeLessThanOrEqual(bounds.bottom + 1)
    expect(
      Math.abs(
        viewport.scrollTop - (modelValue === 0 ? 0 : viewport.scrollHeight - viewport.clientHeight),
      ),
    ).toBeLessThan(1)
  },
)

it.each(['comfortable', 'compact'])(
  'centers a measured item with grouped variable-height rows in %s density',
  async density => {
    document.documentElement.dataset.density = density
    const grouped = Array.from({ length: 1000 }, (_, group) => ({
      label: `Group ${group}`,
      options: options.slice(group * 10, group * 10 + 10).map(option => ({
        ...option,
        description: option.value % 2 === 0 ? 'Description' : undefined,
      })),
    }))
    wrapper = mount(Select, {
      attachTo: document.body,
      props: { options: grouped, modelValue: 7890, virtualize: { estimateSize: 32 }, open: true },
      attrs: { 'aria-label': 'Items' },
      global: { stubs: { transition: false } },
    })
    await nextTick()
    for (let index = 0; index < 6; index++) await frame()
    const area = wrapper.findComponent(ScrollArea)
    const row = (area.element as HTMLElement)
      .querySelector<HTMLElement>('[role="option"][data-state="checked"]')!
      .getBoundingClientRect()
    const viewport = area.vm.viewport!.getBoundingClientRect()
    expect(Math.abs(row.top + row.height / 2 - viewport.top - viewport.height / 2)).toBeLessThan(1)
    expect(row.top).toBeGreaterThanOrEqual(viewport.top)
    expect(row.bottom).toBeLessThanOrEqual(viewport.bottom)
    expect(area.element.querySelectorAll('[role="option"]').length).toBeLessThan(50)
  },
)
