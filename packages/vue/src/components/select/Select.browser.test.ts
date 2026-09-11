import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { h, ref } from 'vue'
import { ConfigProvider } from 'reka-ui'
import InputGroup from '../input-group/InputGroup.vue'
import FormField from '../form-field/FormField.vue'
import { expectNoA11yViolations } from '../../../test/axe'
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
  return {
    w,
    trigger: w.find('[data-hn-select-trigger]').element as HTMLButtonElement,
    host: w.find('[data-hn-select]').element as HTMLElement,
    value,
  }
}

const listbox = () => document.querySelector('[role="listbox"]') as HTMLElement | null
const optionsOf = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

describe('select · 打开与选择', () => {
  it('点击打开 listbox，浮层贴触发器宽度，选项按分组渲染；点选后回写并关闭', async () => {
    const { trigger, host, value } = mountSelect()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const content = document.querySelector('[data-hn-select-content]') as HTMLElement
    await vi.waitFor(() =>
      expect(Math.round(content.getBoundingClientRect().width)).toBe(
        Math.round(host.getBoundingClientRect().width),
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
      const { host } = mountSelect({ size })
      expect(host.offsetHeight).toBe((input.element as HTMLElement).offsetHeight)
    }
  })

  it('键盘聚焦触发器时环落在完整输入面上', async () => {
    const { trigger, host } = mountSelect()
    const rest = getComputedStyle(host).boxShadow
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
    await vi.waitFor(() =>
      expect(getComputedStyle(host).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })
})

describe('select · 点选后的 hover', () => {
  it('触发器是按钮型宿主：点选后焦点回来、环亮着，hover 仍落墨，与 Button 同款', async () => {
    const { trigger, host, value } = mountSelect()
    const rest = getComputedStyle(host).backgroundColor
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await userEvent.click(optionsOf()[1]!)
    await vi.waitFor(() => expect(value.value).toBe('ln'))
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
    await userEvent.hover(trigger)
    await vi.waitFor(() => expect(getComputedStyle(host).backgroundColor).not.toBe(rest))
    await userEvent.unhover(trigger)
    await vi.waitFor(() => expect(getComputedStyle(host).backgroundColor).toBe(rest))

    const before = document.createElement('button')
    document.body.prepend(before)
    before.focus()
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(trigger.matches(':focus-visible')).toBe(true))
    await userEvent.hover(trigger)
    await vi.waitFor(() => expect(getComputedStyle(host).backgroundColor).not.toBe(rest))
  })
})

describe('select · 打开时的初始高亮', () => {
  const ink = (el: Element) => parseFloat(getComputedStyle(el, '::after').opacity)
  const vars = (el: Element) => ({
    selected: parseFloat(getComputedStyle(el).getPropertyValue('--hn-state-selected-opacity')),
    hover: parseFloat(getComputedStyle(el).getPropertyValue('--hn-state-hover-opacity')),
  })

  it('鼠标打开：已选项只画选中墨，初始高亮不叠 hover；按方向键后高亮才落墨', async () => {
    const { trigger } = mountSelect({ modelValue: 'ln' })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    const chosen = optionsOf()[1]!
    await vi.waitFor(() => expect(chosen.hasAttribute('data-highlighted')).toBe(true))
    const { selected, hover } = vars(chosen)
    await new Promise(r => setTimeout(r, 250))
    expect(ink(chosen)).toBeCloseTo(selected, 2)
    await userEvent.keyboard('{ArrowDown}')
    const next = optionsOf()[3]!
    await vi.waitFor(() => expect(next.hasAttribute('data-highlighted')).toBe(true))
    await vi.waitFor(() => expect(ink(next)).toBeCloseTo(hover, 2))
  })

  it('键盘打开：初始高亮立刻落墨，已选项是选中加 hover', async () => {
    const { trigger } = mountSelect({ modelValue: 'ln' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    const chosen = optionsOf()[1]!
    await vi.waitFor(() => expect(chosen.hasAttribute('data-highlighted')).toBe(true))
    const { selected, hover } = vars(chosen)
    await vi.waitFor(() => expect(ink(chosen)).toBeCloseTo(selected + hover, 2))
  })
})

describe('select · 浮层的滚动结构', () => {
  it('ScrollArea 满铺面板内缘，内边距在列表层，边缘阴影贴面板边、随圆角裁切', async () => {
    const many = Array.from({ length: 40 }, (_, i) => ({ value: `v${i}`, label: `选项 ${i}` }))
    const { trigger } = mountSelect({ options: many })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    const content = document.querySelector('[data-hn-select-content]') as HTMLElement
    const area = content.querySelector('.hn-scroll-area') as HTMLElement
    expect(area.offsetWidth).toBe(content.clientWidth)
    expect(area.offsetHeight).toBe(content.clientHeight)
    expect(getComputedStyle(content).overflow).toBe('hidden')
    const shadow = content.querySelector('.hn-scroll-shadow[data-side="y-end"]') as HTMLElement
    await vi.waitFor(() => expect(shadow.hasAttribute('data-visible')).toBe(true))
    expect(shadow.offsetWidth).toBe(area.offsetWidth)
    expect(shadow.offsetTop + shadow.offsetHeight).toBe(area.offsetHeight)
  })
})

describe('原生表单', () => {
  it('表单提交选中值，required 参与校验，disabled 时不提交', async () => {
    const form = document.createElement('form')
    document.body.appendChild(form)
    const w = mount(Select, {
      props: { options, modelValue: 'ln', name: 'kind', required: true, autocomplete: 'off' },
      attrs: { 'aria-label': '类型' },
      attachTo: form,
    })
    await flushPromises()
    expect(new FormData(form).get('kind')).toBe('ln')
    expect(w.find('[data-hn-select-trigger]').attributes('aria-required')).toBe('true')
    expect(w.find('[data-hn-select-trigger]').attributes('name')).toBeUndefined()
    expect(w.get('select').attributes('autocomplete')).toBe('off')
    expect(form.checkValidity()).toBe(true)
    await w.setProps({ modelValue: null })
    expect(form.checkValidity()).toBe(false)
    await w.setProps({ modelValue: 'gal', disabled: true })
    expect(new FormData(form).has('kind')).toBe(false)
    expect(form.checkValidity()).toBe(true)
    w.unmount()
  })
})

describe('select · 清除', () => {
  it.each(['pointer', 'Enter', 'Space'])(
    '%s 清除后回写 null、恢复焦点且不打开列表',
    async action => {
      const { w, trigger, host, value } = mountSelect({ modelValue: 'ln', clearable: true })
      const clear = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
      expect(clear.parentElement).toBe(trigger.parentElement)
      expect(host.querySelector('button button')).toBeNull()
      if (action === 'pointer') {
        await userEvent.click(clear)
      } else {
        trigger.focus()
        await userEvent.tab()
        expect(document.activeElement).toBe(clear)
        expect(getComputedStyle(clear).outlineStyle).toBe('solid')
        await userEvent.keyboard(action === 'Space' ? ' ' : '{Enter}')
      }
      await vi.waitFor(() => expect(value.value).toBeNull())
      expect(w.emitted('clear')).toEqual([[]])
      expect(w.emitted('update:modelValue')).toEqual([[null]])
      expect(w.emitted('update:open')).toBeUndefined()
      expect(document.activeElement).toBe(trigger)
      expect(listbox()).toBeNull()
      expect(trigger.hasAttribute('data-placeholder')).toBe(true)
      expect(host.querySelector('[data-hn-select-clear]')).toBeNull()
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(listbox()).toBeTruthy())
      await userEvent.click(optionsOf()[0]!)
      await vi.waitFor(() => expect(value.value).toBe('gal'))
    },
  )

  it('0 和已不在 options 中的值可以清除；空值、未开启与禁用时不显示', async () => {
    const { w, host, value } = mountSelect({
      modelValue: 0,
      clearable: true,
      options: [{ value: 0, label: '零' }],
    })
    await userEvent.click(host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!)
    expect(value.value).toBeNull()
    for (const modelValue of [null, undefined, '']) {
      await w.setProps({ modelValue })
      expect(host.querySelector('[data-hn-select-clear]')).toBeNull()
    }
    await w.setProps({ modelValue: 'missing' })
    expect(host.querySelector('[data-hn-select-clear]')).not.toBeNull()
    await w.setProps({ clearable: false })
    expect(host.querySelector('[data-hn-select-clear]')).toBeNull()
    await w.setProps({ clearable: true, disabled: true })
    expect(host.querySelector('[data-hn-select-clear]')).toBeNull()
    expect(host.querySelector<HTMLButtonElement>('[data-hn-select-trigger]')!.disabled).toBe(true)
  })

  it.each([InputGroup, FormField])(
    '继承外层禁用状态，标签、错误关联与清除按钮语义正确',
    async Parent => {
      const w = mount(Parent, {
        props: {
          disabled: true,
          ...(Parent === FormField ? { label: '类型', error: '请选择' } : {}),
        },
        slots: {
          default: () =>
            h(Select, { options, modelValue: 'ln', clearable: true, 'aria-label': '类型' }),
        },
        attachTo: attach(),
      })
      mounted.push(w)
      const host = w.get('[data-hn-select]').element as HTMLElement
      const trigger = w.get('[data-hn-select-trigger]').element as HTMLButtonElement
      expect(trigger.disabled).toBe(true)
      expect(host.querySelector('[data-hn-select-clear]')).toBeNull()
      await w.setProps({ disabled: false })
      expect(trigger.disabled).toBe(false)
      expect(host.querySelector('[data-hn-select-clear]')).not.toBeNull()
      if (Parent === FormField) {
        expect(w.get('label').attributes('for')).toBe(trigger.id)
        expect(trigger.getAttribute('aria-invalid')).toBe('true')
        expect(
          document.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent,
        ).toBe('请选择')
      }
      await expectNoA11yViolations(w.element)
    },
  )

  it.each(['ltr', 'rtl'])('%s 下清除按钮位于文字与箭头之间，浮层仍对齐整个输入面', async dir => {
    const w = mount(ConfigProvider, {
      props: { dir: dir as 'ltr' | 'rtl' },
      slots: {
        default: () =>
          h(Select, { options, modelValue: 'ln', clearable: true, 'aria-label': '类型' }),
      },
      attachTo: attach(),
    })
    mounted.push(w)
    const host = w.get('[data-hn-select]').element as HTMLElement
    const trigger = w.get('[data-hn-select-trigger]').element as HTMLButtonElement
    const clear = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
    const text = trigger.firstElementChild!.getBoundingClientRect()
    const arrow = trigger.lastElementChild!.getBoundingClientRect()
    const action = clear.getBoundingClientRect()
    const root = host.getBoundingClientRect()
    expect(action.height).toBe(host.clientHeight)
    if (dir === 'ltr') {
      expect(action.right).toBeCloseTo(arrow.left, 1)
      expect(action.left).toBeGreaterThan(text.left)
    } else {
      const a = clear.getBoundingClientRect()
      const icon = trigger.lastElementChild!.getBoundingClientRect()
      expect(a.left).toBeCloseTo(icon.right, 1)
    }
    expect(action.width).toBeGreaterThan(0)
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    await vi.waitFor(() => {
      const box = document.querySelector('[data-hn-select-content]')!.getBoundingClientRect()
      expect(box.width).toBeCloseTo(root.width, 1)
      expect(box.left).toBeCloseTo(root.left, 1)
    })
  })

  it('原生表单清除后提交空值并重新触发 required 校验', async () => {
    const form = document.createElement('form')
    document.body.appendChild(form)
    const w = mount(Select, {
      props: {
        options,
        modelValue: 'ln',
        clearable: true,
        name: 'kind',
        required: true,
        'onUpdate:modelValue': (modelValue?: string | number | null) => w.setProps({ modelValue }),
      },
      attrs: { 'aria-label': '类型' },
      attachTo: form,
    })
    mounted.push(w)
    await flushPromises()
    expect(new FormData(form).get('kind')).toBe('ln')
    expect(form.checkValidity()).toBe(true)
    await userEvent.click(w.get('[data-hn-select-clear]').element)
    await vi.waitFor(() => expect(new FormData(form).get('kind')).toBe(''))
    expect(form.checkValidity()).toBe(false)
    expect(w.emitted('clear')).toEqual([[]])
    expect(listbox()).toBeNull()
  })
})
