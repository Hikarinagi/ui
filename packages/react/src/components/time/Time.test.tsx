import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Time } from './Time'
import { UiLocaleProvider, enUS } from '../../locale'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const text = (el: Element) => el.textContent?.trim()

const base = new Date('2026-08-29T12:00:00Z')

describe('绝对格式', () => {
  it('渲染 time 标签,datetime 是 ISO,文本按 zh-CN 排', () => {
    const el = mount(<Time value={base} />)
    expect(el.tagName).toBe('TIME')
    expect(el.getAttribute('datetime')).toBe(base.toISOString())
    expect(text(el)).toContain('2026')
    expect(text(el)).toContain('8月')
  })

  it('date / time 两档只出对应部分', () => {
    const dateOnly = text(mount(<Time value={base} format="date" />))
    expect(dateOnly).toContain('2026')
    expect(dateOnly).not.toMatch(/\d:\d/)
    const timeOnly = text(mount(<Time value={base} format="time" />))
    expect(timeOnly).not.toContain('2026')
    expect(timeOnly).toMatch(/\d/)
  })

  it('locale 的 tag 驱动 Intl:切 en-US 后是英文月份', () => {
    const el = mount(
      <UiLocaleProvider messages={enUS}>
        <Time value={base} format="date" />
      </UiLocaleProvider>,
    )
    expect(text(el)).toContain('Aug')
  })
})

describe('相对格式', () => {
  it('45 秒内是「刚刚」,更早按 Intl 出中文相对时间,title 带绝对时间', () => {
    vi.useFakeTimers()
    vi.setSystemTime(base)

    const just = mount(<Time value={new Date(base.getTime() - 30_000)} format="relative" />)
    expect(text(just)).toBe('刚刚')

    const minutes = mount(<Time value={new Date(base.getTime() - 3 * 60_000)} format="relative" />)
    expect(text(minutes)).toBe('3分钟前')
    expect(minutes.getAttribute('title')).toContain('2026')

    const days = mount(<Time value={new Date(base.getTime() - 2 * 86_400_000)} format="relative" />)
    expect(text(days)).toBe('前天')
  })

  it('挂载后随时间自动推进', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(base)
    const el = mount(<Time value={new Date(base.getTime() - 40_000)} format="relative" />)
    expect(text(el)).toBe('刚刚')

    await act(async () => {
      vi.advanceTimersByTime(65_000)
    })
    expect(text(el)).toBe('2分钟前')
  })
})

describe('未知值', () => {
  it('null 与不可解析的值退回 span + 未知文案,不带 datetime', () => {
    const empty = mount(<Time value={null} />)
    expect(empty.tagName).toBe('SPAN')
    expect(text(empty)).toBe('未知时间')
    expect(empty.getAttribute('datetime')).toBeNull()

    const bad = mount(<Time value="不是时间" />)
    expect(bad.tagName).toBe('SPAN')
    expect(text(bad)).toBe('未知时间')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const el = mount(<Time value={base} />)
    await expectNoA11yViolations(el)
  })
})
