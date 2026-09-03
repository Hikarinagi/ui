import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import MultiCombobox from './MultiCombobox.vue'
import Combobox from '../combobox/Combobox.vue'
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
  host.style.cssText = 'width: 320px; padding: 40px'
  document.body.appendChild(host)
  return host
}

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
  { value: 3, label: 'Nitroplus' },
  { value: 4, label: 'Yuzusoft' },
]

interface State {
  modelValue?: Array<string | number>
  options: typeof options
  search?: string
  size?: 'sm' | 'md' | 'lg'
  ignoreFilter?: boolean
  loading?: boolean
  clearable?: boolean
}

function mountMulti(props: Partial<State> = {}) {
  const state = reactive<State>({ modelValue: [], options, ...props })
  const w = mount(
    defineComponent({
      render: () =>
        h(MultiCombobox, {
          ...state,
          'aria-label': '制作公司',
          'onUpdate:modelValue': (value: Array<string | number>) => (state.modelValue = value),
          'onUpdate:search': (value: string) => (state.search = value),
        }),
    }),
    { attachTo: attach(), global: { stubs: { transition: false } } },
  )
  mounted.push(w)
  const host = w.find('[data-hn-multi-combobox]').element as HTMLElement
  return {
    state,
    host,
    input: host.querySelector('input[role="combobox"]') as HTMLInputElement,
    chips: () => Array.from(host.querySelectorAll('[data-hn-chip]')) as HTMLElement[],
  }
}

const listbox = () => document.querySelector('[role="listbox"]') as HTMLElement | null
const optionsOf = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

describe('multi-combobox · 输入与选择', () => {
  it('打字即打开并筛选；Enter 勾选高亮项，列表保持展开、搜索词保留、焦点留在输入区；清空输入回到完整列表；Esc 关闭', async () => {
    const { state, input, chips } = mountMulti()
    input.focus()
    await userEvent.keyboard('nitro')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await vi.waitFor(() =>
      expect(optionsOf().map(o => o.textContent?.trim())).toEqual(['Nitroplus']),
    )
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(state.modelValue).toEqual([3]))
    expect(listbox()).toBeTruthy()
    expect(input.value).toBe('nitro')
    expect(optionsOf()[0]!.getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(input)
    expect(chips().map(c => c.textContent?.trim())).toEqual(['Nitroplus'])
    await userEvent.clear(input)
    await vi.waitFor(() => expect(optionsOf()).toHaveLength(4))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() =>
      expect(
        optionsOf().some(
          o => o.hasAttribute('data-highlighted') && o.getAttribute('aria-selected') !== 'true',
        ),
      ).toBe(true),
    )
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(state.modelValue).toHaveLength(2))
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(listbox()).toBeNull())
    expect(document.activeElement).toBe(input)
  })

  it('空输入时退格移除最后一枚 Chip', async () => {
    const { state, input } = mountMulti({ modelValue: [1, 2] })
    input.focus()
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.modelValue).toEqual([1]))
  })

  it('远程搜索：ignoreFilter 不做本地筛选，搜索词经 v-model:search 交出，loading 时展开箭头换成加载指示', async () => {
    const { state, host, input } = mountMulti({ ignoreFilter: true, modelValue: [1] })
    input.focus()
    await userEvent.keyboard('zzz')
    await vi.waitFor(() => expect(state.search).toBe('zzz'))
    await vi.waitFor(() => expect(optionsOf()).toHaveLength(4))
    const toggle = host.querySelector('button[aria-label="展开选项"]')!
    expect(toggle.querySelector('[role="status"]')).toBeNull()
    state.loading = true
    await vi.waitFor(() => expect(toggle.querySelector('[role="status"]')).not.toBeNull())
    state.options = [{ value: 9, label: '新条目' }]
    await vi.waitFor(() => expect(optionsOf().map(o => o.textContent?.trim())).toEqual(['新条目']))
    expect(host.querySelector('[data-hn-chip]')?.textContent?.trim()).toBe('Key')
  })

  it('浮层打开期间不锁定页面滚动，输入区仍可打字', async () => {
    const { input } = mountMulti()
    const before = getComputedStyle(document.body).overflow
    input.focus()
    await userEvent.keyboard('k')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(getComputedStyle(document.body).overflow).toBe(before)
    await userEvent.keyboard('ey')
    expect(input.value).toBe('key')
  })

  it('点击输入面的空白处或者标签正文即聚焦输入区并打开列表；已打开时再点不关闭；展开按钮才切换开合', async () => {
    const { host, input, chips } = mountMulti({ modelValue: [1] })
    const edge = { x: 3, y: Math.round(host.offsetHeight / 2) }
    await userEvent.click(host, { position: edge })
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(document.activeElement).toBe(input)
    const list = listbox()
    await userEvent.click(host, { position: edge })
    expect(listbox()).toBe(list)
    const toggle = host.querySelector('button[aria-label="展开选项"]')!
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(listbox()).toBeNull())
    await userEvent.click(chips()[0]!.firstElementChild!)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(document.activeElement).toBe(input)
  })
})

describe('multi-combobox · 与输入面同一副尺寸', () => {
  it('没有已选项时三档宿主高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { host } = mountMulti({ size })
      expect(host.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('展开箭头的右缩与 Combobox 相等；有清除钮时清除钮到箭头的间距也相等', () => {
    const combobox = mount(Combobox, {
      props: { options, clearable: true, modelValue: 1 },
      attrs: { 'aria-label': '对照' },
      attachTo: attach(),
      global: { stubs: { transition: false } },
    })
    mounted.push(combobox)
    const reference = combobox.find('[data-hn-combobox]').element as HTMLElement
    const { host } = mountMulti({ clearable: true, modelValue: [1] })
    const chevronInset = (root: HTMLElement) =>
      root.getBoundingClientRect().right -
      root.querySelector('button[aria-label="展开选项"] svg')!.getBoundingClientRect().right
    const gap = (root: HTMLElement) =>
      root.querySelector('button[aria-label="展开选项"] svg')!.getBoundingClientRect().left -
      root.querySelector('button[aria-label="清除"]')!.getBoundingClientRect().right
    expect(chevronInset(host)).toBe(chevronInset(reference))
    expect(gap(host)).toBe(gap(reference))
  })

  it('已选项换行时宿主长高，清除钮与箭头停在宿主的水平中轴线上', () => {
    const { host } = mountMulti({
      modelValue: [1, 2, 3, 4],
      clearable: true,
      options: [
        { value: 1, label: 'visual novel studio' },
        { value: 2, label: 'light novel label' },
        { value: 3, label: 'manga publisher' },
        { value: 4, label: 'anime studio' },
      ],
    })
    const mid = (el: Element) => {
      const box = el.getBoundingClientRect()
      return box.top + box.height / 2
    }
    const rows = new Set(
      Array.from(host.querySelectorAll('[data-hn-chip]')).map(chip =>
        Math.round(chip.getBoundingClientRect().top),
      ),
    )
    expect(rows.size).toBeGreaterThan(1)
    expect(mid(host.querySelector('button[aria-label="清除"]')!)).toBeCloseTo(mid(host), 1)
    expect(mid(host.querySelector('button[aria-label="展开选项"]')!)).toBeCloseTo(mid(host), 1)
  })
})
