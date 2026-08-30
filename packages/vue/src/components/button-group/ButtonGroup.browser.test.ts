import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { defineComponent, h } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import ButtonGroup from './ButtonGroup.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

function mountGroup(props: Record<string, unknown> = {}) {
  const App = defineComponent({
    render: () =>
      h(ButtonGroup, props, () => [
        h(Button, { variant: 'outline', tone: 'neutral' }, () => '左'),
        h(Button, { variant: 'outline', tone: 'neutral' }, () => '中'),
        h(Button, { variant: 'outline', tone: 'neutral' }, () => '右'),
      ]),
  })
  const w = mount(App, { attachTo: attach() })
  mounted.push(w)
  return w
}

describe('button group · 拼接组', () => {
  it('role=group 可命名;首尾保外角、接缝侧圆角清零、边框叠 1px', () => {
    const w = mountGroup({ label: '对齐方式' })
    const group = w.find('[role="group"]')
    expect(group.attributes('aria-label')).toBe('对齐方式')

    const [first, middle, last] = w.findAll('button').map(b => b.element as HTMLElement)
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
    const w = mountGroup()
    const middle = w.findAll('button')[1]!.element as HTMLElement
    await userEvent.keyboard('{Tab}{Tab}')
    expect(document.activeElement).toBe(middle)
    expect(getComputedStyle(middle).zIndex).toBe('10')
  })

  it('组内禁按下缩放,组外照旧', () => {
    const w = mountGroup()
    const inner = w.find('button').element as HTMLElement
    expect(getComputedStyle(inner).getPropertyValue('--hn-press-scale').trim()).toBe('1')

    const lone = mount(Button, { slots: { default: () => '独钮' }, attachTo: attach() })
    mounted.push(lone)
    const loneScale = getComputedStyle(lone.find('button').element)
      .getPropertyValue('--hn-press-scale')
      .trim()
    expect(loneScale).not.toBe('1')
    expect(loneScale).not.toBe('')
  })

  it('divider 组:非首子接缝出非全高 current 色线,默认组与首子都没有', () => {
    const w = mountGroup({ divider: true })
    const [first, middle] = w.findAll('button').map(b => b.element as HTMLElement)
    const beforeOf = (el: HTMLElement) => getComputedStyle(el, '::before')

    expect(beforeOf(first!).content).toBe('none')
    const line = beforeOf(middle!)
    expect(line.content).not.toBe('none')
    expect(line.width).toBe('1px')
    const lineHeight = parseFloat(line.height)
    expect(lineHeight).toBeGreaterThan(middle!.offsetHeight * 0.4)
    expect(lineHeight).toBeLessThan(middle!.offsetHeight * 0.6)

    const plain = mountGroup()
    const mid = plain.findAll('button')[1]!.element as HTMLElement
    expect(getComputedStyle(mid, '::before').content).toBe('none')
  })
})
