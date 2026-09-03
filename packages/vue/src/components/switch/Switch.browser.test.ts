import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import Switch from './Switch.vue'
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
  host.style.cssText = 'width: 320px; padding: 40px'
  document.body.appendChild(host)
  return host
}

function mountSwitch(props: Record<string, unknown> = {}, label = '自动播放') {
  const w = mount(Switch, {
    props: {
      ...props,
      'onUpdate:modelValue': (v: boolean) => w.setProps({ modelValue: v }),
    },
    slots: label ? { default: label } : undefined,
    attrs: label ? undefined : { 'aria-label': '自动播放' },
    attachTo: attach(),
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  const track = w.find('[role="switch"]').element as HTMLButtonElement
  const thumb = track.querySelector('[data-hn-thumb]') as HTMLElement
  return { w, track, thumb }
}

const x = (el: Element) => parseFloat(getComputedStyle(el).translate) || 0

describe('switch · 几何', () => {
  it('三档轨道 32×20 / 40×24 / 48×28，拇指直径 12 / 16 / 20，轨道中心与文字首行中心重合', () => {
    for (const [size, w, h, t] of [
      ['sm', 32, 20, 12],
      ['md', 40, 24, 16],
      ['lg', 48, 28, 20],
    ] as const) {
      const { w: wrapper, track, thumb } = mountSwitch({ size })
      expect(track.offsetWidth).toBe(w)
      expect(track.offsetHeight).toBe(h)
      expect(thumb.offsetWidth).toBe(t)
      expect(thumb.offsetHeight).toBe(t)
      const text = wrapper.find(':scope > span').element as HTMLElement
      const line = parseFloat(getComputedStyle(text).lineHeight)
      const tr = track.getBoundingClientRect()
      const tx = text.getBoundingClientRect()
      expect(Math.abs(tr.top + tr.height / 2 - (tx.top + line / 2))).toBeLessThan(1)
    }
  })

  it('未选中时拇指在起点，选中后位移等于行程；两态下拇指离轨道外缘 4px', async () => {
    const { w, track, thumb } = mountSwitch()
    expect(x(thumb)).toBe(0)
    const inner = track.clientWidth - 6
    expect(thumb.getBoundingClientRect().left - track.getBoundingClientRect().left).toBe(4)
    await w.setProps({ modelValue: true })
    await vi.waitFor(() => expect(x(thumb)).toBe(inner - thumb.offsetHeight))
    expect(track.getBoundingClientRect().right - thumb.getBoundingClientRect().right).toBe(4)
  })
})

describe('switch · 交互', () => {
  it('点击切换，拇指滑过去能抓到中间帧；轨道随之换色', async () => {
    const { w, track, thumb } = mountSwitch()
    const rest = getComputedStyle(track).backgroundColor
    await userEvent.click(track)
    await vi.waitFor(() => expect(w.props('modelValue')).toBe(true))
    await vi.waitFor(() => {
      const mid = x(thumb)
      expect(mid).toBeGreaterThan(0)
      expect(mid).toBeLessThan(16)
    })
    await vi.waitFor(() => expect(x(thumb)).toBe(16))
    expect(getComputedStyle(track).backgroundColor).not.toBe(rest)
    await userEvent.click(w.find(':scope > span').element)
    await vi.waitFor(() => expect(w.props('modelValue')).toBe(false))
    await vi.waitFor(() => expect(x(thumb)).toBe(0))
  })

  it('禁用时点击不切换；键盘 Tab 落在轨道、空格切换', async () => {
    const disabled = mountSwitch({ disabled: true })
    await disabled.w.find(':scope > span').trigger('click')
    await new Promise(r => setTimeout(r, 50))
    expect(disabled.track.getAttribute('aria-checked')).toBe('false')

    const { w, track } = mountSwitch()
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(track))
    expect(getComputedStyle(track).outlineStyle).toBe('solid')
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(w.props('modelValue')).toBe(true))
  })
})
