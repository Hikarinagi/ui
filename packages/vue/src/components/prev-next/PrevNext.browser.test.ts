import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import PrevNext from './PrevNext.vue'
import PrevNextLink from './PrevNextLink.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function harness(width = 720) {
  const host = document.createElement('div')
  host.style.cssText = `width: ${width}px`
  document.body.appendChild(host)
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(PrevNext, {}, () => [
          h(PrevNextLink, { direction: 'prev', href: '#a' }, () => '排版与字阶'),
          h(PrevNextLink, { direction: 'next', href: '#b' }, () => 'Button 按钮'),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(w)
  return w
}

describe('prev-next · 上下页导航', () => {
  it('两张 surface 卡并排;窄屏落成单列', async () => {
    await page.viewport(900, 600)
    const w = harness()
    const [prev, next] = w.findAll('a').map(l => l.element as HTMLElement)
    expect(
      Math.abs(prev!.getBoundingClientRect().top - next!.getBoundingClientRect().top),
    ).toBeLessThan(2)
    expect(getComputedStyle(prev!).boxShadow).not.toBe('none')

    await page.viewport(414, 800)
    const narrow = harness(380)
    const [p2, n2] = narrow.findAll('a').map(l => l.element as HTMLElement)
    expect(n2!.getBoundingClientRect().top).toBeGreaterThan(p2!.getBoundingClientRect().bottom - 1)
  })

  it('整卡是可点容器:hover 浮薄墨、Tab 可达、焦点环可见', async () => {
    await page.viewport(900, 600)
    const w = harness()
    const prev = w.find('a').element as HTMLElement
    expect(getComputedStyle(prev, '::after').opacity).toBe('0')
    await userEvent.hover(prev)
    await vi.waitFor(() =>
      expect(Number(getComputedStyle(prev, '::after').opacity)).toBeGreaterThan(0),
    )
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(prev)
  })
})
