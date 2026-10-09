import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { Time } from './Time'
import { TooltipProvider } from '../tooltip/TooltipProvider'
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
  it('45 秒内是「刚刚」,更早按 Intl 出中文相对时间,不带原生 title', () => {
    vi.useFakeTimers()
    vi.setSystemTime(base)

    const just = mount(<Time value={new Date(base.getTime() - 30_000)} format="relative" />)
    expect(text(just)).toBe('刚刚')

    const minutes = mount(<Time value={new Date(base.getTime() - 3 * 60_000)} format="relative" />)
    expect(text(minutes)).toBe('3分钟前')
    expect(minutes.hasAttribute('title')).toBe(false)

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

describe('完整时刻的提示', () => {
  const value = new Date(base.getTime() - 3 * 60_000)
  const inProvider = (ui: ReactNode) =>
    render(<TooltipProvider>{ui}</TooltipProvider>).container.querySelector('time')!

  it('在 TooltipProvider 内,相对时间成为 Tooltip 触发器', () => {
    expect(inProvider(<Time value={value} format="relative" />).getAttribute('data-state')).toBe(
      'closed',
    )
  })

  it('tooltip=false、绝对格式或不在 TooltipProvider 内时不挂 Tooltip', () => {
    expect(
      inProvider(<Time value={value} format="relative" tooltip={false} />).hasAttribute(
        'data-state',
      ),
    ).toBe(false)
    expect(inProvider(<Time value={value} />).hasAttribute('data-state')).toBe(false)
    expect(mount(<Time value={value} format="relative" />).hasAttribute('data-state')).toBe(false)
  })

  it('className 与透传属性仍落在 time 元素上', () => {
    const el = mount(<Time value={value} format="relative" className="text-muted" data-x="1" />)
    expect(el.tagName).toBe('TIME')
    expect(el.classList.contains('text-muted')).toBe(true)
    expect(el.getAttribute('data-x')).toBe('1')
  })
})

describe('水合', () => {
  it('服务端与浏览器算出的相对时间不同时不报水合错误,文字以浏览器为准', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(base)
    const value = new Date(base.getTime() - 30_000)
    const html = renderToString(<Time value={value} format="relative" />)
    expect(html).toContain('刚刚')

    vi.setSystemTime(new Date(base.getTime() + 10 * 60_000))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const recoverable = vi.fn()
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.append(host)
    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      root = hydrateRoot(host, <Time value={value} format="relative" />, {
        onRecoverableError: recoverable,
      })
    })
    expect(host.textContent).toBe('10分钟前')
    expect(recoverable).not.toHaveBeenCalled()
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/hydrat/i)
    await act(async () => root!.unmount())
    host.remove()
    error.mockRestore()
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
