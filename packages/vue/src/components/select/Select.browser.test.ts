import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import Select from './Select.vue'
import Input from '../input/Input.vue'
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
  host.style.cssText = 'width: 280px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画', disabled: true },
  {
    label: '周边',
    options: [
      { value: 'cd', label: '音乐 CD' },
      { value: 'book', label: '设定集' },
    ],
  },
]

function mountSelect(props: Record<string, unknown> = {}) {
  const value = ref<string | number | null | undefined>(props.modelValue as string | undefined)
  const w = mount(Select, {
    props: {
      options,
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (v?: string | number | null) => {
        value.value = v
        w.setProps({ modelValue: v })
      },
    },
    attrs: { 'aria-label': '类型' },
    attachTo: attach(),
  })
  mounted.push(w)
  return { w, trigger: w.find('[data-hn-select]').element as HTMLButtonElement, value }
}

const listbox = () => document.querySelector('[role="listbox"]') as HTMLElement | null
const optionsOf = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

describe('select · 打开与选择', () => {
  it('点击打开 listbox，浮层贴触发器宽度，选项按分组渲染；点选后回写并关闭', async () => {
    const { trigger, value } = mountSelect()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const content = document.querySelector('[data-hn-select-content]') as HTMLElement
    await vi.waitFor(() =>
      expect(Math.round(content.getBoundingClientRect().width)).toBe(
        Math.round(trigger.getBoundingClientRect().width),
      ),
    )
    expect(content.classList.contains('hn-anim-pop')).toBe(true)
    expect(optionsOf().map(o => o.textContent?.trim())).toEqual([
      'Galgame',
      '轻小说',
      '漫画',
      '音乐 CD',
      '设定集',
    ])
    expect(document.querySelector('[role="group"]')?.textContent).toContain('周边')
    expect(optionsOf()[2]!.getAttribute('data-disabled')).toBe('')

    await userEvent.click(optionsOf()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    await vi.waitFor(() => expect(listbox()).toBeNull())
    expect(trigger.textContent?.trim()).toBe('轻小说')
    expect(document.activeElement).toBe(trigger)
  })

  it('键盘：Enter 打开、方向键高亮、Enter 选中；已选项带勾与 aria-selected', async () => {
    const { trigger, value } = mountSelect({ modelValue: 'gal' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    const current = optionsOf()[0]!
    expect(current.getAttribute('aria-selected')).toBe('true')
    expect(current.querySelector('svg')).toBeTruthy()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(optionsOf()[1]!.hasAttribute('data-highlighted')).toBe(true))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    await vi.waitFor(() => expect(listbox()).toBeNull())
  })

  it('长列表在 ScrollArea 内滚动，键盘高亮跟随滚动', async () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ value: `v${i}`, label: `选项 ${i}` }))
    const { trigger } = mountSelect({ options: many })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    const viewport = await vi.waitFor(() => {
      const el = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null
      expect(el).toBeTruthy()
      return el!
    })
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    expect(getComputedStyle(viewport).overflowY).not.toBe('visible')
    for (let i = 0; i < 15; i++) await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
  })
})

describe('select · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { trigger } = mountSelect({ size })
      expect(trigger.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('键盘聚焦时环长在触发器自身上', async () => {
    const { trigger } = mountSelect()
    const rest = getComputedStyle(trigger).boxShadow
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
    await vi.waitFor(() =>
      expect(getComputedStyle(trigger).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })
})

describe('select · 点选后的 hover', () => {
  it('触发器是按钮型宿主：点选后焦点回来、环亮着，hover 仍落墨，与 Button 同款', async () => {
    const { trigger, value } = mountSelect()
    const rest = getComputedStyle(trigger).backgroundColor
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await userEvent.click(optionsOf()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
    await userEvent.hover(trigger)
    await vi.waitFor(() => expect(getComputedStyle(trigger).backgroundColor).not.toBe(rest))
    await userEvent.unhover(trigger)
    await vi.waitFor(() => expect(getComputedStyle(trigger).backgroundColor).toBe(rest))

    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(trigger.matches(':focus-visible')).toBe(true))
    await userEvent.hover(trigger)
    await vi.waitFor(() => expect(getComputedStyle(trigger).backgroundColor).not.toBe(rest))
  })
})
