import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useState, type ReactNode } from 'react'
import { Slider, type SliderProps } from './Slider'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const container = render(ui).container
  const element = container.firstElementChild as HTMLElement
  return {
    container,
    element,
    classes: () => [...element.classList],
    find: (selector: string) => container.querySelector(selector) as HTMLElement | null,
    findAll: (selector: string) => [...container.querySelectorAll<HTMLElement>(selector)],
  }
}

const withProvider = (props: SliderProps) =>
  mount(
    <TooltipProvider>
      <Slider {...props} />
    </TooltipProvider>,
  )

describe('结构', () => {
  it('根是 data-hn-slider 的容器，拇指是 role=slider 并带取值范围；attrs 落在拇指上，class 落在根上', async () => {
    const w = mount(<Slider value={30} className="w-64" aria-label="音量" data-x="1" />)
    expect(w.element.getAttribute('data-hn-slider')).toBe('')
    expect(w.classes()).toContain('w-64')
    const thumb = w.find('[role="slider"]')!
    expect(thumb.getAttribute('aria-label')).toBe('音量')
    expect(thumb.getAttribute('data-x')).toBe('1')
    expect(thumb.getAttribute('aria-valuenow')).toBe('30')
    expect(thumb.getAttribute('aria-valuemin')).toBe('0')
    expect(thumb.getAttribute('aria-valuemax')).toBe('100')
    expect(thumb.getAttribute('tabindex')).toBe('0')
    expect(thumb.getAttribute('style')).toContain('left: calc(30%')
  })

  it('min / max / step 与 format 生效；未绑定值时落在 min', async () => {
    const w = mount(<Slider value={2.5} min={1} max={5} step={0.5} format={v => `${v} 星`} />)
    const thumb = w.find('[role="slider"]')!
    expect(thumb.getAttribute('aria-valuemin')).toBe('1')
    expect(thumb.getAttribute('aria-valuemax')).toBe('5')
    cleanup()
    const empty = mount(<Slider min={10} />)
    expect(empty.find('[role="slider"]')!.getAttribute('aria-valuenow')).toBe('10')
  })

  it('取值标签是 Tooltip：none 不挂提示；没有 TooltipProvider 时也不挂；有提供者时拇指是提示的触发器', async () => {
    const bare = mount(<Slider value={1} label="always" />)
    expect(bare.find('[role="slider"]')!.getAttribute('data-state')).toBeNull()
    cleanup()
    const none = withProvider({ value: 1, label: 'none' })
    expect(none.find('[role="slider"]')!.getAttribute('data-state')).toBeNull()
    cleanup()
    const auto = withProvider({ value: 1 })
    expect(auto.find('[role="slider"]')!.getAttribute('data-state')).toBe('closed')
    cleanup()
    const always = withProvider({ value: 1, label: 'always' })
    expect(always.find('[role="slider"]')!.getAttribute('data-state')).toBe('instant-open')
  })

  it('marks 在轨道上按百分比放点，有文字时多一行标签', () => {
    const w = mount(
      <Slider
        value={50}
        marks={[{ value: 0, label: '慢' }, { value: 50 }, { value: 100, label: '快' }]}
      />,
    )
    const dots = w.findAll('[aria-hidden="true"] > span > span.rounded-full')
    expect(dots).toHaveLength(3)
    const holders = dots.map(d => d.parentElement as HTMLElement)
    expect(holders.map(h => h.style.insetInlineStart)).toEqual(['0%', '50%', '100%'])
    const labels = w.findAll('.text-muted > span')
    expect(labels.map(l => l.textContent?.trim())).toEqual(['慢', '', '快'])
    cleanup()
    const bare = mount(<Slider value={50} marks={[{ value: 50 }]} />)
    expect(bare.find('.text-muted')).toBeNull()
  })

  it('三档尺寸落在根的变量上；disabled 落到根与拇指', () => {
    expect(mount(<Slider size="sm" />).classes()).toContain('[--hn-slider-thumb:0.75rem]')
    cleanup()
    expect(mount(<Slider size="lg" />).classes()).toContain('[--hn-slider-h:1.75rem]')
    cleanup()
    const disabled = mount(<Slider value={1} disabled />)
    expect(disabled.element.getAttribute('data-disabled')).toBe('')
    expect(disabled.find('[role="slider"]')!.getAttribute('data-disabled')).toBe('')
    expect(disabled.find('[role="slider"]')!.getAttribute('tabindex')).toBeNull()
  })
})

describe('服务端渲染', () => {
  it('显式 RTL 在服务端同步外层与轨道方向', async () => {
    const html = renderToString(<Slider value={25} dir="rtl" />)
    expect(html.match(/dir="rtl"/g)).toHaveLength(2)
    expect(html).toContain('right:calc(')
  })

  it('首屏就有拇指与填充：位置由根上的进度变量决定，不等水合', async () => {
    const html = renderToString(<Slider value={25} aria-label="音量" />)
    expect(html).toContain('--hn-slider-p:0.25')
    expect(html).toContain('role="slider"')
    const thumb = html.match(/<span[^>]*role="slider"[^>]*>/)?.[0] ?? ''
    expect(thumb).toContain('!block')
    expect(thumb).toContain('!start-[calc(')
    expect(html).toContain('--hn-slider-p)+var(--hn-slider-thumb)+0.5rem)]')
  })
})

describe('交互', () => {
  it('方向键按 step 改值并发 update；End 跳到 max；键盘改值也发 commit', async () => {
    const update = vi.fn()
    const commit = vi.fn()
    function Harness() {
      const [value, setValue] = useState<number | undefined>(50)
      return (
        <Slider
          value={value}
          step={5}
          onValueChange={next => {
            update(next)
            setValue(next)
          }}
          onCommit={commit}
        />
      )
    }
    const w = mount(<Harness />)
    const thumb = w.find('[role="slider"]')!
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(update.mock.calls[0]).toEqual([55])
    expect(commit.mock.calls[0]).toEqual([55])
    fireEvent.keyDown(thumb, { key: 'End' })
    expect(update.mock.calls[1]).toEqual([100])
  })
})

describe('无障碍', () => {
  it('无违规', async () => {
    const w = mount(
      <Slider
        value={40}
        marks={[
          { value: 0, label: '低' },
          { value: 100, label: '高' },
        ]}
        aria-label="音量"
      />,
    )
    await expectNoA11yViolations(w.element)
  })
})
