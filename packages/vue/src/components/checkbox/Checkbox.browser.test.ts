import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import Checkbox from './Checkbox.vue'
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

function mountBox(props: Record<string, unknown> = {}, label = '订阅周报') {
  const w = mount(Checkbox, {
    props: {
      ...props,
      'onUpdate:modelValue': (v: boolean | 'indeterminate') => w.setProps({ modelValue: v }),
    },
    slots: label ? { default: label } : undefined,
    attrs: label ? undefined : { 'aria-label': '全选' },
    attachTo: attach(),
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  return { w, box: w.find('[role="checkbox"]').element as HTMLButtonElement }
}

const ink = (el: Element) => parseFloat(getComputedStyle(el, '::after').opacity)
const hoverVar = (el: Element) =>
  parseFloat(getComputedStyle(el).getPropertyValue('--hn-state-hover-opacity'))

describe('checkbox · 尺寸与对齐', () => {
  it('三档盒为 14 / 16 / 18，盒的中心与文字首行中心重合', () => {
    for (const [size, px] of [
      ['sm', 14],
      ['md', 16],
      ['lg', 18],
    ] as const) {
      const { w, box } = mountBox({ size })
      expect(box.offsetWidth).toBe(px)
      expect(box.offsetHeight).toBe(px)
      const text = w.find(':scope > span > span').element as HTMLElement
      const boxRect = box.getBoundingClientRect()
      const line = parseFloat(getComputedStyle(text).lineHeight)
      const textRect = text.getBoundingClientRect()
      expect(Math.abs(boxRect.top + boxRect.height / 2 - (textRect.top + line / 2))).toBeLessThan(1)
    }
  })

  it('多行文字时盒钉在首行', () => {
    const { w, box } = mountBox(
      {},
      '这是一段很长的说明文字，长到在三百二十像素宽的容器里必须折成两行以上才放得下',
    )
    const text = w.find(':scope > span > span').element as HTMLElement
    expect(text.getBoundingClientRect().height).toBeGreaterThan(
      parseFloat(getComputedStyle(text).lineHeight) * 1.5,
    )
    const line = parseFloat(getComputedStyle(text).lineHeight)
    const boxRect = box.getBoundingClientRect()
    const textRect = text.getBoundingClientRect()
    expect(Math.abs(boxRect.top + boxRect.height / 2 - (textRect.top + line / 2))).toBeLessThan(1)
  })
})

describe('checkbox · 交互', () => {
  it('点文字即切换；Tab 落在盒上，空格切换，Enter 不切换', async () => {
    const { w, box } = mountBox()
    await userEvent.click(w.find(':scope > span').element)
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
    const { w, box } = mountBox()
    const text = w.find(':scope > span').element as HTMLElement
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

    const disabled = mountBox({ disabled: true })
    await userEvent.hover(disabled.w.find(':scope > span').element)
    await new Promise(r => setTimeout(r, 250))
    expect(ink(disabled.box)).toBe(0)
    await disabled.w.find(':scope > span').trigger('click')
    await new Promise(r => setTimeout(r, 50))
    expect(disabled.box.getAttribute('aria-checked')).toBe('false')
    expect(parseFloat(getComputedStyle(disabled.w.element).opacity)).toBeCloseTo(0.5, 2)
  })

  it('勾以缩放淡入进场，能抓到中间帧；取消时淡出后移除；半选显示横线，点一下变为选中', async () => {
    const { w, box } = mountBox()
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

    await w.setProps({ modelValue: 'indeterminate' })
    await vi.waitFor(() => expect(box.querySelector('svg.lucide-minus')).toBeTruthy())
    expect(box.getAttribute('aria-checked')).toBe('mixed')
    await userEvent.click(box)
    await vi.waitFor(() => expect(box.getAttribute('data-state')).toBe('checked'))
    await vi.waitFor(() => expect(box.querySelector('svg.lucide-minus')).toBeNull())
    expect(box.querySelector('svg.lucide-check')).toBeTruthy()
  })
})
