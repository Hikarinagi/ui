import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Checkbox, type CheckboxProps } from './Checkbox'
import type { CheckedState } from '../../primitives/checkbox'
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

async function mountBox(props: Partial<CheckboxProps> = {}, label = '订阅周报') {
  const model = signal<CheckedState>(props.checked ?? false)
  function Harness() {
    const value = model.use()
    return (
      <Checkbox
        {...props}
        {...(label ? {} : { 'aria-label': '全选' })}
        checked={value}
        onCheckedChange={next => (model.value = next)}
      >
        {label || undefined}
      </Checkbox>
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const element = host.firstElementChild as HTMLElement
  const w = {
    element,
    find: (selector: string) => element.querySelector(selector) as HTMLElement,
    setProps: async (next: { checked: CheckedState }) => {
      model.value = next.checked
      await tick()
    },
  }
  return { w, box: element.querySelector('[role="checkbox"]') as HTMLButtonElement }
}

const trigger = (el: Element) =>
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

const ink = (el: Element) => parseFloat(getComputedStyle(el, '::after').opacity)
const hoverVar = (el: Element) =>
  parseFloat(getComputedStyle(el).getPropertyValue('--hn-state-hover-opacity'))

describe('checkbox · 尺寸与对齐', () => {
  it('三档盒为 14 / 16 / 18，盒的中心与文字首行中心重合', async () => {
    for (const [size, px] of [
      ['sm', 14],
      ['md', 16],
      ['lg', 18],
    ] as const) {
      const { w, box } = await mountBox({ size })
      expect(box.offsetWidth).toBe(px)
      expect(box.offsetHeight).toBe(px)
      const text = w.find(':scope > span')
      const boxRect = box.getBoundingClientRect()
      const line = parseFloat(getComputedStyle(text).lineHeight)
      const textRect = text.getBoundingClientRect()
      expect(Math.abs(boxRect.top + boxRect.height / 2 - (textRect.top + line / 2))).toBeLessThan(1)
    }
  })

  it('多行文字时盒对着整个标题块的中线', async () => {
    const { w, box } = await mountBox(
      {},
      '这是一段很长的说明文字，长到在三百二十像素宽的容器里必须折成两行以上才放得下',
    )
    const text = w.find(':scope > span')
    expect(text.getBoundingClientRect().height).toBeGreaterThan(
      parseFloat(getComputedStyle(text).lineHeight) * 1.5,
    )
    const boxRect = box.getBoundingClientRect()
    const textRect = text.getBoundingClientRect()
    expect(
      Math.abs(boxRect.top + boxRect.height / 2 - (textRect.top + textRect.height / 2)),
    ).toBeLessThan(1)
  })
})

describe('checkbox · 交互', () => {
  it('点文字即切换；Tab 落在盒上，空格切换，Enter 不切换', async () => {
    const { w, box } = await mountBox()
    await userEvent.click(w.find(':scope > span'))
    await vi.waitFor(() => expect(box.getAttribute('aria-checked')).toBe('true'))
    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(box))
    expect(box.matches(':focus-visible')).toBe(true)
    expect(getComputedStyle(box).outlineStyle).toBe('solid')
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(box.getAttribute('aria-checked')).toBe('false'))
    await userEvent.keyboard('{Enter}')
    await new Promise(r => setTimeout(r, 50))
    expect(box.getAttribute('aria-checked')).toBe('false')
  })

  it('悬停文字时盒落 hover 墨；选中后仍只有 hover 墨，不叠选中墨；禁用时不落墨也不切换', async () => {
    const { w, box } = await mountBox()
    const text = w.find(':scope > span')
    expect(ink(box)).toBe(0)
    await userEvent.hover(text)
    await vi.waitFor(() => expect(ink(box)).toBeCloseTo(hoverVar(box), 2))
    await userEvent.unhover(text)
    await vi.waitFor(() => expect(ink(box)).toBe(0))

    await userEvent.click(text)
    await vi.waitFor(() => expect(box.getAttribute('data-state')).toBe('checked'))
    await userEvent.unhover(text)
    await vi.waitFor(() => expect(ink(box)).toBe(0))
    await userEvent.hover(box)
    await vi.waitFor(() => expect(ink(box)).toBeCloseTo(hoverVar(box), 2))

    const disabled = await mountBox({ disabled: true })
    await userEvent.hover(disabled.w.find(':scope > span'))
    await new Promise(r => setTimeout(r, 250))
    expect(ink(disabled.box)).toBe(0)
    trigger(disabled.w.find(':scope > span'))
    await new Promise(r => setTimeout(r, 50))
    expect(disabled.box.getAttribute('aria-checked')).toBe('false')
    expect(parseFloat(getComputedStyle(disabled.w.element).opacity)).toBeCloseTo(0.5, 2)
  })

  it('勾以缩放淡入进场，能抓到中间帧；取消时淡出后移除；半选显示横线，点一下变为选中', async () => {
    const { w, box } = await mountBox()
    const rest = getComputedStyle(box).backgroundColor
    await userEvent.click(box)
    const check = await vi.waitFor(() => {
      const el = box.querySelector('svg.lucide-check') as SVGElement | null
      expect(el).toBeTruthy()
      return el!
    })
    const mid = getComputedStyle(check)
    expect(parseFloat(mid.opacity)).toBeLessThan(1)
    expect(mid.scale === 'none' ? 1 : parseFloat(mid.scale)).toBeLessThan(1)
    await vi.waitFor(() => expect(parseFloat(getComputedStyle(check).opacity)).toBe(1))
    await vi.waitFor(() => expect(getComputedStyle(check).scale).toBe('none'))
    expect(getComputedStyle(box).backgroundColor).not.toBe(rest)

    await userEvent.click(box)
    await vi.waitFor(() => expect(box.getAttribute('data-state')).toBe('unchecked'))
    expect(box.querySelector('svg.lucide-check')).toBeTruthy()
    await vi.waitFor(() => expect(box.querySelector('svg.lucide-check')).toBeNull())

    await w.setProps({ checked: 'indeterminate' })
    await vi.waitFor(() => expect(box.querySelector('svg.lucide-minus')).toBeTruthy())
    expect(box.getAttribute('aria-checked')).toBe('mixed')
    await userEvent.click(box)
    await vi.waitFor(() => expect(box.getAttribute('data-state')).toBe('checked'))
    await vi.waitFor(() => expect(box.querySelector('svg.lucide-minus')).toBeNull())
    expect(box.querySelector('svg.lucide-check')).toBeTruthy()
  })
})
