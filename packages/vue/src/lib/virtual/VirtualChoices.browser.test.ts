import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { userEvent } from 'vitest/browser'
import Select from '../../components/select/Select.vue'
import MultiSelect from '../../components/multi-select/MultiSelect.vue'
import Combobox from '../../components/combobox/Combobox.vue'
import MultiCombobox from '../../components/multi-combobox/MultiCombobox.vue'
import type { SelectOption } from '../../components/select/types'
import Listbox from '../../components/listbox/Listbox.vue'
import CommandPalette from '../../components/command-palette/CommandPalette.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import axe from 'axe-core'
import '../../../test/browser.css'

const options = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Item ${String(value).padStart(5, '0')}`,
  disabled: value === 0 || value === 9999,
}))
const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})
const rows = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')]
const active = () => document.querySelector<HTMLElement>('[role="option"][data-highlighted]')
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
    const wrapper = mount(Listbox, {
      attachTo: document.body,
      props: {
        options: [...options.slice(0, 9998), { value: 9998, label: 'Zebra' }],
        virtualize: true,
      },
    })
    wrappers.push(wrapper)
    await ready()
    wrapper.get<HTMLElement>('[role="listbox"]').element.focus()
    await userEvent.keyboard('z')
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Zebra'))
    const now = Date.now()
    const clock = vi.spyOn(Date, 'now').mockReturnValue(now + 1100)
    try {
      await userEvent.keyboard(' ')
      await vi.waitFor(() => expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([9998]))
    } finally {
      clock.mockRestore()
    }
  })
  it('keeps grouped labels and accessible positions without mounting every group', async () => {
    const grouped = Array.from({ length: 1000 }, (_, group) => ({
      label: `Group ${group}`,
      options: options.slice(group * 10, group * 10 + 10),
    }))
    const wrapper = mount(Listbox, {
      attachTo: document.body,
      props: { options: grouped, virtualize: true },
      attrs: { 'aria-label': 'Items' },
    })
    wrappers.push(wrapper)
    await ready()
    wrapper.get<HTMLElement>('[role="listbox"]').element.focus()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(active()?.textContent).toContain('Item 09998'))
    expect(active()?.getAttribute('aria-posinset')).toBe('9999')
    expect(active()?.getAttribute('aria-setsize')).toBe('10000')
    expect(document.getElementById(active()!.getAttribute('aria-describedby')!)?.textContent).toBe(
      'Group 999',
    )
    expect(wrapper.findAll('[data-index]').length).toBeLessThan(50)
    await expectNoA11yViolations(wrapper.element)
  })

  it('updates remote results without inserting selected data, recovers from empty results and restores ordinary rendering', async () => {
    const wrapper = mount(MultiCombobox, {
      attachTo: document.body,
      props: {
        options,
        virtualize: true,
        ignoreFilter: true,
        open: true,
        modelValue: [-1],
        selectedOptions: [{ value: -1, label: 'Selected remotely' }],
      },
      attrs: { 'aria-label': 'Items' },
    })
    wrappers.push(wrapper)
    await ready()
    expect(wrapper.text()).toContain('Selected remotely')
    expect(rows().some(row => row.textContent?.includes('Selected remotely'))).toBe(false)
    const input = wrapper.get('input')
    await userEvent.click(input.element)
    await userEvent.keyboard('{End}')
    await wrapper.setProps({ options: [] })
    await vi.waitFor(() => expect(rows()).toHaveLength(0))
    await wrapper.setProps({ options: [{ value: 42, label: 'Replacement' }] })
    await vi.waitFor(() => expect(rows()).toHaveLength(1))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await vi.waitFor(() => expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[-1, 42]]))
    await wrapper.setProps({ virtualize: false, ignoreFilter: false, options: options.slice(1, 4) })
    await vi.waitFor(() => expect(rows()).toHaveLength(3))
    expect(document.querySelector('[data-hn-virtual-choices]')).toBeNull()
    await input.setValue('00002')
    await vi.waitFor(() =>
      expect(rows().filter(row => getComputedStyle(row).display !== 'none')).toHaveLength(1),
    )
  })

  it.each([
    { name: 'Select', Component: Select, value: 9500, expected: ['9500'] },
    {
      name: 'MultiSelect',
      Component: MultiSelect,
      value: [5000, 9500],
      expected: ['5000', '9500'],
    },
  ])(
    'submits offscreen values from $name without rendering thousands of native options',
    async ({ Component, value, expected }) => {
      const wrapper = mount(
        defineComponent(
          () => () =>
            h('form', [
              Component === Select
                ? h(Select, {
                    options,
                    virtualize: true,
                    name: 'items',
                    modelValue: value as number,
                    'aria-label': 'Items',
                  })
                : h(MultiSelect, {
                    options,
                    virtualize: true,
                    name: 'items',
                    modelValue: value as number[],
                    'aria-label': 'Items',
                  }),
            ]),
        ),
        { attachTo: document.body },
      )
      wrappers.push(wrapper)
      await vi.waitFor(() =>
        expect(new FormData(wrapper.element as HTMLFormElement).getAll('items')).toEqual(expected),
      )
      expect(wrapper.findAll('option').length).toBeLessThan(50)
      await expectNoA11yViolations(wrapper.element)
    },
  )

  it('measures custom row heights and keeps a focused row alive during scrolling', async () => {
    const height = ref(48)
    const wrapper = mount(Listbox, {
      attachTo: document.body,
      props: { options, virtualize: true },
      slots: {
        option: ({ option }: { option: SelectOption }) =>
          h(
            'span',
            {
              style: {
                display: 'block',
                height: `${height.value + (Number(option.value) % 2) * 12}px`,
              },
            },
            option.label,
          ),
      },
    })
    wrappers.push(wrapper)
    await ready()
    wrapper.get<HTMLElement>('[role="listbox"]').element.focus()
    await userEvent.keyboard('{Home}')
    const focused = document.activeElement
    const viewport = wrapper.get<HTMLElement>('[data-overlayscrollbars-viewport]').element
    viewport.scrollTop = 30000
    await vi.waitFor(() =>
      expect(
        Math.max(
          ...wrapper.findAll('[data-index]').map(row => Number(row.attributes('data-index'))),
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
    const value = ref<number | null>(9500)
    const wrapper = mount(
      defineComponent(
        () => () =>
          h(Select, {
            options,
            virtualize: true,
            open: true,
            modelValue: value.value,
            'onUpdate:modelValue': next => {
              value.value = next as number
            },
          }),
      ),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
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
    { name: 'Combobox', Component: Combobox },
    { name: 'MultiCombobox', Component: MultiCombobox },
  ])('searches unmounted options with $name', async ({ Component }) => {
    const wrapper = mount(Component, {
      attachTo: document.body,
      props: { options, virtualize: true, open: true },
    })
    wrappers.push(wrapper)
    await ready()
    const input = wrapper.find('input')
    await expectPopupStructure(document.querySelector('[role="listbox"]')!)
    await input.setValue('Item 09998')
    await vi.waitFor(() => expect(rows()).toHaveLength(1))
    expect(rows()[0]!.textContent).toContain('Item 09998')
    await userEvent.click(input.element)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await vi.waitFor(() =>
      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(
        Component === MultiCombobox ? [9998] : 9998,
      ),
    )
  })

  it('searches command keywords across the complete collection and selects by keyboard', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(CommandPalette, {
      attachTo: document.body,
      props: {
        inline: true,
        virtualize: true,
        label: 'Commands',
        items: options.map(option => ({
          id: String(option.value),
          label: option.label,
          keywords: [`keyword-${option.value}`],
          disabled: option.disabled,
        })),
        onSelect,
      },
    })
    wrappers.push(wrapper)
    await ready()
    const input = wrapper.find('input')
    await userEvent.click(input.element)
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(active()?.textContent).toContain('Item 09998'))
    expect(input.attributes('aria-activedescendant')).toBe(active()?.id)
    await input.setValue('keyword-7890')
    await vi.waitFor(() => expect(rows()).toHaveLength(1))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() =>
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '7890' })),
    )
  })

  it('retains MultiSelect values while navigating and selecting distant options', async () => {
    const value = ref<Array<string | number>>([5000])
    const wrapper = mount(
      defineComponent(
        () => () =>
          h(MultiSelect, {
            options,
            virtualize: true,
            open: true,
            modelValue: value.value,
            'onUpdate:modelValue': next => {
              value.value = next
            },
          }),
      ),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await ready()
    await vi.waitFor(() => expect(document.activeElement?.textContent).toContain('Item 05000'))
    await userEvent.keyboard('{End}{Enter}')
    await vi.waitFor(() => expect(value.value).toEqual([5000, 9998]))
    expect(rows().length).toBeLessThan(50)
  })

  it('navigates Listbox beyond the window and selects all enabled options', async () => {
    const value = ref<Array<string | number>>([])
    const wrapper = mount(
      defineComponent(
        () => () =>
          h(Listbox, {
            options,
            virtualize: true,
            multiple: true,
            modelValue: value.value,
            'onUpdate:modelValue': next => {
              value.value = next as number[]
            },
          }),
      ),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await ready()
    const list = wrapper.find<HTMLElement>('[role="listbox"]')
    list.element.focus()
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(active()?.textContent).toContain('Item 09998'))
    await userEvent.keyboard('{Control>}a{/Control}')
    await vi.waitFor(() => expect(value.value).toHaveLength(9998))
    expect(value.value).not.toContain(0)
    expect(value.value).not.toContain(9999)
  })
})
