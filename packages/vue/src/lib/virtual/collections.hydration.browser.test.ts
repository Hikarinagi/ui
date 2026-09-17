import { afterEach, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick, ref, type App } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  Select,
  MultiSelect,
  Combobox,
  MultiCombobox,
  Listbox,
  CommandPalette,
  Tree,
  TreeSelect,
  DataTable,
} from '../../index'
import '../../../test/browser.css'

let app: App | undefined
afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

it.each(['Listbox', 'Tree', 'CommandPalette', 'DataTable'] as const)(
  '%s hydrates a visible bounded collection and retains the server-rendered nodes',
  async name => {
    const render = {
      Listbox: () => h(Listbox, { options, virtualize: true, modelValue: 7890 }),
      Tree: () => h(Tree, { items: options, virtualize: true, modelValue: 7890 }),
      CommandPalette: () =>
        h(CommandPalette, {
          items: options.map(option => ({ id: String(option.value), label: option.label })),
          virtualize: true,
          inline: true,
        }),
      DataTable: () =>
        h(DataTable<(typeof options)[number]>, {
          rows: options,
          columns: [{ key: 'label', label: 'Name' }],
          rowKey: 'value',
          virtualize: true,
        }),
    }[name]
    const warnings: string[] = []
    const errors = vi.spyOn(console, 'error')
    const host = document.createElement('div')
    host.style.width = '400px'
    host.innerHTML = await renderToString(createSSRApp({ render }))
    document.body.append(host)
    const selector = '[role="option"], [role="treeitem"], [data-hn-row]'
    const rows = [...host.querySelectorAll<HTMLElement>(selector)]
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(50)
    expect(rows[0]!.textContent).toContain('Item 0')
    const area = host.querySelector<HTMLElement>('.hn-scroll-area')!
    const initial = area.getBoundingClientRect()
    expect(rows[0]!.getBoundingClientRect().top).toBeLessThan(initial.bottom)
    app = createSSRApp({ render })
    app.config.warnHandler = message => warnings.push(message)
    app.mount(host)
    const hydrated = [...host.querySelectorAll(selector)]
    expect(hydrated).toHaveLength(rows.length)
    hydrated.forEach((row, index) => expect(row).toBe(rows[index]))
    for (let index = 0; index < 6; index++) await frame()
    const viewport = host.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
    expect(viewport).not.toBeNull()
    const visible = [...host.querySelectorAll<HTMLElement>(selector)].filter(row => {
      const rect = row.getBoundingClientRect()
      const bounds = viewport.getBoundingClientRect()
      return rect.bottom > bounds.top && rect.top < bounds.bottom
    })
    expect(visible.length).toBeGreaterThan(3)
    if (name === 'Listbox' || name === 'Tree')
      expect(visible.some(row => row.textContent?.includes('Item 7890'))).toBe(true)
    expect(host.querySelectorAll(selector).length).toBeLessThan(50)
    expect(warnings).toEqual([])
    expect(errors).not.toHaveBeenCalled()
  },
)

it.each(
  (['Select', 'MultiSelect', 'Combobox', 'MultiCombobox', 'TreeSelect'] as const).flatMap(name =>
    [false, true].map(initialOpen => ({ name, initialOpen })),
  ),
)(
  '$name hydrates its selected label and opens at the selected neighborhood (open=$initialOpen)',
  async ({ name, initialOpen }) => {
    const open = ref(initialOpen)
    const shared = { virtualize: true, 'aria-label': 'Items' }
    const render = {
      Select: () => h(Select, { ...shared, options, modelValue: 7890, open: open.value }),
      MultiSelect: () =>
        h(MultiSelect, { ...shared, options, modelValue: [7890], open: open.value }),
      Combobox: () => h(Combobox, { ...shared, options, modelValue: 7890, open: open.value }),
      MultiCombobox: () =>
        h(MultiCombobox, { ...shared, options, modelValue: [7890], open: open.value }),
      TreeSelect: () =>
        h(TreeSelect, { ...shared, items: options, modelValue: 7890, open: open.value }),
    }[name]
    const warnings: string[] = []
    const errors = vi.spyOn(console, 'error')
    const host = document.createElement('div')
    host.style.width = '320px'
    host.innerHTML = await renderToString(createSSRApp({ render }))
    document.body.append(host)
    const trigger = host.querySelector('[role="combobox"]')!
    expect(host.innerHTML).toContain('Item 7890')
    app = createSSRApp({ render })
    app.config.warnHandler = message => warnings.push(message)
    app.mount(host)
    expect(host.querySelector('[role="combobox"]')).toBe(trigger)
    await nextTick()
    open.value = true
    await nextTick()
    for (let index = 0; index < 6; index++) await frame()
    const selected = document.querySelector<HTMLElement>('[data-index="7890"]')!
    expect(selected).not.toBeNull()
    const viewport = selected
      .closest('.hn-scroll-area')!
      .querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
    const bounds = viewport.getBoundingClientRect()
    const rect = selected.getBoundingClientRect()
    expect(Math.abs(rect.top + rect.height / 2 - bounds.top - bounds.height / 2)).toBeLessThan(1)
    expect(document.querySelectorAll('[data-index]').length).toBeLessThan(50)
    expect(warnings).toEqual([])
    expect(errors).not.toHaveBeenCalled()
  },
)
