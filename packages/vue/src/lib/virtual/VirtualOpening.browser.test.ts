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
    const area = wrapper.findComponent(ScrollArea)
    const root = area.element as HTMLElement
    const host = area.get<HTMLElement>('[data-overlayscrollbars-initialize]').element
    expect(area.vm.instance).toBeUndefined()
    expect(area.vm.viewport).toBe(host)
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
    }
    area.vm.viewport!.scrollTop += 600
    await frame()
    await frame()
    const before = visibleRows()
    expect(before).not.toContain('Item 7890')
    await frame()
    expect(area.vm.viewport).not.toBe(host)
    expect(visibleRows()).toEqual(before)
  },
)
