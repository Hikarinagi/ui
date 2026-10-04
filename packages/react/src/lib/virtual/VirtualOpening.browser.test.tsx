import { afterEach, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { OverlayScrollbars } from 'overlayscrollbars'
import { Select } from '../../components/select/Select'
import { MultiSelect } from '../../components/multi-select/MultiSelect'
import { Combobox } from '../../components/combobox/Combobox'
import { MultiCombobox } from '../../components/multi-combobox/MultiCombobox'
import { TreeSelect } from '../../components/tree-select/TreeSelect'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

let wrapper: { unmount: () => Promise<void> | void } | undefined
afterEach(async () => {
  await wrapper?.unmount()
  wrapper = undefined
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  delete document.documentElement.dataset.density
})

const options = Array.from({ length: 10000 }, (_, value) => ({ value, label: `Item ${value}` }))
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 0))
const flush = async () => {
  for (let index = 0; index < 5; index++) await Promise.resolve()
}

function scrollArea() {
  const element = document.querySelector<HTMLElement>(
    '[data-hn-select-content] .hn-scroll-area, [data-hn-combobox-content] .hn-scroll-area, [data-hn-tree-select-content] .hn-scroll-area',
  )
  return element
    ? {
        element,
        get instance() {
          return OverlayScrollbars(
            element.querySelector<HTMLElement>('[data-overlayscrollbars-initialize]')!,
          )
        },
        get viewport() {
          return this.instance?.elements().viewport
        },
      }
    : undefined
}

it.each(['Select', 'MultiSelect', 'Combobox', 'MultiCombobox', 'TreeSelect'] as const)(
  '%s renders the selected neighborhood with an initialized scrollbar from the first frame',
  async name => {
    const open = signal(false)
    function Harness() {
      const current = open.use()
      const shared = { virtualize: true, open: current, 'aria-label': 'Items', options }
      if (name === 'Select') return <Select {...shared} value={7890} />
      if (name === 'MultiSelect') return <MultiSelect {...shared} value={[7890]} />
      if (name === 'Combobox') return <Combobox {...shared} value={7890} />
      if (name === 'TreeSelect')
        return (
          <TreeSelect virtualize open={current} aria-label="Items" items={options} value={7890} />
        )
      return <MultiCombobox {...shared} value={[7890]} />
    }
    wrapper = await render(<Harness />)
    await tick()
    open.value = true
    await flush()
    let area = scrollArea()!
    let root = area.element
    const host = root.querySelector<HTMLElement>('[data-overlayscrollbars-initialize]')!
    expect(area.instance).toBeUndefined()
    expect(area.viewport).toBeUndefined()
    const visibleRows = () => {
      const viewport = area.viewport!
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
      expect(area.instance).toBeDefined()
      expect(area.viewport?.hasAttribute('data-overlayscrollbars-viewport')).toBe(true)
      expect(visibleRows().length).toBeGreaterThan(4)
      expect(visibleRows()).toContain('Item 7890')
      expect(area.element.querySelectorAll('[data-index]').length).toBeLessThan(50)
      const selected = root
        .querySelector<HTMLElement>('[data-index="7890"]')!
        .getBoundingClientRect()
      const viewport = area.viewport!.getBoundingClientRect()
      expect(selected.top).toBeGreaterThanOrEqual(viewport.top - 1)
      expect(selected.bottom).toBeLessThanOrEqual(viewport.bottom + 1)
      if (index > 1)
        expect(
          Math.abs(selected.top + selected.height / 2 - viewport.top - viewport.height / 2),
        ).toBeLessThan(1)
    }
    const offset = area.viewport!.scrollTop
    root
      .querySelector<HTMLElement>('[data-index="7890"] [role]')!
      .dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    await frame()
    await frame()
    expect(Math.abs(area.viewport!.scrollTop - offset)).toBeLessThan(1)
    area.viewport!.scrollTop += 600
    await frame()
    await frame()
    const before = visibleRows()
    expect(before).not.toContain('Item 7890')
    await frame()
    expect(area.viewport).not.toBe(host)
    expect(visibleRows()).toEqual(before)
    open.value = false
    await tick()
    await vi.waitFor(() => expect(root.isConnected).toBe(false))
    open.value = true
    await vi.waitFor(() => expect(scrollArea()).toBeDefined())
    area = scrollArea()!
    root = area.element
    for (let index = 0; index < 4; index++) await frame()
    const selected = root.querySelector<HTMLElement>('[data-index="7890"]')!.getBoundingClientRect()
    const viewport = area.viewport!.getBoundingClientRect()
    expect(
      Math.abs(selected.top + selected.height / 2 - viewport.top - viewport.height / 2),
    ).toBeLessThan(1)
  },
)

it.each([0, 9999])(
  'keeps selected index %i fully visible at the scroll boundary',
  async modelValue => {
    wrapper = await render(
      <Select options={options} value={modelValue} virtualize open aria-label="Items" />,
    )
    await tick()
    for (let index = 0; index < 5; index++) await frame()
    const area = scrollArea()!
    const row = area.element
      .querySelector<HTMLElement>(`[data-index="${modelValue}"]`)!
      .getBoundingClientRect()
    const viewport = area.viewport!
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
    wrapper = await render(
      <Select
        options={grouped}
        value={7890}
        virtualize={{ estimateSize: 32 }}
        open
        aria-label="Items"
      />,
    )
    await tick()
    for (let index = 0; index < 6; index++) await frame()
    const area = scrollArea()!
    const row = area.element
      .querySelector<HTMLElement>('[role="option"][data-state="checked"]')!
      .getBoundingClientRect()
    const viewport = area.viewport!.getBoundingClientRect()
    expect(Math.abs(row.top + row.height / 2 - viewport.top - viewport.height / 2)).toBeLessThan(1)
    expect(row.top).toBeGreaterThanOrEqual(viewport.top)
    expect(row.bottom).toBeLessThanOrEqual(viewport.bottom)
    expect(area.element.querySelectorAll('[role="option"]').length).toBeLessThan(50)
  },
)
