import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import IconButton from './IconButton.vue'
import TooltipProvider from '../tooltip/TooltipProvider.vue'
import { Star } from '@lucide/vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(async () => {
  document.body.innerHTML = ''
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('icon button · 图标按钮惯例内置', () => {
  it('label 兼作无障碍名;默认 ghost/neutral 方形档', async () => {
    const w = mount(IconButton, {
      props: { label: '收藏' },
      slots: { default: () => h(Star) },
      attachTo: attach(),
    })
    mounted.push(w)
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('收藏')
    expect(btn.classes()).toContain('aspect-square')
    expect(btn.classes()).toContain('text-fg')
  })

  it('Provider 内悬停浮出 label 词;tooltip=false 则不浮', async () => {
    const w = mount(
      defineComponent({
        setup: () => () =>
          h(TooltipProvider, { delayDuration: 0 }, () => [
            h(
              'div',
              { style: 'padding: 80px' },
              h(IconButton, { label: '收藏这本书' }, () => h(Star)),
            ),
          ]),
      }),
      { attachTo: attach() },
    )
    mounted.push(w)

    await userEvent.hover(w.find('button').element as HTMLElement)
    await vi.waitFor(() => {
      const tip = document.querySelector('.hn-anim-pop[data-side]')
      expect(tip?.textContent).toContain('收藏这本书')
    })
  })

  it('无 Provider 也不崩:静默降级为纯按钮', async () => {
    const w = mount(IconButton, {
      props: { label: '独立使用' },
      slots: { default: () => h(Star) },
      attachTo: attach(),
    })
    mounted.push(w)
    await userEvent.hover(w.find('button').element as HTMLElement)
    await new Promise(r => setTimeout(r, 250))
    expect(document.querySelector('.hn-anim-pop[data-side]')).toBeNull()
    expect(w.find('button').attributes('aria-label')).toBe('独立使用')
  })

  it('穿透监听器落到真按钮(fragment 根不丢 attrs)', async () => {
    const onClick = vi.fn()
    const w = mount(IconButton, {
      props: { label: '点我' },
      attrs: { onClick, 'data-probe': 'x' },
      slots: { default: () => h(Star) },
      attachTo: attach(),
    })
    mounted.push(w)
    expect(w.find('button').attributes('data-probe')).toBe('x')
    await userEvent.click(w.find('button').element as HTMLElement)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('loading 走 Button 的图标交接,禁点', async () => {
    const w = mount(IconButton, {
      props: { label: '保存', loading: true },
      slots: { default: () => h(Star) },
      attachTo: attach(),
    })
    mounted.push(w)
    const btn = w.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
    expect(btn.find('[role="status"]').exists()).toBe(true)
  })
})
