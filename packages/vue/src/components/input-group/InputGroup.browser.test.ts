import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import InputGroup from './InputGroup.vue'
import InputGroupAddon from './InputGroupAddon.vue'
import Input from '../input/Input.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  host.style.width = '360px'
  document.body.appendChild(host)
  return host
}

function mountGroup(props: Record<string, unknown> = {}) {
  const w = mount(InputGroup, {
    props,
    slots: {
      default: () => [
        h(InputGroupAddon, () => 'https://'),
        h(Input, { 'aria-label': '域名' }),
        h(Button, () => '确定'),
      ],
    },
    attachTo: attach(),
  })
  const root = w.element as HTMLElement
  const [addon, field, button] = Array.from(root.children) as HTMLElement[]
  return {
    w,
    root,
    addon: addon!,
    field: field!,
    button: button!,
    input: field!.querySelector('input')!,
  }
}

describe('input-group · 一副输入面', () => {
  it('三档下组高等于同档 Input，附属段、输入区与按钮都撑满组内高度', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const reference = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      const { root, addon, field, button } = mountGroup({ size })
      expect(root.offsetHeight).toBe((reference.element as HTMLElement).offsetHeight)
      const inner = root.clientHeight
      expect(addon.offsetHeight).toBe(inner)
      expect(field.offsetHeight).toBe(inner)
      expect(button.offsetHeight).toBe(inner)
      expect(getComputedStyle(button).borderRadius).toBe('0px')
    }
  })

  it('输入区聚焦时整组长出环，环从组的边缘生长；组内只有发丝线分隔，没有第二层边框与阴影', async () => {
    const { root, field, input } = mountGroup()
    expect(getComputedStyle(field).boxShadow).toBe('none')
    expect(getComputedStyle(field).borderInlineStartWidth).toBe('1px')
    expect(getComputedStyle(field).borderInlineEndWidth).toBe('0px')
    const rest = getComputedStyle(root).boxShadow
    await userEvent.click(input)
    await vi.waitFor(() =>
      expect(getComputedStyle(root).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })

  it('组内按钮键盘聚焦时轮廓内缩，不被组的裁切吃掉；按下不缩放', async () => {
    const { root, button, input } = mountGroup()
    await userEvent.click(input)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(button)
    expect(getComputedStyle(button).outlineStyle).toBe('solid')
    expect(parseFloat(getComputedStyle(button).outlineOffset)).toBeLessThan(0)
    expect(getComputedStyle(button).getPropertyValue('--hn-press-scale').trim()).toBe('1')
    expect(getComputedStyle(root).overflow).toBe('hidden')
  })
})

describe('input-group · 点击附属段即聚焦', () => {
  it('点前缀聚焦到输入区且光标在开头，点后缀光标在末尾；点按钮不抢', async () => {
    const w = mount(InputGroup, {
      slots: {
        default: () => [
          h(InputGroupAddon, () => 'https://'),
          h(Input, { 'aria-label': '域名', modelValue: 'shion' }),
          h(InputGroupAddon, () => '.moe'),
          h(Button, () => '确定'),
        ],
      },
      attachTo: attach(),
    })
    const root = w.element as HTMLElement
    const [prefix, field, suffix, button] = Array.from(root.children) as HTMLElement[]
    const input = field!.querySelector('input') as HTMLInputElement
    expect(getComputedStyle(prefix!).cursor).toBe('text')

    await userEvent.click(prefix!)
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(0)

    await userEvent.click(suffix!)
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe(5)

    await userEvent.click(button!)
    expect(document.activeElement).toBe(button)
  })
})

describe('input-group · 两个输入区', () => {
  it('点第一个输入框自己的附属格，焦点留在它身上，不跳到后面的输入框', async () => {
    const w = mount(InputGroup, {
      slots: {
        default: () => [
          h(Input, { 'aria-label': '起', modelValue: '10' }, { trailing: () => 'kg' }),
          h(InputGroupAddon, () => '至'),
          h(Input, { 'aria-label': '止', modelValue: '20' }),
        ],
      },
      attachTo: attach(),
    })
    const root = w.element as HTMLElement
    const [first, addon] = Array.from(root.children) as HTMLElement[]
    const inputs = Array.from(root.querySelectorAll('input')) as HTMLInputElement[]
    await userEvent.click(first!.querySelector(':scope > span:last-child') as HTMLElement)
    expect(document.activeElement).toBe(inputs[0])
    expect(inputs[0]!.selectionStart).toBe(2)
    await userEvent.click(addon!)
    expect(document.activeElement).toBe(inputs[1])
    expect(inputs[1]!.selectionStart).toBe(0)
  })
})

describe('input-group · 附属段里的图标', () => {
  it('图标按组的档位取尺寸，与 Input 附属格同一套', async () => {
    const { AtSign } = await import('@lucide/vue')
    for (const [size, px] of [
      ['sm', 14],
      ['md', 16],
      ['lg', 18],
    ] as const) {
      const w = mount(InputGroup, {
        props: { size },
        slots: {
          default: () => [
            h(InputGroupAddon, () => h(AtSign)),
            h(Input, { 'aria-label': size }, { leading: () => h(AtSign) }),
          ],
        },
        attachTo: attach(),
      })
      const icons = Array.from(w.element.querySelectorAll('svg')) as SVGElement[]
      expect(icons).toHaveLength(2)
      for (const icon of icons) expect(icon.getBoundingClientRect().width).toBe(px)
    }
  })
})
