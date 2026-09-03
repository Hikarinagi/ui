import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Anchor from './Anchor.vue'
import ScrollArea from '../scroll-area/ScrollArea.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('anchor 在固定壳滚动上下文里的 scrollspy 与跳转', () => {
  it('滚动内层视口时活动条目随动;点击条目滚动到位', async () => {
    const w = mount(
      defineComponent({
        components: { ScrollArea, Anchor },
        setup: () => () =>
          h('div', { style: 'display: flex; gap: 16px' }, [
            h(ScrollArea, { style: 'height: 200px; width: 300px' }, () => [
              h('section', { id: 'sec-a', style: 'height: 400px' }, '甲'),
              h('section', { id: 'sec-b', style: 'height: 400px' }, '乙'),
            ]),
            h(Anchor, {
              items: [
                { id: 'sec-a', label: '甲' },
                { id: 'sec-b', label: '乙' },
              ],
            }),
          ]),
      }),
      { attachTo: attach(), global: { stubs: { transition: false } } },
    )
    await vi.waitFor(() => {
      expect(
        (w.findComponent(ScrollArea).vm.$.exposed as { viewport: { value?: HTMLElement } }).viewport
          .value,
      ).toBeTruthy()
    })
    const viewport = (
      w.findComponent(ScrollArea).vm.$.exposed as { viewport: { value: HTMLElement } }
    ).viewport.value

    await vi.waitFor(() => expect(w.findAll('a')[0]!.attributes('aria-current')).toBe('location'))

    viewport.scrollTop = 450
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(w.findAll('a')[1]!.attributes('aria-current')).toBe('location'))

    viewport.scrollTop = 0
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(w.findAll('a')[0]!.attributes('aria-current')).toBe('location'))

    viewport.scrollTop = 350
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => {
      const links = w.findAll('a').map(a => a.element as HTMLElement)
      const indicator = w.find('.bg-accent').element as HTMLElement
      expect(links[0]!.className).toContain('font-medium')
      expect(links[1]!.className).toContain('font-medium')
      const spanTop = links[0]!.offsetTop
      const spanBottom = links[1]!.offsetTop + links[1]!.offsetHeight
      expect(Math.abs(indicator.offsetTop - spanTop)).toBeLessThan(2)
      expect(Math.abs(indicator.offsetTop + indicator.offsetHeight - spanBottom)).toBeLessThan(2)
    })

    await w.findAll('a')[1]!.trigger('click')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(300))
  })

  it('高亮段是 motion 驱动的连续位移:切换后中途位置介于两端,终点贴合活动条目', async () => {
    const w = mount(
      defineComponent({
        components: { ScrollArea, Anchor },
        setup: () => () =>
          h('div', { style: 'display: flex; gap: 16px' }, [
            h(ScrollArea, { style: 'height: 200px; width: 300px' }, () => [
              h('section', { id: 'hl-a', style: 'height: 600px' }, '甲'),
              h('section', { id: 'hl-b', style: 'height: 600px' }, '乙'),
            ]),
            h(Anchor, {
              items: [
                { id: 'hl-a', label: '甲' },
                { id: 'hl-b', label: '乙' },
              ],
            }),
          ]),
      }),
      { attachTo: attach(), global: { stubs: { transition: false } } },
    )
    const links = w.findAll('a')
    const rect = (el: Element) => el.getBoundingClientRect()
    const indicator = () => w.find('.bg-accent').element as HTMLElement
    await vi.waitFor(() => {
      expect(
        (w.findComponent(ScrollArea).vm.$.exposed as { viewport: { value?: HTMLElement } }).viewport
          .value,
      ).toBeTruthy()
    })
    const viewport = (
      w.findComponent(ScrollArea).vm.$.exposed as { viewport: { value: HTMLElement } }
    ).viewport.value
    await vi.waitFor(() => {
      expect(Math.abs(rect(indicator()).top - rect(links[0]!.element).top)).toBeLessThan(0.01)
    })
    const startTop = rect(indicator()).top
    const endTop = rect(links[1]!.element).top

    await links[1]!.trigger('click')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    await vi.waitFor(() => {
      const midTop = rect(indicator()).top
      expect(midTop).toBeGreaterThan(startTop + 1)
      expect(midTop).toBeLessThan(endTop - 1)
    })

    await vi.waitFor(
      () => {
        expect(Math.abs(rect(indicator()).top - endTop)).toBeLessThan(0.01)
        expect(Math.abs(rect(indicator()).height - rect(links[1]!.element).height)).toBeLessThan(
          0.01,
        )
      },
      { timeout: 1500 },
    )
  })

  it('高亮条在观测器首次报告后淡入，不是硬切出现', async () => {
    const w = mount(
      defineComponent({
        components: { ScrollArea, Anchor },
        setup: () => () =>
          h('div', { style: 'display: flex; gap: 16px' }, [
            h(ScrollArea, { style: 'height: 200px; width: 300px' }, () => [
              h('section', { id: 'fd-a', style: 'height: 600px' }, '甲'),
              h('section', { id: 'fd-b', style: 'height: 600px' }, '乙'),
            ]),
            h(Anchor, {
              items: [
                { id: 'fd-a', label: '甲' },
                { id: 'fd-b', label: '乙' },
              ],
            }),
          ]),
      }),
      { attachTo: attach(), global: { stubs: { transition: false } } },
    )
    expect(w.find('.bg-accent').exists()).toBe(false)
    await vi.waitFor(() => expect(w.find('.bg-accent').exists()).toBe(true))
    const bar = w.find('.bg-accent').element as HTMLElement
    expect(parseFloat(getComputedStyle(bar).opacity)).toBeLessThan(1)
    await vi.waitFor(() => expect(getComputedStyle(bar).opacity).toBe('1'))
  })
})
