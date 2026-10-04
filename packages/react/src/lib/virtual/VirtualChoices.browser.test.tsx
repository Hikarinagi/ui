import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import axe from 'axe-core'
import { Select } from '../../components/select/Select'
import { MultiSelect } from '../../components/multi-select/MultiSelect'
import { Listbox, type ListboxValue } from '../../components/listbox/Listbox'
import { Combobox } from '../../components/combobox/Combobox'
import {
  MultiCombobox,
  type MultiComboboxProps,
} from '../../components/multi-combobox/MultiCombobox'
import { CommandPalette } from '../../components/command-palette/CommandPalette'
import type { SelectOption } from '../../components/select/types'
import { expectNoA11yViolations } from '../../../test/axe'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

const options = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Item ${String(value).padStart(5, '0')}`,
  disabled: value === 0 || value === 9999,
}))
const wrappers: Array<{ unmount: () => Promise<void> | void }> = []
afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})
const rows = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')]
const active = () => document.querySelector<HTMLElement>('[role="option"][data-highlighted]')
async function mount(ui: ReactNode, container?: HTMLElement) {
  const host = container ?? document.body.appendChild(document.createElement('div'))
  const screen = await render(ui, { container: host })
  wrappers.push(screen)
  return host
}
function setValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
async function ready() {
  await vi.waitFor(() => expect(document.querySelector('[data-hn-virtual-choices]')).not.toBeNull())
  await vi.waitFor(() =>
    expect(document.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
  )
  expect(rows().length).toBeLessThan(50)
}

async function expectPopupStructure(element: Element) {
  const result = await axe.run(element, {
    runOnly: ['aria-required-children', 'aria-required-parent', 'aria-valid-attr-value'],
  })
  expect(result.violations).toEqual([])
}

describe('virtual choice lists', () => {
  it('finds an unmounted typeahead match and keeps native Space selection after the search expires', async () => {
    const emitted: ListboxValue[] = []
    const host = await mount(
      <Listbox
        options={[...options.slice(0, 9998), { value: 9998, label: 'Zebra' }]}
        virtualize
        onValueChange={value => emitted.push(value)}
      />,
    )
    await ready()
    host.querySelector<HTMLElement>('[role="listbox"]')!.focus()
    await userEvent.keyboard('z')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Zebra'))
    const now = Date.now()
    const clock = vi.spyOn(Date, 'now').mockReturnValue(now + 1100)
    try {
      await userEvent.keyboard(' ')
      await vi.waitFor(() => expect([emitted.at(-1)]).toEqual([9998]))
    } finally {
      clock.mockRestore()
    }
  })
  it('keeps grouped labels and accessible positions without mounting every group', async () => {
    const grouped = Array.from({ length: 1000 }, (_, group) => ({
      label: `Group ${group}`,
      options: options.slice(group * 10, group * 10 + 10),
    }))
    const host = await mount(<Listbox options={grouped} virtualize aria-label="Items" />)
    await ready()
    host.querySelector<HTMLElement>('[role="listbox"]')!.focus()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(active()?.textContent).toContain('Item 09998'))
    expect(active()?.getAttribute('aria-posinset')).toBe('9999')
    expect(active()?.getAttribute('aria-setsize')).toBe('10000')
    expect(document.getElementById(active()!.getAttribute('aria-describedby')!)?.textContent).toBe(
      'Group 999',
    )
    expect(host.querySelectorAll('[data-index]').length).toBeLessThan(50)
    await expectNoA11yViolations(host.firstElementChild!)
  })

  it('updates remote results without inserting selected data, recovers from empty results and restores ordinary rendering', async () => {
    const props = signal<Partial<MultiComboboxProps>>({
      options,
      virtualize: true,
      ignoreFilter: true,
    })
    const emitted: Array<Array<string | number>> = []
    function Harness() {
      const current = props.use()
      return (
        <MultiCombobox
          options={options}
          {...current}
          defaultOpen
          defaultValue={[-1]}
          selectedOptions={[{ value: -1, label: 'Selected remotely' }]}
          onValueChange={value => emitted.push(value)}
          aria-label="Items"
        />
      )
    }
    const host = await mount(<Harness />)
    await ready()
    expect(host.textContent).toContain('Selected remotely')
    expect(rows().some(row => row.textContent?.includes('Selected remotely'))).toBe(false)
    const input = host.querySelector('input')!
    await userEvent.click(input)
    await userEvent.keyboard('{End}')
    props.value = { ...props.value, options: [] }
    await vi.waitFor(() => expect(rows()).toHaveLength(0))
    props.value = { ...props.value, options: [{ value: 42, label: 'Replacement' }] }
    await vi.waitFor(() => expect(rows()).toHaveLength(1))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await vi.waitFor(() => expect([emitted.at(-1)]).toEqual([[-1, 42]]))
    props.value = { virtualize: undefined, ignoreFilter: false, options: options.slice(1, 4) }
    await vi.waitFor(() => expect(rows()).toHaveLength(3))
    expect(document.querySelector('[data-hn-virtual-choices]')).toBeNull()
    setValue(input, '00002')
    await vi.waitFor(() =>
      expect(rows().filter(row => getComputedStyle(row).display !== 'none')).toHaveLength(1),
    )
  })

  it.each([
    { name: 'Select', value: 9500, expected: ['9500'] },
    {
      name: 'MultiSelect',
      value: [5000, 9500],
      expected: ['5000', '9500'],
    },
  ])(
    'submits offscreen values from $name without rendering thousands of native options',
    async ({ name, value, expected }) => {
      const form = document.createElement('form')
      document.body.append(form)
      await mount(
        name === 'Select' ? (
          <Select
            options={options}
            virtualize
            name="items"
            value={value as number}
            aria-label="Items"
          />
        ) : (
          <MultiSelect
            options={options}
            virtualize
            name="items"
            value={value as number[]}
            aria-label="Items"
          />
        ),
        form,
      )
      await vi.waitFor(() => expect(new FormData(form).getAll('items')).toEqual(expected))
      expect(form.querySelectorAll('option').length).toBeLessThan(50)
      await expectNoA11yViolations(form)
    },
  )

  it('measures custom row heights and keeps a focused row alive during scrolling', async () => {
    const height = signal(48)
    function Row({ option }: { option: SelectOption }) {
      const current = height.use()
      return (
        <span
          style={{ display: 'block', height: `${current + (Number(option.value) % 2) * 12}px` }}
        >
          {option.label}
        </span>
      )
    }
    const host = await mount(
      <Listbox
        options={options}
        virtualize
        renderOption={({ option }) => <Row option={option} />}
      />,
    )
    await ready()
    host.querySelector<HTMLElement>('[role="listbox"]')!.focus()
    await userEvent.keyboard('{Home}')
    const focused = document.activeElement
    const viewport = host.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
    viewport.scrollTop = 30000
    await vi.waitFor(() =>
      expect(
        Math.max(
          ...[...host.querySelectorAll('[data-index]')].map(row =>
            Number(row.getAttribute('data-index')),
          ),
        ),
      ).toBeGreaterThan(100),
    )
    expect(focused?.isConnected).toBe(true)
    expect(document.activeElement).toBe(focused)
    height.value = 72
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Item 09998'))
    await vi.waitFor(() => {
      const rect = document.activeElement!.getBoundingClientRect()
      const bounds = viewport.getBoundingClientRect()
      expect(rect.bottom).toBeLessThanOrEqual(bounds.bottom + 1)
      expect(rect.top).toBeGreaterThanOrEqual(bounds.top - 1)
    })
    expect(rows().length).toBeLessThan(50)
  })
  it('opens Select at a distant selected item and navigates the complete enabled set', async () => {
    const value = signal<string | number | null | undefined>(9500)
    function Harness() {
      const current = value.use()
      return (
        <Select
          options={options}
          virtualize
          open
          value={current}
          onValueChange={next => {
            value.value = next
          }}
        />
      )
    }
    await mount(<Harness />)
    await ready()
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Item 09500'))
    await expectPopupStructure(document.querySelector('[data-hn-select-content]')!)
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Item 00001'))
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Item 09998'))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(value.value).toBe(9998))
    expect(rows().length).toBeLessThan(50)
  })

  it.each([
    { name: 'Combobox', multiple: false },
    { name: 'MultiCombobox', multiple: true },
  ])('searches unmounted options with $name', async ({ multiple }) => {
    const emitted: unknown[] = []
    const host = await mount(
      multiple ? (
        <MultiCombobox
          options={options}
          virtualize
          defaultOpen
          onValueChange={value => emitted.push(value)}
        />
      ) : (
        <Combobox
          options={options}
          virtualize
          defaultOpen
          onValueChange={value => emitted.push(value)}
        />
      ),
    )
    await ready()
    const input = host.querySelector('input')!
    await expectPopupStructure(document.querySelector('[role="listbox"]')!)
    setValue(input, 'Item 09998')
    await vi.waitFor(() => expect(rows()).toHaveLength(1))
    expect(rows()[0]!.textContent).toContain('Item 09998')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await vi.waitFor(() => expect(emitted.at(-1)).toEqual(multiple ? [9998] : 9998))
  })

  it('searches command keywords across the complete collection and selects by keyboard', async () => {
    const onSelect = vi.fn()
    const host = await mount(
      <CommandPalette
        inline
        virtualize
        label="Commands"
        items={options.map(option => ({
          id: String(option.value),
          label: option.label,
          keywords: [`keyword-${option.value}`],
          disabled: option.disabled,
        }))}
        onSelect={onSelect}
      />,
    )
    await ready()
    const input = host.querySelector('input')!
    await userEvent.click(input)
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(active()?.textContent).toContain('Item 09998'))
    expect(input.getAttribute('aria-activedescendant')).toBe(active()?.id)
    setValue(input, 'keyword-7890')
    await vi.waitFor(() => expect(rows()).toHaveLength(1))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() =>
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '7890' })),
    )
  })

  it('retains MultiSelect values while navigating and selecting distant options', async () => {
    const value = signal<Array<string | number>>([5000])
    function Harness() {
      const current = value.use()
      return (
        <MultiSelect
          options={options}
          virtualize
          open
          value={current}
          onValueChange={next => {
            value.value = next
          }}
        />
      )
    }
    await mount(<Harness />)
    await ready()
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Item 05000'))
    await userEvent.keyboard('{End}{Enter}')
    await vi.waitFor(() => expect(value.value).toEqual([5000, 9998]))
    expect(rows().length).toBeLessThan(50)
  })

  it('navigates Listbox beyond the window and selects all enabled options', async () => {
    const value = signal<ListboxValue>([])
    function Harness() {
      const current = value.use()
      return (
        <Listbox
          options={options}
          virtualize
          multiple
          value={current}
          onValueChange={next => {
            value.value = next
          }}
        />
      )
    }
    const host = await mount(<Harness />)
    await ready()
    host.querySelector<HTMLElement>('[role="listbox"]')!.focus()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(active()?.textContent).toContain('Item 09998'))
    await userEvent.keyboard('{ControlOrMeta>}a{/ControlOrMeta}')
    await vi.waitFor(() => expect(value.value).toHaveLength(9998))
    expect(value.value).not.toContain(0)
    expect(value.value).not.toContain(9999)
  })
})
