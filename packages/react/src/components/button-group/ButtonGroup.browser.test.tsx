import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { ButtonGroup, type ButtonGroupProps } from './ButtonGroup'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

function mountGroup(props: ButtonGroupProps = {}) {
  return mount(
    <ButtonGroup {...props}>
      <Button variant="outline" tone="neutral">
        左
      </Button>
      <Button variant="outline" tone="neutral">
        中
      </Button>
      <Button variant="outline" tone="neutral">
        右
      </Button>
    </ButtonGroup>,
  )
}

describe('button group · 拼接组', () => {
  it('role=group 可命名;首尾保外角、接缝侧圆角清零、边框叠 1px', async () => {
    const w = await mountGroup({ label: '对齐方式' })
    const group = w.container.querySelector('[role="group"]')!
    expect(group.getAttribute('aria-label')).toBe('对齐方式')

    const [first, middle, last] = [...w.element.querySelectorAll('button')]
    const cs = (el: HTMLElement) => getComputedStyle(el)

    expect(cs(first!).borderTopLeftRadius).not.toBe('0px')
    expect(cs(first!).borderTopRightRadius).toBe('0px')
    expect(cs(middle!).borderTopLeftRadius).toBe('0px')
    expect(cs(middle!).borderTopRightRadius).toBe('0px')
    expect(cs(last!).borderTopLeftRadius).toBe('0px')
    expect(cs(last!).borderTopRightRadius).not.toBe('0px')

    const seam = middle!.getBoundingClientRect().left - first!.getBoundingClientRect().right
    expect(seam).toBeCloseTo(-1, 0)
  })

  it('focus 的钮提 z,ring 不被邻居盖', async () => {
    const w = await mountGroup()
    const middle = w.element.querySelectorAll('button')[1]!
    await userEvent.keyboard('{Tab}{Tab}')
    expect(document.activeElement).toBe(middle)
    expect(getComputedStyle(middle).zIndex).toBe('10')
  })

  it('组内禁按下缩放,组外照旧', async () => {
    const w = await mountGroup()
    const inner = w.element.querySelector('button')!
    expect(getComputedStyle(inner).getPropertyValue('--hn-press-scale').trim()).toBe('1')

    const lone = await mount(<Button>独钮</Button>)
    const loneScale = getComputedStyle(lone.element).getPropertyValue('--hn-press-scale').trim()
    expect(loneScale).not.toBe('1')
    expect(loneScale).not.toBe('')
  })

  it('divider 组:非首子接缝出非全高 current 色线,默认组与首子都没有', async () => {
    const w = await mountGroup({ divider: true })
    const [first, middle] = [...w.element.querySelectorAll('button')]
    const beforeOf = (el: HTMLElement) => getComputedStyle(el, '::before')

    expect(beforeOf(first!).content).toBe('none')
    const line = beforeOf(middle!)
    expect(line.content).not.toBe('none')
    expect(line.width).toBe('1px')
    const lineHeight = parseFloat(line.height)
    expect(lineHeight).toBeGreaterThan(middle!.offsetHeight * 0.4)
    expect(lineHeight).toBeLessThan(middle!.offsetHeight * 0.6)

    const plain = await mountGroup()
    const mid = plain.element.querySelectorAll('button')[1]!
    expect(getComputedStyle(mid, '::before').content).toBe('none')
  })
})

describe('button group · 纵向与撑满', () => {
  it('纵向:接缝改上下,圆角清零换轴,叠 1px 走 margin-top', async () => {
    const w = await mountGroup({ orientation: 'vertical' })
    const group = w.element
    const [first, , last] = [...group.children] as HTMLElement[]
    expect(getComputedStyle(group).flexDirection).toBe('column')
    expect(group.getAttribute('aria-orientation')).toBe('vertical')

    const round = (el: HTMLElement) => {
      const s = getComputedStyle(el)
      return [s.borderTopLeftRadius, s.borderBottomLeftRadius]
    }
    expect(round(first!)[0]).not.toBe('0px')
    expect(round(first!)[1]).toBe('0px')
    expect(round(last!)[0]).toBe('0px')
    expect(round(last!)[1]).not.toBe('0px')
    expect(getComputedStyle(last!).marginTop).toBe('-1px')
  })

  it('block:整组撑满容器,子项等分', async () => {
    const w = await mountGroup({ block: true })
    const group = w.element
    group.parentElement!.style.width = '600px'
    const [first, second] = [...group.children] as HTMLElement[]
    expect(getComputedStyle(group).display).toBe('flex')
    expect(Math.round(group.getBoundingClientRect().width)).toBe(600)
    expect(
      Math.abs(first!.getBoundingClientRect().width - second!.getBoundingClientRect().width),
    ).toBeLessThan(2)
  })

  it('纵向分隔线走横向细线,横向组不受影响', async () => {
    const vertical = await mountGroup({ orientation: 'vertical', divider: true })
    const target = vertical.element.children[1] as HTMLElement
    const line = getComputedStyle(target, '::before')
    expect(line.content).not.toBe('none')
    expect(parseFloat(line.height)).toBeLessThan(2)
    expect(parseFloat(line.width)).toBeGreaterThan(2)
  })
})
