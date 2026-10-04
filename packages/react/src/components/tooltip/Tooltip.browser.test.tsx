import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { TooltipProvider } from './TooltipProvider'
import { Tooltip } from './Tooltip'
import { Button } from '../button/Button'
import { IconButton } from '../icon-button/IconButton'
import { Popover } from '../popover/Popover'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(async () => {
  document.querySelectorAll('[data-park]').forEach(node => node.remove())
  const park = document.createElement('div')
  park.dataset.park = ''
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

async function harness(tooltipProps: Record<string, unknown> = {}) {
  return mount(
    <TooltipProvider delayDuration={0}>
      <div style={{ padding: '120px' }}>
        <Tooltip content="复制代码" {...tooltipProps}>
          <Button size="sm" variant="ghost" tone="neutral">
            钮
          </Button>
        </Tooltip>
      </div>
    </TooltipProvider>,
  )
}

const tip = () => document.querySelector('[role="tooltip"]') as HTMLElement | null
const bubble = () => document.querySelector('[data-side]') as HTMLElement | null

describe('tooltip · 浮层底座第一件', () => {
  it('闭合时不进 DOM;悬停出现在 Portal 里,反色小体 + 顶部定位 + z token', async () => {
    const w = await harness()
    expect(bubble()).toBeNull()

    const btn = w.container.querySelector('button') as HTMLElement
    await userEvent.hover(btn)
    await vi.waitFor(() => expect(bubble()).toBeTruthy())

    const content = bubble()!
    expect(content.textContent).toContain('复制代码')
    expect(w.container.contains(content)).toBe(false)

    expect(content.dataset.side).toBe('top')
    const style = getComputedStyle(content)
    expect(style.zIndex).toBe('100')
    expect(content.className).toContain('hn-anim-pop')
    expect(style.animationDuration).toBe('0.2s')

    const arrow = content.querySelector('svg')!
    expect(arrow).toBeTruthy()
    expect(getComputedStyle(arrow).fill).toBe(style.backgroundColor)

    await vi.waitFor(() => {
      const cb = content.getBoundingClientRect()
      const bb = btn.getBoundingClientRect()
      expect(cb.bottom).toBeLessThanOrEqual(bb.top)
    })
  })

  it('触发器 aria-describedby 关联;移开与 Esc 都能关', async () => {
    const w = await harness()
    const btn = w.container.querySelector('button') as HTMLElement
    await userEvent.hover(btn)
    await vi.waitFor(() => expect(tip()).toBeTruthy())
    expect(btn.getAttribute('aria-describedby')).toBe(tip()!.id)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(bubble()).toBeNull())
  })

  it('聚焦只认键盘:Tab 进入出气泡,程序化 focus 不出', async () => {
    const w = await harness()
    const btn = w.container.querySelector('button') as HTMLElement

    await userEvent.click(btn)
    await userEvent.hover(w.container.querySelector('div') as HTMLElement, {
      position: { x: 4, y: 4 },
    })
    await vi.waitFor(() => expect(bubble()).toBeNull())

    btn.blur()
    btn.focus()
    await new Promise(r => setTimeout(r, 300))
    expect(bubble(), '指针模态下的程序化聚焦不应出气泡').toBeNull()

    btn.blur()
    await userEvent.keyboard('{ArrowDown}')
    btn.focus()
    await vi.waitFor(() => expect(bubble()).toBeTruthy())
  })

  it('side 可换', async () => {
    const w = await harness({ side: 'bottom' })
    await userEvent.hover(w.container.querySelector('button') as HTMLElement)
    await vi.waitFor(() => expect(bubble()).toBeTruthy())
    expect(bubble()!.dataset.side).toBe('bottom')
  })

  it('浮层关闭后的焦点回流不冒气泡', async () => {
    const w = await mount(
      <TooltipProvider delayDuration={0}>
        <div style={{ padding: '120px' }}>
          <Popover content={<div style={{ padding: '8px' }}>面板</div>}>
            <IconButton label="更多打开方式">≡</IconButton>
          </Popover>
        </div>
      </TooltipProvider>,
    )
    const btn = w.container.querySelector('button') as HTMLElement

    await userEvent.click(btn)
    await vi.waitFor(() => expect(document.querySelector('[data-side]')).toBeTruthy())

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    document.body.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
    await vi.waitFor(() => expect(document.querySelector('[data-side]')).toBeNull())
    expect(document.activeElement).toBe(btn)

    await new Promise(r => setTimeout(r, 400))
    expect(tip(), '浮层关闭后 tooltip 不应自己冒出来').toBeNull()
  })
})
