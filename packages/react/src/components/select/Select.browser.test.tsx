import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { ConfigProvider } from '../../lib/config'
import { InputGroup } from '../input-group/InputGroup'
import { FormField } from '../form-field/FormField'
import { expectNoA11yViolations } from '../../../test/axe'
import { Select, type SelectProps, type SelectValue } from './Select'
import { Input } from '../input/Input'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> | void }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  await userEvent.hover(document.documentElement, { position: { x: 0, y: 0 } })
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

async function mountIn(ui: ReactNode, host: HTMLElement = attach()) {
  const screen = await render(ui, { container: host })
  mounted.push(screen)
  return screen
}

const settle = () => new Promise(resolve => setTimeout(resolve, 0))

async function mountSelect(props: Partial<SelectProps> = {}) {
  const value = signal<SelectValue>(props.value)
  const state = signal<Partial<SelectProps>>(props)
  const emitted = { clear: 0, value: [] as SelectValue[], open: [] as boolean[] }
  function Harness() {
    const current = state.use()
    const model = value.use()
    return (
      <Select
        options={options}
        {...current}
        value={model}
        onValueChange={next => {
          emitted.value.push(next)
          value.value = next
        }}
        onOpenChange={open => emitted.open.push(open)}
        onClear={() => emitted.clear++}
        aria-label="类型"
      />
    )
  }
  const host = attach()
  await mountIn(<Harness />, host)
  return {
    w: {
      setProps: async (next: Partial<SelectProps>) => {
        if ('value' in next) value.value = next.value
        state.value = { ...state.value, ...next }
        await settle()
      },
    },
    emitted,
    trigger: host.querySelector('[data-hn-select-trigger]') as HTMLButtonElement,
    host: host.querySelector('[data-hn-select]') as HTMLElement,
    value,
  }
}

const listbox = () => document.querySelector('[role="listbox"]') as HTMLElement | null
const optionsOf = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]

describe('select · 打开与选择', () => {
  it('点击打开 listbox，浮层贴触发器宽度，选项按分组渲染；点选后回写并关闭', async () => {
    const { trigger, host, value } = await mountSelect()
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
    const { trigger, value } = await mountSelect({ value: 'gal' })
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
    const { trigger } = await mountSelect({ options: many })
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
  it('三档高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const inputHost = attach()
      await mountIn(<Input size={size} aria-label={size} />, inputHost)
      const { host } = await mountSelect({ size })
      expect(host.offsetHeight).toBe((inputHost.firstElementChild as HTMLElement).offsetHeight)
    }
  })

  it('键盘聚焦触发器时环落在完整输入面上', async () => {
    const { trigger, host } = await mountSelect()
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
    const { trigger, host, value } = await mountSelect()
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
    const { trigger } = await mountSelect({ value: 'ln' })
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
    const { trigger } = await mountSelect({ value: 'ln' })
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
    const { trigger } = await mountSelect({ options: many })
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
    const state = signal<Partial<SelectProps>>({ value: 'ln' })
    function Harness() {
      const current = state.use()
      return (
        <Select
          options={options}
          name="kind"
          required
          autocomplete="off"
          {...current}
          aria-label="类型"
        />
      )
    }
    const screen = await render(<Harness />, { container: form })
    await vi.waitFor(() => expect(new FormData(form).get('kind')).toBe('ln'))
    const trigger = form.querySelector('[data-hn-select-trigger]')!
    expect(trigger.getAttribute('aria-required')).toBe('true')
    expect(trigger.getAttribute('name')).toBeNull()
    expect(form.querySelector('select')!.getAttribute('autocomplete')).toBe('off')
    expect(form.checkValidity()).toBe(true)
    state.value = { value: null }
    await vi.waitFor(() => expect(form.checkValidity()).toBe(false))
    state.value = { value: 'gal', disabled: true }
    await vi.waitFor(() => expect(new FormData(form).has('kind')).toBe(false))
    expect(form.checkValidity()).toBe(true)
    await screen.unmount()
  })
})

describe('select · 清除', () => {
  it.each(['pointer', 'Enter', 'Space'])(
    '%s 清除后回写 null、恢复焦点且不打开列表',
    async action => {
      const { emitted, trigger, host, value } = await mountSelect({
        value: 'ln',
        clearable: true,
      })
      const clear = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
      expect(clear.parentElement!.parentElement).toBe(trigger.parentElement)
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
      expect(emitted.clear).toBe(1)
      expect(emitted.value).toEqual([null])
      expect(emitted.open).toEqual([])
      expect(document.activeElement).toBe(trigger)
      expect(listbox()).toBeNull()
      expect(trigger.hasAttribute('data-placeholder')).toBe(true)
      await vi.waitFor(() => expect(host.querySelector('[data-hn-select-clear]')).toBeNull())
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(listbox()).toBeTruthy())
      await userEvent.click(optionsOf()[0]!)
      await vi.waitFor(() => expect(value.value).toBe('gal'))
    },
  )

  it('0 和已不在 options 中的值可以清除；空值、未开启与禁用时不显示', async () => {
    const { w, host, value } = await mountSelect({
      value: 0,
      clearable: true,
      options: [{ value: 0, label: '零' }],
    })
    await userEvent.click(host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!)
    expect(value.value).toBeNull()
    for (const next of [null, undefined, '']) {
      await w.setProps({ value: next })
      await vi.waitFor(() => expect(host.querySelector('[data-hn-select-clear]')).toBeNull())
    }
    await w.setProps({ value: 'missing' })
    expect(host.querySelector('[data-hn-select-clear]')).not.toBeNull()
    await w.setProps({ clearable: false })
    await vi.waitFor(() => expect(host.querySelector('[data-hn-select-clear]')).toBeNull())
    await w.setProps({ clearable: true, disabled: true })
    await vi.waitFor(() => expect(host.querySelector('[data-hn-select-clear]')).toBeNull())
    expect(host.querySelector<HTMLButtonElement>('[data-hn-select-trigger]')!.disabled).toBe(true)
  })

  it.each(['InputGroup', 'FormField'] as const)(
    '继承外层禁用状态，标签、错误关联与清除按钮语义正确',
    async Parent => {
      const disabled = signal(true)
      function Harness() {
        const current = disabled.use()
        const select = <Select options={options} value="ln" clearable aria-label="类型" />
        return Parent === 'FormField' ? (
          <FormField disabled={current} label="类型" error="请选择">
            {select}
          </FormField>
        ) : (
          <InputGroup disabled={current}>{select}</InputGroup>
        )
      }
      const root = attach()
      await mountIn(<Harness />, root)
      const host = root.querySelector('[data-hn-select]') as HTMLElement
      const trigger = root.querySelector('[data-hn-select-trigger]') as HTMLButtonElement
      expect(trigger.disabled).toBe(true)
      await vi.waitFor(() => expect(host.querySelector('[data-hn-select-clear]')).toBeNull())
      disabled.value = false
      await settle()
      expect(trigger.disabled).toBe(false)
      expect(host.querySelector('[data-hn-select-clear]')).not.toBeNull()
      if (Parent === 'FormField') {
        expect(root.querySelector('label')!.getAttribute('for')).toBe(trigger.id)
        expect(trigger.getAttribute('aria-invalid')).toBe('true')
        expect(
          document.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent,
        ).toBe('请选择')
      }
      await expectNoA11yViolations(root.firstElementChild!)
    },
  )

  it.each(['ltr', 'rtl'])('%s 下清除按钮位于文字与箭头之间，浮层仍对齐整个输入面', async dir => {
    const root = attach()
    await mountIn(
      <ConfigProvider dir={dir as 'ltr' | 'rtl'}>
        <Select options={options} value="ln" clearable aria-label="类型" />
      </ConfigProvider>,
      root,
    )
    const host = root.querySelector('[data-hn-select]') as HTMLElement
    const trigger = root.querySelector('[data-hn-select-trigger]') as HTMLButtonElement
    const clear = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
    const text = trigger.firstElementChild!.getBoundingClientRect()
    const arrow = trigger.lastElementChild!.getBoundingClientRect()
    const action = clear.getBoundingClientRect()
    const box = host.getBoundingClientRect()
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
      const panel = document.querySelector('[data-hn-select-content]')!.getBoundingClientRect()
      expect(panel.width).toBeCloseTo(box.width, 1)
      expect(panel.left).toBeCloseTo(box.left, 1)
    })
  })

  it('清除图标缩放淡入淡出，退场期间原位保留且长占位文字不侵占图标空间', async () => {
    const { w, host, trigger, value } = await mountSelect({
      clearable: true,
      placeholder: '这是一段超过输入框宽度的占位文字，用来确认清除图标退场时文字仍然截断',
    })
    const text = trigger.firstElementChild as HTMLElement
    const mid = (el: HTMLElement) => {
      const style = getComputedStyle(el)
      expect(Number(style.opacity)).toBeGreaterThan(0)
      expect(Number(style.opacity)).toBeLessThan(1)
      expect(parseFloat(style.scale)).toBeGreaterThan(0.9)
      expect(parseFloat(style.scale)).toBeLessThan(1)
    }
    await w.setProps({ value: 'ln' })
    const clear = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
    const slot = clear.parentElement!
    await vi.waitFor(() => mid(slot))
    await vi.waitFor(() => expect(getComputedStyle(slot).opacity).toBe('1'))
    const left = slot.offsetLeft
    const reserved = getComputedStyle(text).paddingInlineEnd
    expect(parseFloat(reserved)).toBeGreaterThan(0)

    await userEvent.click(clear)
    expect(value.value).toBeNull()
    await vi.waitFor(() => mid(slot))
    expect(slot.offsetLeft).toBe(left)
    expect(getComputedStyle(text).paddingInlineEnd).toBe(reserved)
    expect(slot.inert).toBe(true)
    expect(document.activeElement).toBe(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await vi.waitFor(() => expect(slot.isConnected).toBe(false))
    await vi.waitFor(() => expect(getComputedStyle(text).paddingInlineEnd).toBe('0px'))

    await w.setProps({ value: 'gal' })
    const next = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
    await vi.waitFor(() => mid(next.parentElement!))
    await vi.waitFor(() => expect(getComputedStyle(next.parentElement!).opacity).toBe('1'))
    expect(next.parentElement!.inert).toBe(false)
  })

  it('退场未结束时重新赋值，清除按钮恢复交互，再清空后不残留图标或让位', async () => {
    const { w, host, trigger } = await mountSelect({ value: 'ln', clearable: true })
    const old = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!.parentElement!
    await w.setProps({ value: null })
    await vi.waitFor(() => expect(Number(getComputedStyle(old).opacity)).toBeLessThan(1))
    expect(old.isConnected).toBe(true)
    await w.setProps({ value: 'gal' })
    const clear = host.querySelector<HTMLButtonElement>('[data-hn-select-clear]')!
    await vi.waitFor(() => expect(getComputedStyle(clear.parentElement!).opacity).toBe('1'))
    expect(clear.parentElement!.inert).toBe(false)
    expect(host.querySelectorAll('[data-hn-select-clear]')).toHaveLength(1)
    await userEvent.click(clear)
    await vi.waitFor(() => expect(host.querySelector('[data-hn-select-clear]')).toBeNull())
    expect(getComputedStyle(trigger.firstElementChild!).paddingInlineEnd).toBe('0px')
  })

  it('原生表单清除后提交空值并重新触发 required 校验', async () => {
    const form = document.createElement('form')
    document.body.appendChild(form)
    const value = signal<SelectValue>('ln')
    let cleared = 0
    function Harness() {
      const current = value.use()
      return (
        <Select
          options={options}
          value={current}
          clearable
          name="kind"
          required
          onValueChange={next => (value.value = next)}
          onClear={() => cleared++}
          aria-label="类型"
        />
      )
    }
    await mountIn(<Harness />, form)
    await vi.waitFor(() => expect(new FormData(form).get('kind')).toBe('ln'))
    expect(form.checkValidity()).toBe(true)
    await userEvent.click(form.querySelector('[data-hn-select-clear]')!)
    await vi.waitFor(() => expect(new FormData(form).get('kind')).toBe(''))
    expect(form.checkValidity()).toBe(false)
    expect(cleared).toBe(1)
    expect(listbox()).toBeNull()
  })
})
