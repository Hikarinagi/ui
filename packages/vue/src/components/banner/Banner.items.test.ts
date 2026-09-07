import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Banner from './Banner.vue'
import { expectNoA11yViolations } from '../../../test/axe'

const notices = [{ text: '一' }, { text: '二' }, { text: '三' }]

const text = (props: { item: unknown }) => (props.item as { text: string }).text

function mountItems(props: Record<string, unknown> = {}) {
  return mount(Banner, {
    props: { items: notices, ...props },
    slots: { item: (props: { item: unknown }) => h('b', text(props)) },
  })
}

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Banner · 多条公告', () => {
  it('只渲染当前一条;上一条 / 下一条循环切换,计数随之变化并回写 index', async () => {
    const w = mountItems()
    expect(w.find('b').text()).toBe('一')
    expect(w.text()).toContain('1 / 3')
    const [prev, next] = w.findAll('button')
    expect(prev!.attributes('aria-label')).toBe('上一条')
    expect(next!.attributes('aria-label')).toBe('下一条')

    await next!.trigger('click')
    expect(w.emitted('update:index')?.[0]).toEqual([1])
    await w.setProps({ index: 1 })
    expect(w.find('b').text()).toBe('二')
    expect(w.text()).toContain('2 / 3')

    await prev!.trigger('click')
    await prev!.trigger('click')
    expect(w.emitted('update:index')?.at(-1)).toEqual([2])
  })

  it('每条可以自带 tone 与 icon:底色、字色与图标随当前一条变化,没有的沿用公告条的', async () => {
    const Star = { name: 'Star', render: () => h('svg', { 'data-star': '' }) }
    const w = mount(Banner, {
      props: {
        tone: 'info',
        items: [{ text: '一' }, { text: '二', tone: 'warning' }, { text: '三', icon: Star }],
      },
      slots: { item: text },
    })
    expect(w.find('[data-tone]').attributes('data-tone')).toBe('info')
    expect(w.find('[data-tone]').classes()).toContain('bg-info')
    expect(w.find('[data-star]').exists()).toBe(false)

    await w.setProps({ index: 1 })
    expect(w.find('[data-tone]').attributes('data-tone')).toBe('warning')
    expect(w.find('[data-tone]').classes()).toContain('bg-warning')
    expect(w.find('[data-tone]').classes()).toContain('text-warning-on')

    await w.setProps({ index: 2 })
    expect(w.find('[data-tone]').attributes('data-tone')).toBe('info')
    expect(w.find('[data-star]').exists()).toBe(true)
  })

  it('只有一条时没有切换控件;手动切换时内容区是礼貌级实时区域,自动轮播时不是', () => {
    const single = mountItems({ items: [notices[0]] })
    expect(single.findAll('button')).toHaveLength(0)
    expect(single.find('[aria-live]').exists()).toBe(false)

    expect(mountItems().find('[aria-live]').attributes('aria-live')).toBe('polite')
    expect(mountItems({ autoplay: 3000 }).find('[aria-live]').exists()).toBe(false)
  })

  it('autoplay 按间隔切到下一条;悬停或聚焦时暂停,离开后继续', async () => {
    vi.useFakeTimers()
    const w = mountItems({ autoplay: 1000, attachTo: document.body })
    await vi.advanceTimersByTimeAsync(1000)
    expect(w.emitted('update:index')?.[0]).toEqual([1])
    await w.setProps({ index: 1 })

    const bar = w.find('[data-tone]')
    await bar.trigger('pointerenter')
    await vi.advanceTimersByTimeAsync(2500)
    expect(w.emitted('update:index')).toHaveLength(1)

    await bar.trigger('pointerleave')
    await vi.advanceTimersByTimeAsync(1000)
    expect(w.emitted('update:index')).toHaveLength(2)
    await w.setProps({ index: 2 })

    await bar.trigger('focusin')
    await vi.advanceTimersByTimeAsync(2500)
    expect(w.emitted('update:index')).toHaveLength(2)
    await bar.trigger('focusout')
    await vi.advanceTimersByTimeAsync(1000)
    expect(w.emitted('update:index')?.at(-1)).toEqual([0])
  })

  it('无障碍零违例', async () => {
    const w = mount(Banner, {
      props: { items: notices, closable: true },
      slots: { item: text },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element)
  })
})
