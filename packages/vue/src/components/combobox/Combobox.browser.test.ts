import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import Combobox from './Combobox.vue'
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
  { value: 'manga', label: '漫画' },
  { label: '周边', options: [{ value: 'cd', label: '音乐 CD' }] },
]

function mountBox(props: Record<string, unknown> = {}) {
  const value = ref<string | number | null | undefined>(props.modelValue as string | undefined)
  const w = mount(Combobox, {
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
    global: { stubs: { transition: false } },
  })
  mounted.push(w)
  const host = w.find('[data-hn-combobox]').element as HTMLElement
  return { w, host, input: host.querySelector('input') as HTMLInputElement, value }
}

const listbox = () => document.querySelector('[role="listbox"]') as HTMLElement | null
const optionsOf = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]
const labels = () => optionsOf().map(o => o.textContent?.trim())

describe('combobox · 筛选与选择', () => {
  it('点击输入框打开列表，输入即筛选（含分组），无匹配时显示空态；点选回写并把文字填回输入框', async () => {
    const { host, input, value } = mountBox()
    await userEvent.click(input)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(labels()).toEqual(['Galgame', '轻小说', '漫画', '音乐 CD'])
    const content = document.querySelector('[data-hn-combobox-content]') as HTMLElement
    await vi.waitFor(() =>
      expect(Math.round(content.getBoundingClientRect().width)).toBe(
        Math.round(host.getBoundingClientRect().width),
      ),
    )

    await userEvent.keyboard('轻')
    await vi.waitFor(() => expect(labels()).toEqual(['轻小说']))
    await userEvent.keyboard('x')
    await vi.waitFor(() => expect(labels()).toEqual([]))
    expect(content.textContent).toContain('无匹配项')
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(labels()).toEqual(['轻小说']))

    await userEvent.click(optionsOf()[0]!)
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    await vi.waitFor(() => expect(listbox()).toBeNull())
    expect(input.value).toBe('轻小说')
  })

  it('键盘：方向键打开并高亮，Enter 选中；失焦后搜索词回落为已选文字', async () => {
    const { input, value } = mountBox({ modelValue: 'gal' })
    input.focus()
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(optionsOf()[1]!.hasAttribute('data-highlighted')).toBe(true))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Control>}a{/Control}xyz')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await userEvent.click(document.body)
    await vi.waitFor(() => expect(listbox()).toBeNull())
    await vi.waitFor(() => expect(input.value).toBe('轻小说'))
  })

  it('展开钮切换列表且不抢输入区焦点；清除钮清空值与文字', async () => {
    const { host, input, value } = mountBox({ modelValue: 'gal', clearable: true })
    const toggle = host.querySelector('button[aria-label="展开选项"]') as HTMLElement
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(listbox()).toBeNull())
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(document.activeElement).toBe(input)
    await userEvent.click(toggle)
    await vi.waitFor(() => expect(listbox()).toBeNull())

    const clear = host.querySelector('button[aria-label="清除"]') as HTMLElement
    await userEvent.click(clear)
    await vi.waitFor(() => expect(value.value).toBeNull())
    expect(input.value).toBe('')
    expect(document.activeElement).toBe(input)
  })

  it('ignoreFilter 时列表照单全收，由调用方按 search 自己筛', async () => {
    const searched = ref('')
    const { input } = mountBox({
      ignoreFilter: true,
      'onUpdate:search': (v: string) => (searched.value = v),
    })
    await userEvent.click(input)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await userEvent.keyboard('轻')
    await vi.waitFor(() => expect(searched.value).toBe('轻'))
    expect(labels()).toEqual(['Galgame', '轻小说', '漫画', '音乐 CD'])
  })
})

describe('combobox · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等；输入区聚焦时环落在宿主上', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const reference = mount(Input, {
        props: { size },
        attrs: { 'aria-label': size },
        attachTo: attach(),
      })
      mounted.push(reference)
      const { host } = mountBox({ size })
      expect(host.offsetHeight).toBe((reference.element as HTMLElement).offsetHeight)
    }
    const { host, input } = mountBox()
    const rest = getComputedStyle(host).boxShadow
    await userEvent.click(input)
    await vi.waitFor(() =>
      expect(getComputedStyle(host).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })
})

describe('combobox · 与 Select 对齐', () => {
  it('展开钮的 chevron 右缩与 Select 的 chevron 相等', async () => {
    const { default: Select } = await import('../select/Select.vue')
    const select = mount(Select, {
      props: { options },
      attrs: { 'aria-label': 'select' },
      attachTo: attach(),
    })
    mounted.push(select)
    const selectTrigger = select.find('[data-hn-select]').element as HTMLElement
    const selectInset =
      selectTrigger.getBoundingClientRect().right -
      selectTrigger.querySelector('svg')!.getBoundingClientRect().right

    const { host } = mountBox()
    const toggle = host.querySelector('button[aria-label="展开选项"]') as HTMLElement
    const inset =
      host.getBoundingClientRect().right -
      toggle.querySelector('svg')!.getBoundingClientRect().right
    expect(inset).toBe(selectInset)
    expect(toggle.offsetHeight).toBe(host.clientHeight)
  })
})

describe('combobox · 删空即清除', () => {
  it('把输入文字删干净后值清空，点外关闭也不会回落成上一个选项', async () => {
    const { input, value } = mountBox({ modelValue: 'gal' })
    await userEvent.click(input)
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}')
    await vi.waitFor(() => expect(value.value).toBeNull())
    await userEvent.click(document.body)
    await vi.waitFor(() => expect(listbox()).toBeNull())
    expect(input.value).toBe('')
    expect(value.value).toBeNull()
  })
})

describe('combobox · 清除钮与 MultiSelect 对齐', () => {
  it('清除钮到 chevron 的间距、清除钮的右缩都与 MultiSelect 相等', async () => {
    const { default: MultiSelect } = await import('../multi-select/MultiSelect.vue')
    const multi = mount(MultiSelect, {
      props: { options, modelValue: ['gal'], clearable: true },
      attrs: { 'aria-label': 'multi' },
      attachTo: attach(),
    })
    mounted.push(multi)
    const multiHost = multi.find('[data-hn-multi-select]').element as HTMLElement
    const multiClear = multiHost.querySelector('button[aria-label="清除"]')!.getBoundingClientRect()
    const multiChevron = Array.from(multiHost.querySelectorAll('svg'))
      .at(-1)!
      .getBoundingClientRect()

    const { host } = mountBox({ modelValue: 'gal', clearable: true })
    const clear = host.querySelector('button[aria-label="清除"]')!.getBoundingClientRect()
    const chevron = host.querySelector('button[aria-label="展开选项"] svg')!.getBoundingClientRect()

    expect(chevron.left - clear.right).toBe(multiChevron.left - multiClear.right)
    expect(clear.width).toBe(multiClear.width)
    expect(clear.height).toBe(multiClear.height)
    expect(host.getBoundingClientRect().right - clear.right).toBe(
      multiHost.getBoundingClientRect().right - multiClear.right,
    )
  })
})
