import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import MultiSelect from './MultiSelect.vue'
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
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
  { value: 'anime', label: '动画' },
]

function mountMulti(props: Record<string, unknown> = {}) {
  const value = ref<Array<string | number>>((props.modelValue as Array<string | number>) ?? [])
  const w = mount(MultiSelect, {
    props: {
      options,
      ...props,
      modelValue: value.value,
      'onUpdate:modelValue': (v: Array<string | number>) => {
        value.value = v
        w.setProps({ modelValue: v })
      },
    },
    attrs: { 'aria-label': '类型' },
    attachTo: attach(),
    global: { stubs: { transition: false, 'transition-group': false } },
  })
  mounted.push(w)
  return { w, trigger: w.find('[data-hn-multi-select]').element as HTMLElement, value }
}

const listbox = () => document.querySelector('[role="listbox"]') as HTMLElement | null
const optionsOf = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

describe('multi-select · 多选', () => {
  it('点选多项时列表保持展开，值累积成数组，触发器里出现 Chip', async () => {
    const { trigger, value } = mountMulti()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await userEvent.click(optionsOf()[0]!)
    await vi.waitFor(() => expect(value.value).toEqual(['gal']))
    expect(listbox()).toBeTruthy()
    await userEvent.click(optionsOf()[1]!)
    await vi.waitFor(() => expect(value.value).toEqual(['gal', 'ln']))
    expect(optionsOf()[0]!.getAttribute('aria-selected')).toBe('true')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(listbox()).toBeNull())
    expect(
      Array.from(trigger.querySelectorAll('[data-hn-chip]')).map(c => c.textContent?.trim()),
    ).toEqual(['Galgame', '轻小说'])
  })

  it('点 Chip 的移除钮只移除该项、不打开列表；清除钮清空也不打开', async () => {
    const { trigger, value } = mountMulti({ modelValue: ['gal', 'ln'], clearable: true })
    const removeFirst = trigger.querySelector('[data-hn-chip] button') as HTMLElement
    await userEvent.click(removeFirst)
    await vi.waitFor(() => expect(value.value).toEqual(['ln']))
    await new Promise(r => setTimeout(r, 200))
    expect(listbox()).toBeNull()

    const clear = trigger.querySelector('button[aria-label="清除"]') as HTMLElement
    await userEvent.click(clear)
    await vi.waitFor(() => expect(value.value).toEqual([]))
    await new Promise(r => setTimeout(r, 200))
    expect(listbox()).toBeNull()
    expect(trigger.textContent?.trim()).toBe('请选择')
  })
})

describe('multi-select · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等，Chip 不撑高触发器', () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(input)
      const { trigger } = mountMulti({ size, modelValue: ['gal', 'ln', 'manga'] })
      expect(trigger.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('键盘聚焦时环长在触发器自身上，Enter 打开', async () => {
    const { trigger } = mountMulti()
    const rest = getComputedStyle(trigger).boxShadow
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
    await vi.waitFor(() =>
      expect(getComputedStyle(trigger).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
  })
})

describe('multi-select · 放不下时', () => {
  it('可见 Chip 收缩并截断文字，+N 与清除钮始终留在框内', async () => {
    const long = [
      { value: 'a', label: '这是一个非常非常长的标签名称' },
      { value: 'b', label: '另一个同样非常非常长的标签名称' },
      { value: 'c', label: '第三个也很长的标签名称' },
      { value: 'd', label: '第四个' },
    ]
    const { trigger } = mountMulti({
      options: long,
      modelValue: ['a', 'b', 'c', 'd'],
      maxVisible: 3,
      clearable: true,
    })
    const box = trigger.getBoundingClientRect()
    const chips = Array.from(trigger.querySelectorAll('[data-hn-chip]')) as HTMLElement[]
    expect(chips).toHaveLength(4)
    expect(chips[3]!.textContent?.trim()).toBe('+1')
    for (const chip of chips) {
      const r = chip.getBoundingClientRect()
      expect(r.right).toBeLessThanOrEqual(box.right)
      expect(r.width).toBeGreaterThan(0)
    }
    const label = chips[0]!.querySelector('span.truncate') as HTMLElement
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
    const clear = trigger.querySelector('button[aria-label="清除"]') as HTMLElement
    expect(clear.getBoundingClientRect().right).toBeLessThanOrEqual(box.right)
  })
})

describe('multi-select · 进出场', () => {
  it('清除钮与 Input 的清除钮同一套：清空时原地缩放淡出，能抓到中间帧；Chip 的增减不做动画', async () => {
    const mid = (el: Element) => {
      const opacity = parseFloat(getComputedStyle(el).opacity)
      expect(opacity).toBeGreaterThan(0)
      expect(opacity).toBeLessThan(1)
    }
    const { trigger, value } = mountMulti({ modelValue: ['gal', 'ln'], clearable: true })
    expect(
      trigger.querySelector('[data-hn-chip]')!.parentElement!.classList.contains('hn-collapse-x'),
    ).toBe(false)
    const clear = trigger.querySelector('[data-hn-multi-select-clear]') as HTMLElement
    expect(getComputedStyle(clear).transitionDuration).toBe('0s')

    await userEvent.click(clear.querySelector('button') as HTMLElement)
    await vi.waitFor(() => expect(value.value).toEqual([]))
    await vi.waitFor(() => mid(clear))
    expect(getComputedStyle(clear).scale).not.toBe('none')
    await vi.waitFor(() => expect(clear.isConnected).toBe(false))
    expect(trigger.querySelector('svg')).toBeTruthy()
  })
})

describe('multi-select · 最后一枚 Chip 移除', () => {
  it('清除钮退场期间位置不变，不会被换进来的占位文字挤到左边', async () => {
    const { trigger, value } = mountMulti({ modelValue: ['gal'], clearable: true })
    const clear = trigger.querySelector('[data-hn-multi-select-clear]') as HTMLElement
    const left = clear.offsetLeft
    await userEvent.click(trigger.querySelector('[data-hn-chip] button') as HTMLElement)
    await vi.waitFor(() => expect(value.value).toEqual([]))
    await vi.waitFor(() => expect(parseFloat(getComputedStyle(clear).opacity)).toBeLessThan(1))
    expect(clear.offsetLeft).toBe(left)
    expect(trigger.textContent?.trim()).toBe('请选择')
    await vi.waitFor(() => expect(clear.isConnected).toBe(false))
  })
})

describe('原生表单', () => {
  it('表单提交全部选中值，清空后必填校验失败，禁用后不提交', async () => {
    const form = document.createElement('form')
    document.body.appendChild(form)
    const w = mount(MultiSelect, {
      props: { options, modelValue: ['gal', 'ln'], name: 'kind', required: true },
      attrs: { 'aria-label': '类型' },
      attachTo: form,
    })
    await flushPromises()
    expect(new FormData(form).getAll('kind')).toEqual(['gal', 'ln'])
    expect(w.find('[data-hn-multi-select]').attributes('aria-required')).toBe('true')
    expect(form.checkValidity()).toBe(true)
    await w.setProps({ modelValue: [] })
    expect(new FormData(form).has('kind')).toBe(false)
    expect(form.checkValidity()).toBe(false)
    await w.setProps({ modelValue: ['manga'], disabled: true })
    expect(new FormData(form).has('kind')).toBe(false)
    expect(form.checkValidity()).toBe(true)
    w.unmount()
  })
})
