import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { RingProgress } from './RingProgress'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

describe('RingProgress', () => {
  it('弧长按比例绘制，中心显示百分比，标题在环下方', async () => {
    const { container, unmount } = render(<RingProgress value={72} label="已完成" showValue />)
    const wrapper = container.firstElementChild as HTMLElement
    const root = wrapper.querySelector('[role="progressbar"]')!
    expect(root.getAttribute('aria-valuenow')).toBe('72')
    expect(root.getAttribute('aria-label')).toBe('已完成')
    const arc = wrapper.querySelectorAll('circle')[1]!
    expect(arc.getAttribute('stroke-dashoffset')).toBe('28')
    expect(arc.getAttribute('stroke-linecap')).toBe('round')
    expect(wrapper.textContent).toContain('72%')
    expect(wrapper.textContent).toContain('已完成')
    await expectNoA11yViolations(wrapper)
    unmount()
  })

  it('没有 value 时是未知进度，弧固定为四分之一，不显示数值', () => {
    const wrapper = render(<RingProgress showValue />).container.firstElementChild as HTMLElement
    expect(wrapper.querySelector('[role="progressbar"]')!.getAttribute('data-state')).toBe(
      'indeterminate',
    )
    expect(wrapper.querySelectorAll('circle')[1]!.getAttribute('stroke-dashoffset')).toBe('75')
    expect(wrapper.textContent).toBe('')
  })

  it('默认插槽替换中心内容；值为 0 时不画圆头', () => {
    const wrapper = render(
      <RingProgress value={0} showValue>
        <span>自定义</span>
      </RingProgress>,
    ).container.firstElementChild as HTMLElement
    expect(wrapper.textContent).toBe('自定义')
    const arc = wrapper.querySelectorAll('circle')[1]!
    expect(arc.getAttribute('stroke-dashoffset')).toBe('100')
    expect(arc.getAttribute('stroke-linecap')).toBeNull()
  })
})
