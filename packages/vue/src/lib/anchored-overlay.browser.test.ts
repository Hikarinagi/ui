import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, ref, type Component } from 'vue'
import { TooltipProvider } from 'reka-ui'
import DropdownMenu from '../components/dropdown-menu/DropdownMenu.vue'
import DropdownMenuItem from '../components/dropdown-menu/DropdownMenuItem.vue'
import Popover from '../components/popover/Popover.vue'
import IconButton from '../components/icon-button/IconButton.vue'
import '../../test/browser.css'

let wrapper: VueWrapper | undefined
afterEach(async () => {
  wrapper?.unmount()
  await vi.waitFor(() => {
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })
  document.body.innerHTML = ''
})

type Kind = 'menu' | 'popover'

function harness(kind: Kind, provider = true, tooltip = false) {
  const tag = ref<'button' | 'a'>('button')
  const Component: Component = kind === 'menu' ? DropdownMenu : Popover
  const render = () =>
    h(
      Component,
      { align: 'end' },
      {
        default: () =>
          h(
            IconButton,
            {
              as: tag.value,
              href: tag.value === 'a' ? '#trigger' : undefined,
              role: 'button',
              label: '主题',
              tooltip,
              style: 'position:fixed;left:240px;top:120px',
            },
            () => h('span', 'T'),
          ),
        content: () =>
          kind === 'menu'
            ? h(DropdownMenuItem, () => '深色')
            : h('button', { style: 'width:120px;height:32px' }, '深色'),
      },
    )
  wrapper = mount(
    {
      setup: () => () =>
        provider ? h(TooltipProvider, { delayDuration: 0 }, { default: render }) : render(),
    },
    { attachTo: document.body },
  )
  const trigger = () => wrapper!.get('[aria-label="主题"]').element as HTMLElement
  const panel = () =>
    document.querySelector<HTMLElement>('[role="' + (kind === 'menu' ? 'menu' : 'dialog') + '"]')
  return { tag, trigger, panel }
}

const cases = (['menu', 'popover'] as const).flatMap(kind =>
  [true, false].flatMap(provider => [true, false].map(tooltip => ({ kind, provider, tooltip }))),
)

it.each(cases)(
  '$kind provider=$provider tooltip=$tooltip: IconButton 支持点击、键盘、定位与关闭回焦',
  async ({ kind, provider, tooltip }) => {
    const { trigger, panel } = harness(kind, provider, tooltip)
    await userEvent.click(trigger())
    await vi.waitFor(() => {
      expect(panel()).not.toBeNull()
      expect(trigger().getAttribute('aria-expanded')).toBe('true')
      const a = trigger().getBoundingClientRect()
      const b = panel()!.parentElement!.getBoundingClientRect()
      expect(b.right).toBeCloseTo(a.right, 0)
      expect(b.top).toBeCloseTo(a.bottom + 8, 0)
    })
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger())
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    await userEvent.keyboard(kind === 'menu' ? '{ArrowDown}' : '{Enter}')
    await vi.waitFor(() => expect(panel()).not.toBeNull())
    expect(panel()!.contains(document.activeElement)).toBe(true)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger())
  },
)

it.each(['menu', 'popover'] as const)(
  '%s: 包装组件内部替换按钮元素后使用新的触发器',
  async kind => {
    const { tag, trigger, panel } = harness(kind)
    const previous = trigger()
    tag.value = 'a'
    await vi.waitFor(() => expect(trigger().tagName).toBe('A'))
    expect(previous.isConnected).toBe(false)
    await userEvent.click(trigger())
    await vi.waitFor(() => {
      expect(panel()).not.toBeNull()
      const a = trigger().getBoundingClientRect()
      const b = panel()!.parentElement!.getBoundingClientRect()
      expect(b.right).toBeCloseTo(a.right, 0)
      expect(b.top).toBeCloseTo(a.bottom + 8, 0)
    })
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger())
  },
)
