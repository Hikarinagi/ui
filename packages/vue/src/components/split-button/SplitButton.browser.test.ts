import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import axe from 'axe-core'
import SplitButton from './SplitButton.vue'
import type { SplitButtonProps } from './types'
import DropdownMenuItem from '../dropdown-menu/DropdownMenuItem.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function setup(
  props: SplitButtonProps & { href?: string; 'aria-label'?: string } = {},
  text = 'Publish',
) {
  const open = ref(false)
  const loading = ref(false)
  const clicked = vi.fn()
  const selected = vi.fn()
  const submitted = vi.fn((event: Event) => event.preventDefault())
  const host = document.createElement('div')
  host.style.cssText = 'width:320px;margin:40px'
  document.body.append(host)
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h('form', { onSubmit: submitted }, [
          h(
            SplitButton,
            {
              menuLabel: 'Publishing options',
              ...props,
              loading: props.loading || loading.value,
              open: open.value,
              'onUpdate:open': (value: boolean) => {
                open.value = value
              },
              onClick: clicked,
              name: 'intent',
              value: 'publish',
            },
            {
              default: () => text,
              content: () => [
                h(DropdownMenuItem, { onSelect: selected }, () => 'Save draft'),
                h(DropdownMenuItem, { disabled: true }, () => 'Schedule'),
                h(DropdownMenuItem, { onSelect: selected }, () => 'Preview'),
              ],
            },
          ),
          h('button', { type: 'button', 'data-outside': '' }, 'Next'),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(wrapper)
  return {
    wrapper,
    open,
    loading,
    clicked,
    selected,
    submitted,
    component: wrapper.getComponent(SplitButton),
    group: wrapper.get('[data-hn-split-button]').element as HTMLElement,
    action: wrapper.get('[data-hn-split-action]').element as HTMLButtonElement,
    trigger: wrapper.get('[data-hn-split-trigger]').element as HTMLButtonElement,
  }
}
const menu = () => document.querySelector<HTMLElement>('[role=menu][data-state=open]')
const items = () => Array.from(menu()!.querySelectorAll<HTMLElement>('[role=menuitem]'))
async function openMenu(s: ReturnType<typeof setup>) {
  await userEvent.click(s.trigger)
  await vi.waitFor(() => expect(menu()).not.toBeNull())
}

it('keeps the primary action separate from the menu and its selections', async () => {
  const s = setup()
  await userEvent.click(s.action)
  expect(s.clicked).toHaveBeenCalledOnce()
  expect(s.open.value).toBe(false)
  expect(s.submitted).not.toHaveBeenCalled()
  await openMenu(s)
  expect(s.clicked).toHaveBeenCalledOnce()
  await userEvent.click(items()[0]!)
  expect(s.selected).toHaveBeenCalledOnce()
  await vi.waitFor(() => expect(s.open.value).toBe(false))
  expect(s.clicked).toHaveBeenCalledOnce()
  await vi.waitFor(() => expect(document.activeElement).toBe(s.trigger))
})

it('opens from the primary action with ArrowDown, skips disabled items, and restores focus on Escape', async () => {
  const s = setup()
  s.action.focus()
  await userEvent.keyboard('{ArrowDown}')
  await vi.waitFor(() => expect(menu()).not.toBeNull())
  await vi.waitFor(() => expect(document.activeElement).toBe(items()[0]))
  await userEvent.keyboard('{ArrowDown}')
  expect(document.activeElement).toBe(items()[2])
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(s.open.value).toBe(false))
  await vi.waitFor(() => expect(document.activeElement).toBe(s.trigger))
  expect(s.clicked).not.toHaveBeenCalled()
})

it('provides two tab stops; Enter on the menu trigger opens without invoking the primary action', async () => {
  const s = setup()
  s.action.focus()
  await userEvent.keyboard('{Tab}')
  expect(document.activeElement).toBe(s.trigger)
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(menu()).not.toBeNull())
  await userEvent.keyboard('{End}{Enter}')
  await vi.waitFor(() => expect(s.selected).toHaveBeenCalledOnce())
  expect(s.clicked).not.toHaveBeenCalled()
})

it('only the primary submit button submits, preserving native name and value', async () => {
  const s = setup({ type: 'submit' })
  expect(s.action.type).toBe('submit')
  expect(s.trigger.type).toBe('button')
  expect(s.action.name).toBe('intent')
  await openMenu(s)
  await userEvent.click(items()[0]!)
  expect(s.submitted).not.toHaveBeenCalled()
  await vi.waitFor(() => expect(document.body.style.pointerEvents).not.toBe('none'))
  await userEvent.click(s.action)
  expect(s.submitted).toHaveBeenCalledOnce()
  expect((s.submitted.mock.calls[0]![0] as SubmitEvent).submitter).toBe(s.action)
  const data = new FormData(s.action.form!, s.action)
  expect(data.get('intent')).toBe('publish')
})

it.each(['disabled', 'loading'] as const)('blocks both sides when %s', async state => {
  const s = setup({ [state]: true })
  expect(s.action.disabled).toBe(true)
  expect(s.trigger.disabled).toBe(true)
  s.action.click()
  s.trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
  await s.component.vm.openMenu()
  await nextTick()
  expect(s.open.value).toBe(false)
  expect(menu()).toBeNull()
  expect(s.clicked).not.toHaveBeenCalled()
})

it('closes the menu when loading starts and enables both sides when it ends', async () => {
  const s = setup()
  await openMenu(s)
  s.loading.value = true
  await vi.waitFor(() => expect(s.open.value).toBe(false))
  expect(s.group.getAttribute('aria-busy')).toBe('true')
  expect(s.action.disabled).toBe(true)
  expect(s.trigger.disabled).toBe(true)
  s.loading.value = false
  await nextTick()
  expect(s.action.disabled).toBe(false)
  expect(s.trigger.disabled).toBe(false)
})

it('allows alternative actions while only the primary action is disabled', async () => {
  const s = setup({ primaryDisabled: true })
  expect(s.action.disabled).toBe(true)
  expect(s.trigger.disabled).toBe(false)
  await openMenu(s)
  await userEvent.click(items()[0]!)
  expect(s.selected).toHaveBeenCalledOnce()
})

it('rejects controlled opening while loading without reopening when loading ends', async () => {
  const s = setup()
  s.loading.value = true
  await nextTick()
  s.open.value = true
  await nextTick()
  expect(s.open.value).toBe(false)
  s.loading.value = false
  await nextTick()
  expect(menu()).toBeNull()
  expect(s.open.value).toBe(false)
})

it('allows the primary action while the menu is disabled', async () => {
  const s = setup({ menuDisabled: true })
  expect(s.action.disabled).toBe(false)
  expect(s.trigger.disabled).toBe(true)
  await userEvent.click(s.action)
  s.action.focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(s.clicked).toHaveBeenCalledOnce()
  expect(s.open.value).toBe(false)
})

it('supports controlled opening and imperative focus/menu access', async () => {
  const s = setup()
  s.component.vm.focus()
  expect(document.activeElement).toBe(s.action)
  await s.component.vm.openMenu()
  await vi.waitFor(() => expect(menu()).not.toBeNull())
  s.component.vm.closeMenu()
  await vi.waitFor(() => expect(s.open.value).toBe(false))
  s.open.value = true
  await vi.waitFor(() => expect(menu()).not.toBeNull())
})

it.each(['sm', 'md', 'lg'] as const)(
  'keeps the %s menu trigger square at full width and truncates long labels',
  async size => {
    const s = setup(
      { size, block: true },
      'Export this very long document name in the selected format',
    )
    const group = s.group.getBoundingClientRect()
    const action = s.action.getBoundingClientRect()
    const trigger = s.trigger.getBoundingClientRect()
    expect(group.width).toBeCloseTo(320, 0)
    expect(trigger.width).toBeCloseTo(trigger.height, 0)
    expect(action.right - trigger.left).toBeCloseTo(1, 0)
    expect(trigger.right).toBeCloseTo(group.right, 0)
    expect(s.group.scrollWidth).toBeLessThanOrEqual(s.group.clientWidth)
    const label = s.action.querySelector<HTMLElement>('.truncate')!
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
  },
)

it.each(['ltr', 'rtl'] as const)(
  'joins corners and anchors the menu to the group in %s',
  async dir => {
    const s = setup({ dir, block: true, variant: 'outline' })
    const primaryStyle = getComputedStyle(s.action)
    const triggerStyle = getComputedStyle(s.trigger)
    expect(primaryStyle.borderStartEndRadius).toBe('0px')
    expect(primaryStyle.borderStartStartRadius).not.toBe('0px')
    expect(triggerStyle.borderStartStartRadius).toBe('0px')
    expect(triggerStyle.borderStartEndRadius).not.toBe('0px')
    expect(primaryStyle.getPropertyValue('--hn-press-scale').trim()).toBe('1')
    const action = s.action.getBoundingClientRect()
    const trigger = s.trigger.getBoundingClientRect()
    expect(dir === 'rtl' ? trigger.left < action.left : trigger.left > action.left).toBe(true)
    await openMenu(s)
    await vi.waitFor(() => {
      const content = menu()!.getBoundingClientRect()
      const group = s.group.getBoundingClientRect()
      expect(dir === 'rtl' ? content.left : content.right).toBeCloseTo(
        dir === 'rtl' ? group.left : group.right,
        0,
      )
    })
  },
)

it('can render a link as the primary action without changing the menu button', async () => {
  const s = setup({ as: 'a', href: '#destination', 'aria-label': 'Open document' })
  expect(s.action.tagName).toBe('A')
  expect(s.action.getAttribute('href')).toBe('#destination')
  expect(s.action.getAttribute('aria-label')).toBe('Open document')
  expect(s.trigger.tagName).toBe('BUTTON')
  expect(s.trigger.hasAttribute('href')).toBe(false)
  await openMenu(s)
  expect(s.clicked).not.toHaveBeenCalled()
})

it('keeps the portalled menu in sync with inherited direction changes', async () => {
  const s = setup({ block: true })
  s.wrapper.element.setAttribute('dir', 'rtl')
  await openMenu(s)
  await vi.waitFor(() => expect(menu()!.getAttribute('dir')).toBe('rtl'))
  await vi.waitFor(() =>
    expect(menu()!.getBoundingClientRect().left).toBeCloseTo(
      s.group.getBoundingClientRect().left,
      0,
    ),
  )
  s.wrapper.element.setAttribute('dir', 'ltr')
  await vi.waitFor(() => expect(menu()!.getAttribute('dir')).toBe('ltr'))
  await vi.waitFor(() =>
    expect(menu()!.getBoundingClientRect().right).toBeCloseTo(
      s.group.getBoundingClientRect().right,
      0,
    ),
  )
})

it('has named controls and an accessible menu', async () => {
  const s = setup({ label: 'Publishing' })
  const options = { rules: { region: { enabled: false } } }
  expect((await axe.run(s.group, options)).violations).toEqual([])
  await openMenu(s)
  expect(s.trigger.getAttribute('aria-expanded')).toBe('true')
  expect(s.trigger.getAttribute('aria-haspopup')).toBe('menu')
  expect((await axe.run(menu()!, options)).violations).toEqual([])
})
