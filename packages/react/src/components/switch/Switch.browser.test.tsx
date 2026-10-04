import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Switch, type SwitchProps } from './Switch'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 320px; padding: 40px'
  document.body.appendChild(host)
  return host
}

async function mountSwitch(props: Partial<SwitchProps> = {}, label = '自动播放') {
  const model = signal<boolean>(props.checked ?? false)
  function Harness() {
    const value = model.use()
    return (
      <Switch
        {...props}
        {...(label ? {} : { 'aria-label': '自动播放' })}
        checked={value}
        onCheckedChange={next => (model.value = next)}
      >
        {label || undefined}
      </Switch>
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const element = host.firstElementChild as HTMLElement
  const track = element.querySelector('[role="switch"]') as HTMLButtonElement
  const thumb = track.querySelector('[data-hn-thumb]') as HTMLElement
  const w = {
    element,
    find: (selector: string) => element.querySelector(selector) as HTMLElement,
    props: () => ({ checked: model.value }),
    setProps: async (next: { checked: boolean }) => {
      model.value = next.checked
      await tick()
    },
  }
  return { w, track, thumb }
}

const trigger = (el: Element) =>
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

const x = (el: Element) => parseFloat(getComputedStyle(el).translate) || 0

describe('switch · 几何', () => {
  it('三档轨道 32×20 / 40×24 / 48×28，拇指直径 12 / 16 / 20，轨道中心与文字首行中心重合', async () => {
    for (const [size, w, h, t] of [
      ['sm', 32, 20, 12],
      ['md', 40, 24, 16],
      ['lg', 48, 28, 20],
    ] as const) {
      const { w: wrapper, track, thumb } = await mountSwitch({ size })
      expect(track.offsetWidth).toBe(w)
      expect(track.offsetHeight).toBe(h)
      expect(thumb.offsetWidth).toBe(t)
      expect(thumb.offsetHeight).toBe(t)
      const text = wrapper.find(':scope > span')
      const line = parseFloat(getComputedStyle(text).lineHeight)
      const tr = track.getBoundingClientRect()
      const tx = text.getBoundingClientRect()
      expect(Math.abs(tr.top + tr.height / 2 - (tx.top + line / 2))).toBeLessThan(1)
    }
  })

  it('未选中时拇指在起点，选中后位移等于行程；两态下拇指离轨道外缘 4px', async () => {
    const { w, track, thumb } = await mountSwitch()
    expect(x(thumb)).toBe(0)
    const inner = track.clientWidth - 6
    expect(thumb.getBoundingClientRect().left - track.getBoundingClientRect().left).toBe(4)
    await w.setProps({ checked: true })
    await vi.waitFor(() => expect(x(thumb)).toBe(inner - thumb.offsetHeight))
    expect(track.getBoundingClientRect().right - thumb.getBoundingClientRect().right).toBe(4)
  })
})

describe('switch · 交互', () => {
  it('点击切换，拇指滑过去能抓到中间帧；轨道随之换色', async () => {
    const { w, track, thumb } = await mountSwitch()
    const rest = getComputedStyle(track).backgroundColor
    await userEvent.click(track)
    await vi.waitFor(() => expect(w.props().checked).toBe(true))
    await vi.waitFor(() => {
      const mid = x(thumb)
      expect(mid).toBeGreaterThan(0)
      expect(mid).toBeLessThan(16)
    })
    await vi.waitFor(() => expect(x(thumb)).toBe(16))
    expect(getComputedStyle(track).backgroundColor).not.toBe(rest)
    await userEvent.click(w.find(':scope > span'))
    await vi.waitFor(() => expect(w.props().checked).toBe(false))
    await vi.waitFor(() => expect(x(thumb)).toBe(0))
  })

  it('禁用时点击不切换；键盘 Tab 落在轨道、空格切换', async () => {
    const disabled = await mountSwitch({ disabled: true })
    trigger(disabled.w.find(':scope > span'))
    await new Promise(r => setTimeout(r, 50))
    expect(disabled.track.getAttribute('aria-checked')).toBe('false')

    const { w, track } = await mountSwitch()
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(track))
    expect(getComputedStyle(track).outlineStyle).toBe('solid')
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(w.props().checked).toBe(true))
  })
})
