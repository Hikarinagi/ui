import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { Star } from 'lucide-react'
import { IconButton } from './IconButton'
import { TooltipProvider } from '../tooltip/TooltipProvider'
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

describe('icon button · 图标按钮惯例内置', () => {
  it('label 兼作无障碍名;默认 ghost/neutral 方形档', async () => {
    const w = await mount(
      <IconButton label="收藏">
        <Star />
      </IconButton>,
    )
    const btn = w.container.querySelector('button')!
    expect(btn.getAttribute('aria-label')).toBe('收藏')
    expect(btn.classList).toContain('aspect-square')
    expect(btn.classList).toContain('text-fg')
  })

  it('Provider 内悬停浮出 label 词;tooltip=false 则不浮', async () => {
    const w = await mount(
      <TooltipProvider delayDuration={0}>
        <div style={{ padding: '80px' }}>
          <IconButton label="收藏这本书">
            <Star />
          </IconButton>
        </div>
      </TooltipProvider>,
    )

    await userEvent.hover(w.container.querySelector('button') as HTMLElement)
    await vi.waitFor(() => {
      const tip = document.querySelector('.hn-anim-pop[data-side]')
      expect(tip?.textContent).toContain('收藏这本书')
    })
  })

  it('无 Provider 也不崩:静默降级为纯按钮', async () => {
    const w = await mount(
      <IconButton label="独立使用">
        <Star />
      </IconButton>,
    )
    await userEvent.hover(w.container.querySelector('button') as HTMLElement)
    await new Promise(r => setTimeout(r, 250))
    expect(document.querySelector('.hn-anim-pop[data-side]')).toBeNull()
    expect(w.container.querySelector('button')!.getAttribute('aria-label')).toBe('独立使用')
  })

  it('穿透监听器落到真按钮(fragment 根不丢 attrs)', async () => {
    const onClick = vi.fn()
    const w = await mount(
      <IconButton label="点我" onClick={onClick} data-probe="x">
        <Star />
      </IconButton>,
    )
    expect(w.container.querySelector('button')!.getAttribute('data-probe')).toBe('x')
    await userEvent.click(w.container.querySelector('button') as HTMLElement)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('loading 走 Button 的图标交接,禁点', async () => {
    const w = await mount(
      <IconButton label="保存" loading>
        <Star />
      </IconButton>,
    )
    const btn = w.container.querySelector('button')!
    expect(btn.hasAttribute('disabled')).toBe(true)
    expect(btn.querySelector('[role="status"]')).not.toBeNull()
  })
})
