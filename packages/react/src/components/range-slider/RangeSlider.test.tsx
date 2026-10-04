import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState, type ReactNode } from 'react'
import { RangeSlider } from './RangeSlider'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const container = render(ui).container
  const element = container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    findAll: (selector: string) => [...container.querySelectorAll<HTMLElement>(selector)],
  }
}

describe('结构', () => {
  it('根是 role=group，attrs 落在根上；两个拇指各带取值与语言包给的名称；根与拇指各自带进度变量', async () => {
    const w = mount(<RangeSlider value={[20, 60]} className="w-64" aria-label="价格区间" />)
    expect(w.element.getAttribute('role')).toBe('group')
    expect(w.element.getAttribute('aria-label')).toBe('价格区间')
    expect(w.element.getAttribute('data-hn-range-slider')).toBe('')
    expect(w.classes()).toContain('w-64')
    expect(w.element.getAttribute('style')).toContain('--hn-slider-p: 0.2')
    expect(w.element.getAttribute('style')).toContain('--hn-slider-q: 0.6')
    const thumbs = w.findAll('[role="slider"]')
    expect(thumbs).toHaveLength(2)
    expect(thumbs.map(t => t.getAttribute('aria-valuenow'))).toEqual(['20', '60'])
    expect(thumbs.map(t => t.getAttribute('aria-label'))).toEqual(['最小值', '最大值'])
    expect(thumbs[0]!.getAttribute('style')).toContain('--hn-slider-p: 0.2')
    expect(thumbs[1]!.getAttribute('style')).toContain('--hn-slider-p: 0.6')
  })

  it('未绑定值时落在整段范围；三档尺寸落在根上；disabled 落到根与拇指', async () => {
    const empty = mount(<RangeSlider min={10} max={50} />)
    expect(empty.findAll('[role="slider"]').map(t => t.getAttribute('aria-valuenow'))).toEqual([
      '10',
      '50',
    ])
    expect(mount(<RangeSlider size="lg" />).classes()).toContain('[--hn-slider-h:1.75rem]')
    const disabled = mount(<RangeSlider value={[1, 2]} disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    expect(
      disabled.findAll('[role="slider"]').every(t => t.getAttribute('data-disabled') === ''),
    ).toBe(true)
  })
})

describe('服务端渲染', () => {
  it('显式 RTL 在服务端同步外层与轨道方向', async () => {
    const html = renderToString(<RangeSlider value={[25, 75]} dir="rtl" />)
    expect(html.match(/dir="rtl"/g)).toHaveLength(2)
    expect(html).toContain('right:calc(')
  })

  it('首屏就有两个拇指与区间填充', async () => {
    const html = renderToString(<RangeSlider value={[25, 75]} aria-label="区间" />)
    expect(html).toContain('--hn-slider-p:0.25')
    expect(html).toContain('--hn-slider-q:0.75')
    expect(html.match(/role="slider"/g)).toHaveLength(2)
    expect(html).toContain('var(--hn-slider-q)-var(--hn-slider-p)')
  })
})

describe('交互', () => {
  it('方向键移动持焦的拇指并发 update 与 commit；minSteps 阻止两个拇指靠得太近', async () => {
    const update = vi.fn()
    const commit = vi.fn()
    function Harness() {
      const [value, setValue] = useState<[number, number]>([20, 60])
      return (
        <RangeSlider
          value={value}
          step={10}
          minSteps={2}
          onValueChange={next => {
            update(next)
            setValue(next)
          }}
          onCommit={commit}
        />
      )
    }
    const w = mount(<Harness />)
    const thumbs = () => w.findAll('[role="slider"]')
    act(() => thumbs()[1]!.focus())
    fireEvent.keyDown(thumbs()[1]!, { key: 'ArrowLeft' })
    expect(update.mock.calls[0]).toEqual([[20, 50]])
    expect(commit.mock.calls[0]).toEqual([[20, 50]])
    fireEvent.keyDown(thumbs()[1]!, { key: 'ArrowLeft' })
    expect(update.mock.calls[1]).toEqual([[20, 40]])
    fireEvent.keyDown(thumbs()[1]!, { key: 'ArrowLeft' })
    expect(update.mock.calls).toHaveLength(2)
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(
      <RangeSlider value={[20, 60]} marks={[{ value: 0, label: '低' }]} aria-label="价格区间" />,
    )
    await expectNoA11yViolations(w.element)
  })
})
