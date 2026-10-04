import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import type { ComponentType, ReactNode } from 'react'
import { TooltipProvider } from '../components/tooltip/TooltipProvider'
import { Popover } from '../components/popover/Popover'
import { IconButton } from '../components/icon-button/IconButton'
import { mount } from '../../test/mount'
import { signal } from '../../test/signal'
import '../../test/browser.css'

type Loose = ComponentType<Record<string, unknown>>
const menuModule = Object.values(
  import.meta.glob<{ DropdownMenu: Loose }>('../components/dropdown-menu/DropdownMenu.tsx', {
    eager: true,
  }),
)[0]
const itemModule = Object.values(
  import.meta.glob<{ DropdownMenuItem: Loose }>(
    '../components/dropdown-menu/DropdownMenuItem.tsx',
    { eager: true },
  ),
)[0]
const DropdownMenu = menuModule?.DropdownMenu
const DropdownMenuItem = itemModule?.DropdownMenuItem

let wrapper: { unmount: () => Promise<void> } | undefined
afterEach(async () => {
  await wrapper?.unmount()
  await vi.waitFor(() => {
    expect(document.body.style.pointerEvents).toBe('')
    expect(document.body.style.overflow).toBe('')
  })
  document.body.innerHTML = ''
})

type Kind = 'menu' | 'popover'

async function harness(kind: Kind, provider = true, tooltip = false) {
  const tag = signal<'button' | 'a'>('button')
  const Component = (kind === 'menu' ? DropdownMenu : Popover) as Loose
  function Overlay() {
    const as = tag.use()
    return (
      <Component
        align="end"
        content={
          kind === 'menu' ? (
            DropdownMenuItem && <DropdownMenuItem>深色</DropdownMenuItem>
          ) : (
            <button style={{ width: '120px', height: '32px' }}>深色</button>
          )
        }
      >
        <IconButton
          as={as}
          href={as === 'a' ? '#trigger' : undefined}
          role="button"
          label="主题"
          tooltip={tooltip}
          style={{ position: 'fixed', left: '240px', top: '120px' }}
        >
          <span>T</span>
        </IconButton>
      </Component>
    )
  }
  const render = (): ReactNode =>
    provider ? (
      <TooltipProvider delayDuration={0}>
        <Overlay />
      </TooltipProvider>
    ) : (
      <Overlay />
    )
  const mounted = await mount(render())
  wrapper = mounted
  const trigger = () => mounted.container.querySelector('[aria-label="主题"]') as HTMLElement
  const panel = () =>
    document.querySelector<HTMLElement>('[role="' + (kind === 'menu' ? 'menu' : 'dialog') + '"]')
  return { tag, trigger, panel }
}

const kinds: Kind[] = DropdownMenu ? ['menu', 'popover'] : ['popover']

const cases = kinds.flatMap(kind =>
  [true, false].flatMap(provider => [true, false].map(tooltip => ({ kind, provider, tooltip }))),
)

it.each(cases)(
  '$kind provider=$provider tooltip=$tooltip: IconButton 支持点击、键盘、定位与关闭回焦',
  async ({ kind, provider, tooltip }) => {
    const { trigger, panel } = await harness(kind, provider, tooltip)
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

it.each(kinds)('%s: 包装组件内部替换按钮元素后使用新的触发器', async kind => {
  const { tag, trigger, panel } = await harness(kind)
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
})
