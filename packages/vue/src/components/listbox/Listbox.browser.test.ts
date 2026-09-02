import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import Listbox from './Listbox.vue'
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
  { value: 'anime', label: '动画' },
]

type Value = string | number | null | Array<string | number>

function mountList(props: Record<string, unknown> = {}) {
  const value = ref<Value | undefined>(props.modelValue as Value | undefined)
  const w = mount(Listbox, {
    props: {
      options,
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (v?: Value) => {
        value.value = v
        w.setProps({ modelValue: v })
      },
    },
    attrs: { 'aria-label': '类型' },
    attachTo: attach(),
  })
  mounted.push(w)
  const root = w.element as HTMLElement
  return {
    w,
    root,
    value,
    items: () => Array.from(root.querySelectorAll('[role="option"]')) as HTMLElement[],
  }
}

describe('listbox · 选择', () => {
  it('单选：点选回写并带勾，再点另一项换选；禁用项点不动', async () => {
    const { value, items } = mountList()
    await userEvent.click(items()[0]!)
    await vi.waitFor(() => expect(value.value).toBe('gal'))
    expect(items()[0]!.getAttribute('aria-selected')).toBe('true')
    await userEvent.click(items()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    expect(items()[0]!.getAttribute('aria-selected')).toBe('false')
    items()[2]!.click()
    await new Promise(r => setTimeout(r, 100))
    expect(value.value).toBe('ln')
  })

  it('多选：点选累积成数组，再点取消', async () => {
    const { value, items } = mountList({ multiple: true, modelValue: [] })
    await userEvent.click(items()[0]!)
    await userEvent.click(items()[3]!)
    await vi.waitFor(() => expect(value.value).toEqual(['gal', 'anime']))
    await userEvent.click(items()[0]!)
    await vi.waitFor(() => expect(value.value).toEqual(['anime']))
  })

  it('键盘：Tab 进入后方向键高亮、Enter 选中，高亮跳过禁用项', async () => {
    const { value, items } = mountList()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(items()[0]!.hasAttribute('data-highlighted')).toBe(true))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(items()[1]!.hasAttribute('data-highlighted')).toBe(true))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(items()[3]!.hasAttribute('data-highlighted')).toBe(true))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(value.value).toBe('anime'))
  })

  it('超过 maxHeight 时在 ScrollArea 内滚动，键盘高亮跟随滚动', async () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ value: `v${i}`, label: `选项 ${i}` }))
    const { root } = mountList({ options: many, maxHeight: '10rem' })
    const viewport = await vi.waitFor(() => {
      const el = root.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null
      expect(el).toBeTruthy()
      return el!
    })
    expect(root.offsetHeight).toBeLessThanOrEqual(160 + 2)
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    await userEvent.keyboard('{Tab}')
    for (let i = 0; i < 12; i++) await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
  })
})

describe('listbox · 挂载时的高亮', () => {
  const ink = (el: Element) => parseFloat(getComputedStyle(el, '::after').opacity)

  it('已选项挂载即是完整的选中墨，不因 reka 的初始高亮变淡；hover 加深、离开回落', async () => {
    const { items } = mountList({ modelValue: 'ln' })
    const chosen = items()[1]!
    await vi.waitFor(() => expect(chosen.hasAttribute('data-highlighted')).toBe(true))
    const selected = parseFloat(
      getComputedStyle(chosen).getPropertyValue('--hn-state-selected-opacity'),
    )
    await vi.waitFor(() => expect(ink(chosen)).toBeCloseTo(selected, 2))
    await userEvent.hover(chosen)
    await vi.waitFor(() => expect(ink(chosen)).toBeGreaterThan(selected))
    await userEvent.unhover(chosen)
    await vi.waitFor(() => expect(ink(chosen)).toBeCloseTo(selected, 2))
  })

  it('无已选时首项挂载即高亮但不落墨，键盘进入后才落墨', async () => {
    const { items } = mountList()
    await vi.waitFor(() => expect(items()[0]!.hasAttribute('data-highlighted')).toBe(true))
    await new Promise(r => setTimeout(r, 250))
    expect(ink(items()[0]!)).toBe(0)
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(ink(items()[0]!)).toBeGreaterThan(0))
  })
})
