import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import CheckboxGroup from './CheckboxGroup.vue'
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
  host.style.cssText = 'width: 480px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
]

function mountGroup(props: Record<string, unknown> = {}) {
  const w = mount(CheckboxGroup, {
    props: {
      options,
      ...props,
      'onUpdate:modelValue': (v: Array<string | number>) => w.setProps({ modelValue: v }),
    },
    attrs: { 'aria-label': '类型' },
    attachTo: attach(),
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  return {
    w,
    boxes: () => Array.from(w.element.querySelectorAll('[role="checkbox"]')) as HTMLElement[],
  }
}

describe('checkbox-group · 键盘与布局', () => {
  it('每枚都是 Tab 停靠点，方向键不移动焦点', async () => {
    const { boxes } = mountGroup()
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(boxes()[0]))
    await userEvent.keyboard('{ArrowDown}')
    await new Promise(r => setTimeout(r, 50))
    expect(document.activeElement).toBe(boxes()[0])
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(boxes()[1]))
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(boxes()[2]))
  })

  it('竖排逐行向下，横排同一行', () => {
    const vertical = mountGroup()
    const tops = vertical.boxes().map(b => b.getBoundingClientRect().top)
    expect(tops[1]).toBeGreaterThan(tops[0]!)
    expect(tops[2]).toBeGreaterThan(tops[1]!)
    const horizontal = mountGroup({ orientation: 'horizontal' })
    const rects = horizontal.boxes().map(b => b.getBoundingClientRect())
    expect(rects[1]!.top).toBe(rects[0]!.top)
    expect(rects[2]!.top).toBe(rects[0]!.top)
    expect(rects[1]!.left).toBeGreaterThan(rects[0]!.left)
  })

  it('点文字即加入数组，勾随之出现；空格切换焦点所在项', async () => {
    const { w, boxes } = mountGroup({ modelValue: [] })
    const labels = Array.from(
      w.element.querySelectorAll('[data-hn-checkbox] > span'),
    ) as HTMLElement[]
    await userEvent.click(labels[1]!)
    await vi.waitFor(() => expect(w.props('modelValue')).toEqual(['ln']))
    await vi.waitFor(() => expect(boxes()[1]!.querySelector('svg.lucide-check')).toBeTruthy())
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(w.props('modelValue')).toEqual([]))
  })
})
