import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TooltipProvider from './TooltipProvider.vue'
import Tooltip from './Tooltip.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

beforeEach(async () => {
  document.body.innerHTML = ''
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

let mounted: VueWrapper[] = []

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(tooltipProps: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(TooltipProvider, { delayDuration: 0 }, () =>
          h(
            'div',
            { style: 'padding: 120px' },
            h(Tooltip, { content: '复制代码', ...tooltipProps }, () =>
              h(Button, { size: 'sm', variant: 'ghost', tone: 'neutral' }, () => '钮'),
            ),
          ),
        ),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

const tip = () => document.querySelector('[role="tooltip"]') as HTMLElement | null
const bubble = () => document.querySelector('[data-side]') as HTMLElement | null

describe('tooltip · 浮层底座第一件', () => {
  it('闭合时不进 DOM;悬停出现在 Portal 里,反色小体 + 顶部定位 + z token', async () => {
    const w = harness()
    expect(bubble()).toBeNull()

    const btn = w.find('button').element as HTMLElement
    await userEvent.hover(btn)
    await vi.waitFor(() => expect(bubble()).toBeTruthy())

    const content = bubble()!
    expect(content.textContent).toContain('复制代码')
    expect(w.element.contains(content)).toBe(false)

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
    const w = harness()
    const btn = w.find('button').element as HTMLElement
    await userEvent.hover(btn)
    await vi.waitFor(() => expect(tip()).toBeTruthy())
    expect(btn.getAttribute('aria-describedby')).toBe(tip()!.id)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(bubble()).toBeNull())

    btn.focus()
    await vi.waitFor(() => expect(bubble()).toBeTruthy())
  })

  it('side 可换', async () => {
    const w = harness({ side: 'bottom' })
    await userEvent.hover(w.find('button').element as HTMLElement)
    await vi.waitFor(() => expect(bubble()).toBeTruthy())
    expect(bubble()!.dataset.side).toBe('bottom')
  })
})
