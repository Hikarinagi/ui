import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { page, userEvent } from 'vitest/browser'
import { ConfigProvider } from 'reka-ui'
import Toolbar from './Toolbar.vue'
import ToolbarButton from './ToolbarButton.vue'
import ToolbarLink from './ToolbarLink.vue'
import ToolbarToggleGroup from './ToolbarToggleGroup.vue'
import ToolbarToggleItem from './ToolbarToggleItem.vue'
import ToolbarSeparator from './ToolbarSeparator.vue'
import DropdownMenu from '../dropdown-menu/DropdownMenu.vue'
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem.vue'
import TooltipProvider from '../tooltip/TooltipProvider.vue'
import IconButton from '../icon-button/IconButton.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
beforeEach(async () => {
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})

function buttons() {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hn-toolbar] button'))
}

describe('Toolbar browser behavior', () => {
  it.each(['ltr', 'rtl'] as const)(
    'moves through all groups in %s without changing selection',
    async dir => {
      document.documentElement.dir = dir
      const model = ref<string[]>([])
      const wrapper = mount(Toolbar, {
        attachTo: document.body,
        props: { label: 'Tools' },
        slots: {
          default: () => [
            h(ToolbarButton, {}, () => 'First'),
            h(ToolbarButton, { disabled: true }, () => 'Disabled'),
            h(
              ToolbarToggleGroup,
              {
                type: 'multiple',
                modelValue: model.value,
                'onUpdate:modelValue': value => (model.value = value as string[]),
              },
              () => [
                h(ToolbarToggleItem, { value: 'bold' }, () => 'Bold'),
                h(ToolbarToggleItem, { value: 'italic' }, () => 'Italic'),
              ],
            ),
            h(ToolbarLink, { href: '#help' }, () => 'Help'),
          ],
        },
      })
      wrappers.push(wrapper)
      await userEvent.tab()
      expect(document.activeElement).toBe(buttons()[0])
      const next = dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}'
      await userEvent.keyboard(next)
      expect(document.activeElement).toBe(buttons()[2])
      expect(model.value).toEqual([])
      await userEvent.keyboard('{Space}')
      expect(model.value).toEqual(['bold'])
      await userEvent.keyboard(next)
      expect(document.activeElement).toBe(buttons()[3])
      await userEvent.keyboard(next)
      expect(document.activeElement?.tagName).toBe('A')
      await userEvent.keyboard(next)
      expect(document.activeElement).toBe(buttons()[0])
      await userEvent.keyboard('{End}')
      expect(document.activeElement?.tagName).toBe('A')
      await userEvent.keyboard('{Home}')
      expect(document.activeElement).toBe(buttons()[0])
    },
  )

  it('supports vertical navigation, loop control, and inherited group disabling', async () => {
    const groupDisabled = ref(true)
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      props: { label: 'Vertical tools', orientation: 'vertical', loop: false },
      slots: {
        default: () => [
          h(ToolbarButton, {}, () => 'First'),
          h(ToolbarToggleGroup, { disabled: groupDisabled.value }, () =>
            h(ToolbarToggleItem, { value: 'middle' }, () => 'Middle'),
          ),
          h(ToolbarButton, {}, () => 'Last'),
        ],
      },
    })
    wrappers.push(wrapper)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons()[2])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons()[2])
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(buttons()[0])
    groupDisabled.value = false
    await vi.waitFor(() => expect(buttons()[1]!.disabled).toBe(false))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons()[1])
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons()[1])
  })

  it('inherits and reacts to ConfigProvider direction', async () => {
    const dir = ref<'ltr' | 'rtl'>('ltr')
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(ConfigProvider, { dir: dir.value }, () =>
            h(Toolbar, { label: 'Direction' }, () => [
              h(ToolbarButton, {}, () => 'One'),
              h(ToolbarButton, {}, () => 'Two'),
              h(ToolbarButton, {}, () => 'Three'),
            ]),
          ),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons()[1])
    dir.value = 'rtl'
    await vi.waitFor(() => expect(wrapper.find('[data-hn-toolbar]').attributes('dir')).toBe('rtl'))
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons()[0])
  })

  it('is one tab stop, remembers focus, and never submits its surrounding form', async () => {
    const submit = vi.fn((event: Event) => event.preventDefault())
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h('form', { onSubmit: submit }, [
            h('input', { 'aria-label': 'Before' }),
            h(Toolbar, { label: 'Actions' }, () => [
              h(ToolbarButton, {}, () => 'One'),
              h(ToolbarButton, {}, () => 'Two'),
              h(ToolbarButton, {}, () => 'Three'),
            ]),
            h('input', { 'aria-label': 'After' }),
          ]),
      }),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await userEvent.tab()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Before')
    await userEvent.tab()
    expect(document.activeElement).toBe(buttons()[0])
    await userEvent.keyboard('{ArrowRight}{Enter}')
    expect(submit).not.toHaveBeenCalled()
    await userEvent.tab()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('After')
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(buttons()[1])
    await userEvent.tab({ shift: true })
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Before')
  })

  it('composes tooltips and custom controls with no nested buttons', async () => {
    const clicked = vi.fn()
    const wrapper = mount(TooltipProvider, {
      attachTo: document.body,
      props: { delayDuration: 0 },
      slots: {
        default: () =>
          h(Toolbar, { label: 'Icons', size: 'sm' }, () => [
            h(ToolbarButton, { label: 'Undo', onClick: clicked }, () => '↶'),
            h(ToolbarButton, { asChild: true }, () => h(IconButton, { label: 'Save' }, () => 'S')),
            h(ToolbarButton, { label: 'Redo', disabled: true }, () => '↷'),
          ]),
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.find('button button').exists()).toBe(false)
    await page.getByRole('button', { name: 'Undo', exact: true }).hover()
    await vi.waitFor(() =>
      expect(document.querySelector('[role=tooltip]')?.textContent).toBe('Undo'),
    )
    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    expect(clicked).toHaveBeenCalledTimes(1)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Save')
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Undo')
    expect(getComputedStyle(buttons()[0]!).height).toBe(getComputedStyle(buttons()[1]!).height)
  })

  it('opens a menu from the keyboard and restores focus to its toolbar trigger', async () => {
    const selected = vi.fn()
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      props: { label: 'Menu composition' },
      slots: {
        default: () => [
          h(ToolbarButton, {}, () => 'First'),
          h(
            DropdownMenu,
            { modal: false },
            {
              default: () => h(ToolbarButton, {}, () => 'More'),
              content: () => h(DropdownMenuItem, { onSelect: selected }, () => 'Duplicate'),
            },
          ),
          h(ToolbarButton, {}, () => 'Last'),
        ],
      },
    })
    wrappers.push(wrapper)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}{ArrowDown}')
    await expect.element(page.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(selected).toHaveBeenCalledTimes(1)
    await expect.element(page.getByRole('button', { name: 'More', exact: true })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.textContent).toBe('Last')
  })

  it('activates links with Space without scrolling and blocks disabled links', async () => {
    const click = vi.fn((event: MouseEvent) => event.preventDefault())
    const wrapper = mount(Toolbar, {
      attachTo: document.body,
      props: { label: 'Links' },
      slots: {
        default: () => [
          h(ToolbarLink, { href: '#one', onClick: click }, () => 'One'),
          h(ToolbarLink, { href: '#two', disabled: true, onClick: click }, () => 'Two'),
          h(ToolbarButton, {}, () => 'Last'),
        ],
      },
    })
    wrappers.push(wrapper)
    await userEvent.tab()
    const before = window.scrollY
    await userEvent.keyboard('{Space}')
    expect(click).toHaveBeenCalledTimes(1)
    expect(window.scrollY).toBe(before)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.textContent).toBe('Last')
  })

  it.each(['horizontal', 'vertical'] as const)(
    'sizes separators and controls in %s layout at narrow widths',
    async orientation => {
      const wrapper = mount(Toolbar, {
        attachTo: document.body,
        props: { label: 'Geometry', orientation },
        attrs: { style: 'max-width: 240px' },
        slots: {
          default: () => [
            h(ToolbarButton, {}, () => 'One'),
            h(ToolbarButton, {}, () => 'Two'),
            h(ToolbarSeparator),
            h(ToolbarButton, {}, () => 'Three'),
            h(ToolbarButton, {}, () => 'Four'),
          ],
        },
      })
      wrappers.push(wrapper)
      const element = wrapper.element as HTMLElement
      expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth)
      const separator = wrapper.find('[role=none]').element.getBoundingClientRect()
      if (orientation === 'horizontal') {
        expect(separator.width).toBe(1)
        expect(separator.height).toBeGreaterThan(10)
      } else {
        expect(separator.height).toBe(1)
        expect(separator.width).toBeGreaterThan(10)
      }
    },
  )
})
