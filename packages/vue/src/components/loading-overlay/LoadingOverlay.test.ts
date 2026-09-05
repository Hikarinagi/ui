import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import LoadingOverlay from './LoadingOverlay.vue'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

const overlay = (w: ReturnType<typeof mount>) => w.find('[data-hn-loading-overlay]')
const blocker = (w: ReturnType<typeof mount>) => w.find('[data-hn-loading-blocker]')

describe('LoadingOverlay', () => {
  it('不可见时不渲染任何东西', () => {
    const w = mount(LoadingOverlay)
    expect(overlay(w).exists()).toBe(false)
    expect(blocker(w).exists()).toBe(false)
  })

  it('可见后先只挂挡板，过了延时才挂遮罩', async () => {
    const w = mount(LoadingOverlay, { props: { visible: true } })
    expect(blocker(w).exists()).toBe(true)
    expect(blocker(w).classes()).toContain('absolute')
    expect(overlay(w).exists()).toBe(false)
    vi.advanceTimersByTime(299)
    await nextTick()
    expect(overlay(w).exists()).toBe(false)
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(overlay(w).exists()).toBe(true)
    expect(blocker(w).exists()).toBe(false)
    expect(overlay(w).find('[role="status"]').attributes('aria-label')).toBe('加载中')
  })

  it('delay 为 0 时立即显示', () => {
    const w = mount(LoadingOverlay, { props: { visible: true, delay: 0 } })
    expect(overlay(w).exists()).toBe(true)
    expect(blocker(w).exists()).toBe(false)
  })

  it('延时内撤掉不会显示，挡板也随之移除', async () => {
    const w = mount(LoadingOverlay, { props: { visible: true } })
    vi.advanceTimersByTime(100)
    await w.setProps({ visible: false })
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(overlay(w).exists()).toBe(false)
    expect(blocker(w).exists()).toBe(false)
  })

  it('显示后至少停留 minVisible，再撤下', async () => {
    const w = mount(LoadingOverlay, { props: { visible: true, delay: 0, minVisible: 400 } })
    expect(overlay(w).exists()).toBe(true)
    vi.advanceTimersByTime(100)
    await w.setProps({ visible: false })
    vi.advanceTimersByTime(250)
    await nextTick()
    expect(overlay(w).exists()).toBe(true)
    vi.advanceTimersByTime(60)
    await nextTick()
    expect(overlay(w).exists()).toBe(false)
  })

  it('默认插槽替换指示与文字，薄面本身不变', () => {
    const w = mount(LoadingOverlay, {
      props: { visible: true, delay: 0 },
      slots: { default: '<span data-custom>整理中</span>' },
    })
    const el = overlay(w)
    expect(el.find('[data-custom]').text()).toBe('整理中')
    expect(el.find('[role="status"]').exists()).toBe(false)
    expect(el.classes()).toContain('bg-veil')
  })

  it('text 显示在指示下方并作为指示的名称；fixed 覆盖视口', () => {
    const w = mount(LoadingOverlay, {
      props: { visible: true, delay: 0, text: '正在保存', fixed: true },
    })
    const el = overlay(w)
    expect(el.classes()).toContain('fixed')
    expect(el.find('[role="status"]').attributes('aria-label')).toBe('正在保存')
    const text = el.find('p')
    expect(text.text()).toBe('正在保存')
    expect(text.attributes('aria-hidden')).toBe('true')
  })
})
