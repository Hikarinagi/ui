import { afterEach, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { flushSync } from 'react-dom'
import { hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
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
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

let app: Root | undefined
afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

function hydrate(host: HTMLElement, element: ReactElement, warnings: string[]) {
  flushSync(() => {
    app = hydrateRoot(host, element, {
      onRecoverableError: error => warnings.push(String(error)),
    })
  })
}

it.each(['Listbox', 'Tree', 'CommandPalette', 'DataTable'] as const)(
  '%s hydrates a visible bounded collection and retains the server-rendered nodes',
  async name => {
    const render = {
      Listbox: () => <Listbox options={options} virtualize value={7890} />,
      Tree: () => <Tree items={options} virtualize value={7890} />,
      CommandPalette: () => (
        <CommandPalette
          items={options.map(option => ({ id: String(option.value), label: option.label }))}
          virtualize
          inline
        />
      ),
      DataTable: () => (
        <DataTable<(typeof options)[number]>
          rows={options}
          columns={[{ key: 'label', label: 'Name' }]}
          rowKey="value"
          virtualize
        />
      ),
    }[name]
    const warnings: string[] = []
    const errors = vi.spyOn(console, 'error')
    const host = document.createElement('div')
    host.style.width = '400px'
    host.innerHTML = renderToString(render())
    document.body.append(host)
    const selector = '[role="option"], [role="treeitem"], [data-hn-row]'
    const rows = [...host.querySelectorAll<HTMLElement>(selector)]
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(50)
    expect(rows[0]!.textContent).toContain('Item 0')
    const area = host.querySelector<HTMLElement>('.hn-scroll-area')!
    const initial = area.getBoundingClientRect()
    expect(rows[0]!.getBoundingClientRect().top).toBeLessThan(initial.bottom)
    hydrate(host, render(), warnings)
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
    const open = signal(initialOpen)
    function Harness({ server = false }: { server?: boolean }) {
      const current = server ? initialOpen : open.use()
      const shared = { virtualize: true, 'aria-label': 'Items', options, open: current }
      if (name === 'Select') return <Select {...shared} value={7890} />
      if (name === 'MultiSelect') return <MultiSelect {...shared} value={[7890]} />
      if (name === 'Combobox') return <Combobox {...shared} value={7890} />
      if (name === 'TreeSelect')
        return (
          <TreeSelect virtualize aria-label="Items" items={options} open={current} value={7890} />
        )
      return <MultiCombobox {...shared} value={[7890]} />
    }
    const warnings: string[] = []
    const errors = vi.spyOn(console, 'error')
    const host = document.createElement('div')
    host.style.width = '320px'
    host.innerHTML = renderToString(<Harness server />)
    document.body.append(host)
    const trigger = host.querySelector('[role="combobox"]')!
    expect(host.innerHTML).toContain('Item 7890')
    hydrate(host, <Harness />, warnings)
    expect(host.querySelector('[role="combobox"]')).toBe(trigger)
    await Promise.resolve()
    open.value = true
    await Promise.resolve()
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
