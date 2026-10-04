import { act, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LoadingOverlay } from './LoadingOverlay'

vi.mock('../../lib/transition/Transition', () => ({
  Transition: ({ show, children }: { show: boolean; children: ReactElement }) =>
    show ? children : null,
}))

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

const overlay = (c: HTMLElement) => c.querySelector('[data-hn-loading-overlay]')
const blocker = (c: HTMLElement) => c.querySelector('[data-hn-loading-blocker]')

describe('LoadingOverlay', () => {
  it('不可见时不渲染任何东西', () => {
    const { container } = render(<LoadingOverlay />)
    expect(overlay(container)).toBeNull()
    expect(blocker(container)).toBeNull()
  })

  it('可见后先只挂挡板，过了延时才挂遮罩', () => {
    const { container } = render(<LoadingOverlay visible />)
    expect(blocker(container)).not.toBeNull()
    expect(blocker(container)!.classList).toContain('absolute')
    expect(overlay(container)).toBeNull()
    act(() => vi.advanceTimersByTime(299))
    expect(overlay(container)).toBeNull()
    act(() => vi.advanceTimersByTime(1))
    expect(overlay(container)).not.toBeNull()
    expect(blocker(container)).toBeNull()
    expect(overlay(container)!.querySelector('[role="status"]')!.getAttribute('aria-label')).toBe(
      '加载中',
    )
  })

  it('delay 为 0 时立即显示', () => {
    const { container } = render(<LoadingOverlay visible delay={0} />)
    expect(overlay(container)).not.toBeNull()
    expect(blocker(container)).toBeNull()
  })

  it('延时内撤掉不会显示，挡板也随之移除', () => {
    const { container, rerender } = render(<LoadingOverlay visible />)
    act(() => vi.advanceTimersByTime(100))
    rerender(<LoadingOverlay visible={false} />)
    act(() => vi.advanceTimersByTime(500))
    expect(overlay(container)).toBeNull()
    expect(blocker(container)).toBeNull()
  })

  it('显示后至少停留 minVisible，再撤下', () => {
    const { container, rerender } = render(<LoadingOverlay visible delay={0} minVisible={400} />)
    expect(overlay(container)).not.toBeNull()
    act(() => vi.advanceTimersByTime(100))
    rerender(<LoadingOverlay visible={false} delay={0} minVisible={400} />)
    act(() => vi.advanceTimersByTime(250))
    expect(overlay(container)).not.toBeNull()
    act(() => vi.advanceTimersByTime(60))
    expect(overlay(container)).toBeNull()
  })

  it('默认插槽替换指示与文字，薄面本身不变', () => {
    const { container } = render(
      <LoadingOverlay visible delay={0}>
        <span data-custom="">整理中</span>
      </LoadingOverlay>,
    )
    const el = overlay(container)!
    expect(el.querySelector('[data-custom]')!.textContent).toBe('整理中')
    expect(el.querySelector('[role="status"]')).toBeNull()
    expect(el.classList).toContain('bg-veil')
  })

  it('text 显示在指示下方并作为指示的名称；fixed 覆盖视口', () => {
    const { container } = render(<LoadingOverlay visible delay={0} text="正在保存" fixed />)
    const el = overlay(container)!
    expect(el.classList).toContain('fixed')
    expect(el.querySelector('[role="status"]')!.getAttribute('aria-label')).toBe('正在保存')
    const text = el.querySelector('p')!
    expect(text.textContent).toBe('正在保存')
    expect(text.getAttribute('aria-hidden')).toBe('true')
  })
})
