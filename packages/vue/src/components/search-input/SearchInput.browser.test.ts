import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import SearchInput from './SearchInput.vue'
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
  host.style.width = '240px'
  document.body.appendChild(host)
  return host
}

function mountField(props: Record<string, unknown> = {}) {
  const w = mount(SearchInput, {
    props: {
      ...props,
      'onUpdate:modelValue': (v: string) => w.setProps({ modelValue: v }),
    },
    attrs: { 'aria-label': '搜索' },
    attachTo: attach(),
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  const root = w.element as HTMLElement
  return { w, root, input: root.querySelector('input') as HTMLInputElement }
}

describe('search-input · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { root } = mountField({ size })
      expect(root.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('前置图标占一格正方形，输入区起始内边距归零，原生取消钮不渲染', () => {
    const { root, input } = mountField({ modelValue: '星见' })
    const box = root.querySelector(':scope > span') as HTMLElement
    expect(box.querySelector('svg')).toBeTruthy()
    expect(box.getBoundingClientRect().width).toBe(root.offsetHeight)
    expect(getComputedStyle(input).paddingInlineStart).toBe('0px')
    expect(getComputedStyle(input, '::-webkit-search-cancel-button').appearance).toBe('none')
  })

  it('聚焦时 accent 环落在容器上，与 Input 同一条规则', async () => {
    const reference = mount(Input, { attrs: { 'aria-label': 'input' }, attachTo: attach() })
    mounted.push(reference)
    await userEvent.click(reference.element as HTMLElement)
    await vi.waitFor(() =>
      expect(getComputedStyle(reference.element as HTMLElement).boxShadow).toContain(
        '0px 0px 0px 2px',
      ),
    )
    const focused = getComputedStyle(reference.element as HTMLElement).boxShadow

    const { root, input } = mountField()
    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(focused))
  })
})

describe('search-input · 清除与提交', () => {
  it('点击清除钮清空、焦点留在输入区；Enter 提交当前值', async () => {
    const { w, root, input } = mountField({ modelValue: '' })
    await userEvent.click(input)
    await userEvent.keyboard('狼と香辛料')
    await vi.waitFor(() => expect(root.querySelector('button')).toBeTruthy())
    await userEvent.keyboard('{Enter}')
    expect(w.emitted('search')).toEqual([['狼と香辛料']])

    await userEvent.click(root.querySelector('button') as HTMLElement)
    await vi.waitFor(() => expect(input.value).toBe(''))
    expect(document.activeElement).toBe(input)
    await vi.waitFor(() => expect(root.querySelector('button')).toBeNull())
  })
})
