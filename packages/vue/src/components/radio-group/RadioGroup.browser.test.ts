import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import RadioGroup from './RadioGroup.vue'
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
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
  { value: 'done', label: '看过' },
]

function mountGroup(props: Record<string, unknown> = {}) {
  const w = mount(RadioGroup, {
    props: {
      options,
      ...props,
      'onUpdate:modelValue': (v: string | number | null | undefined) =>
        w.setProps({ modelValue: v }),
    },
    attrs: { 'aria-label': '状态' },
    attachTo: attach(),
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  return {
    w,
    radios: () => Array.from(w.element.querySelectorAll('[role="radio"]')) as HTMLElement[],
  }
}

describe('radio-group · 键盘', () => {
  it('整组一个 Tab 停靠点，落在已选项上；方向键移动并选中；再 Tab 离开整组', async () => {
    const { w, radios } = mountGroup({ modelValue: 'doing' })
    const before = document.createElement('button')
    document.body.prepend(before)
    const after = document.createElement('button')
    document.body.append(after)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[1]))
    await userEvent.keyboard('{ArrowDown>}')
    await new Promise(r => setTimeout(r, 60))
    await userEvent.keyboard('{/ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[2]))
    await vi.waitFor(() => expect(w.props('modelValue')).toBe('done'))
    for (let i = 0; i < 2; i++) {
      await userEvent.keyboard('{ArrowUp>}')
      await new Promise(r => setTimeout(r, 60))
      await userEvent.keyboard('{/ArrowUp}')
    }
    await vi.waitFor(() => expect(document.activeElement).toBe(radios()[0]))
    await vi.waitFor(() => expect(w.props('modelValue')).toBe('wish'))
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(after))
  })

  it('点文字即选中，圆点出现；三档圆为 14 / 16 / 18 的正圆', async () => {
    const { w, radios } = mountGroup()
    const labels = Array.from(w.element.querySelectorAll('[data-hn-radio] > span')) as HTMLElement[]
    await userEvent.click(labels[2]!)
    await vi.waitFor(() => expect(w.props('modelValue')).toBe('done'))
    await vi.waitFor(() => expect(radios()[2]!.querySelector('span')).toBeTruthy())
    for (const [size, px] of [
      ['sm', 14],
      ['md', 16],
      ['lg', 18],
    ] as const) {
      const { radios: sized } = mountGroup({ size })
      const box = sized()[0]!
      expect(box.offsetWidth).toBe(px)
      expect(box.offsetHeight).toBe(px)
      expect(parseFloat(getComputedStyle(box).borderRadius)).toBeGreaterThanOrEqual(px)
    }
  })
})
