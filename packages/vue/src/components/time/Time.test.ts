import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Time from './Time.vue'
import { provideUiLocale, enUS } from '../../locale'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  vi.useRealTimers()
})

const base = new Date('2026-08-29T12:00:00Z')

describe('绝对格式', () => {
  it('渲染 time 标签,datetime 是 ISO,文本按 zh-CN 排', () => {
    const w = mount(Time, { props: { value: base } })
    expect(w.element.tagName).toBe('TIME')
    expect(w.attributes('datetime')).toBe(base.toISOString())
    expect(w.text()).toContain('2026')
    expect(w.text()).toContain('8月')
  })

  it('date / time 两档只出对应部分', () => {
    const dateOnly = mount(Time, { props: { value: base, format: 'date' } }).text()
    expect(dateOnly).toContain('2026')
    expect(dateOnly).not.toMatch(/\d:\d/)
    const timeOnly = mount(Time, { props: { value: base, format: 'time' } }).text()
    expect(timeOnly).not.toContain('2026')
    expect(timeOnly).toMatch(/\d/)
  })

  it('locale 的 tag 驱动 Intl:切 en-US 后是英文月份', () => {
    const host = defineComponent({
      setup() {
        provideUiLocale(enUS)
        return () => h(Time, { value: base, format: 'date' })
      },
    })
    expect(mount(host).text()).toContain('Aug')
  })
})

describe('相对格式', () => {
  it('45 秒内是「刚刚」,更早按 Intl 出中文相对时间,title 带绝对时间', () => {
    vi.useFakeTimers()
    vi.setSystemTime(base)

    const just = mount(Time, {
      props: { value: new Date(base.getTime() - 30_000), format: 'relative' },
    })
    expect(just.text()).toBe('刚刚')

    const minutes = mount(Time, {
      props: { value: new Date(base.getTime() - 3 * 60_000), format: 'relative' },
    })
    expect(minutes.text()).toBe('3分钟前')
    expect(minutes.attributes('title')).toContain('2026')

    const days = mount(Time, {
      props: { value: new Date(base.getTime() - 2 * 86_400_000), format: 'relative' },
    })
    expect(days.text()).toBe('前天')
  })

  it('挂载后随时间自动推进', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(base)
    const w = mount(Time, {
      props: { value: new Date(base.getTime() - 40_000), format: 'relative' },
      attachTo: document.body,
    })
    expect(w.text()).toBe('刚刚')

    vi.advanceTimersByTime(65_000)
    await w.vm.$nextTick()
    expect(w.text()).toBe('2分钟前')
  })
})

describe('未知值', () => {
  it('null 与不可解析的值退回 span + 未知文案,不带 datetime', () => {
    const empty = mount(Time, { props: { value: null } })
    expect(empty.element.tagName).toBe('SPAN')
    expect(empty.text()).toBe('未知时间')
    expect(empty.attributes('datetime')).toBeUndefined()

    const bad = mount(Time, { props: { value: '不是时间' } })
    expect(bad.element.tagName).toBe('SPAN')
    expect(bad.text()).toBe('未知时间')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Time, { props: { value: base }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
