import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { MultiCombobox } from './MultiCombobox'
import { Combobox } from '../combobox/Combobox'
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
  selectedOptions?: typeof options
  search?: string
  size?: 'sm' | 'md' | 'lg'
  ignoreFilter?: boolean
  loading?: boolean
  clearable?: boolean
}

async function mountIn(ui: ReactNode, host: HTMLElement = attach()) {
  const screen = await render(ui, { container: host })
  mounted.push(screen)
  return host
}

async function mountMulti(props: Partial<State> = {}) {
  const store = signal<State>({ modelValue: [], options, ...props })
  const state = {
    get modelValue() {
      return store.value.modelValue
    },
    get search() {
      return store.value.search
    },
    get selectedOptions() {
      return store.value.selectedOptions
    },
    set loading(loading: boolean) {
      store.value = { ...store.value, loading }
    },
    set options(next: typeof options) {
      store.value = { ...store.value, options: next }
    },
    renameSelected(index: number, label: string) {
      const selectedOptions = store.value.selectedOptions!.map((option, i) =>
        i === index ? { ...option, label } : option,
      )
      store.value = { ...store.value, selectedOptions }
    },
  }
  function Harness() {
    const current = store.use()
    const { modelValue, search, ...rest } = current
    return (
      <MultiCombobox
        {...rest}
        value={modelValue}
        search={search}
        aria-label="制作公司"
        onValueChange={value => (store.value = { ...store.value, modelValue: value })}
        onSearchChange={value => (store.value = { ...store.value, search: value })}
      />
    )
  }
  const container = await mountIn(<Harness />)
  const host = container.querySelector('[data-hn-multi-combobox]') as HTMLElement
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
    const { state, input, chips } = await mountMulti()
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
    const { state, input } = await mountMulti({ modelValue: [1, 2] })
    input.focus()
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.modelValue).toEqual([1]))
  })

  it('远程搜索：ignoreFilter 不做本地筛选，搜索词经 v-model:search 交出，loading 时展开箭头换成加载指示', async () => {
    const { state, host, input } = await mountMulti({ ignoreFilter: true, modelValue: [1] })
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
    const { input } = await mountMulti()
    const before = getComputedStyle(document.body).overflow
    input.focus()
    await userEvent.keyboard('k')
    await vi.waitFor(() => expect(listbox()).toBeTruthy())
    expect(getComputedStyle(document.body).overflow).toBe(before)
    await userEvent.keyboard('ey')
    expect(input.value).toBe('key')
  })

  it('点击输入面的空白处或者标签正文即聚焦输入区并打开列表；已打开时再点不关闭；展开按钮才切换开合', async () => {
    const { host, input, chips } = await mountMulti({ modelValue: [1] })
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
  it('没有已选项时三档宿主高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { host } = await mountMulti({ size })
      expect(host.offsetHeight).toBe((input.firstElementChild as HTMLElement).offsetHeight)
    }
  })

  it('展开箭头的右缩与 Combobox 相等；有清除钮时清除钮到箭头的间距也相等', async () => {
    const combobox = await mountIn(
      <Combobox options={options} clearable value={1} aria-label="对照" />,
    )
    const reference = combobox.querySelector('[data-hn-combobox]') as HTMLElement
    const { host } = await mountMulti({ clearable: true, modelValue: [1] })
    const chevronInset = (root: HTMLElement) =>
      root.getBoundingClientRect().right -
      root.querySelector('button[aria-label="展开选项"] svg')!.getBoundingClientRect().right
    const gap = (root: HTMLElement) =>
      root.querySelector('button[aria-label="展开选项"] svg')!.getBoundingClientRect().left -
      root.querySelector('button[aria-label="清除"]')!.getBoundingClientRect().right
    expect(chevronInset(host)).toBe(chevronInset(reference))
    expect(gap(host)).toBe(gap(reference))
  })

  it('已选项换行时宿主长高，清除钮与箭头停在宿主的水平中轴线上', async () => {
    const { host } = await mountMulti({
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

describe('multi-combobox · 独立选中项资料', () => {
  it('30 个已有标签不混入 5 条搜索结果，空结果与后续搜索也不丢名称', async () => {
    const saved = Array.from({ length: 30 }, (_, i) => ({ value: i + 1, label: `Tag ${i + 1}` }))
    const results = Array.from({ length: 5 }, (_, i) => ({
      value: i + 101,
      label: `Result ${i + 1}`,
    }))
    const { state, input, chips } = await mountMulti({
      modelValue: saved.map(option => option.value),
      selectedOptions: saved,
      options: results,
      ignoreFilter: true,
      clearable: true,
    })
    const chipLabels = () => chips().map(chip => chip.textContent?.trim())
    expect(chipLabels()).toEqual(saved.map(option => option.label))
    await userEvent.click(input)
    await userEvent.keyboard('result')
    await vi.waitFor(() =>
      expect(optionsOf().map(option => option.textContent?.trim())).toEqual(
        results.map(option => option.label),
      ),
    )
    state.options = []
    await vi.waitFor(() => expect(optionsOf()).toHaveLength(0))
    expect(chipLabels()).toEqual(saved.map(option => option.label))
    state.options = results
    await vi.waitFor(() => expect(optionsOf()).toHaveLength(5))
    await userEvent.click(optionsOf()[0]!)
    await vi.waitFor(() =>
      expect(state.modelValue).toEqual([...saved.map(option => option.value), 101]),
    )
    state.options = []
    await vi.waitFor(() => expect(optionsOf()).toHaveLength(0))
    expect(chipLabels()).toEqual([...saved.map(option => option.label), 'Result 1'])
    await userEvent.click(chips()[0]!.querySelector('button')!)
    await vi.waitFor(() => expect(chips()).toHaveLength(30))
    expect(state.modelValue).not.toContain(1)
    await userEvent.click(document.querySelector('[data-hn-multi-combobox-clear] button')!)
    await vi.waitFor(() => expect(chips()).toHaveLength(0))
    expect(state.modelValue).toEqual([])
    expect(state.selectedOptions).toHaveLength(30)
  })

  it('搜索命中已选值时按结果显示一项并保持勾选，不重复也不隐藏', async () => {
    const { state, input, chips } = await mountMulti({
      modelValue: [1],
      options: [{ value: 1, label: 'Candidate' }],
      selectedOptions: [{ value: 1, label: 'Saved name' }],
      ignoreFilter: true,
    })
    await userEvent.click(input)
    await vi.waitFor(() => expect(optionsOf()).toHaveLength(1))
    expect(optionsOf()[0]!.getAttribute('aria-selected')).toBe('true')
    expect(chips()[0]!.textContent?.trim()).toBe('Saved name')
    state.renameSelected(0, 'Updated name')
    await vi.waitFor(() => expect(chips()[0]!.textContent?.trim()).toBe('Updated name'))
    expect(optionsOf()[0]!.textContent?.trim()).toBe('Candidate')
  })
})
