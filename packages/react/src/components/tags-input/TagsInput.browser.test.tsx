import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { TagsInput } from './TagsInput'
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

async function mountIn(ui: ReactNode, host: HTMLElement = attach()) {
  const screen = await render(ui, { container: host })
  mounted.push(screen)
  return host
}

interface State {
  modelValue?: string[]
  size?: 'sm' | 'md' | 'lg'
  max?: number
}

async function mountTags(props: Partial<State> = {}) {
  const state = signal<State>({ modelValue: [], ...props })
  function Harness() {
    const current = state.use()
    return (
      <TagsInput
        size={current.size}
        max={current.max}
        value={current.modelValue}
        aria-label="标签"
        onValueChange={value => (state.value = { ...state.value, modelValue: value })}
      />
    )
  }
  const host = await mountIn(<Harness />)
  const root = host.querySelector('[data-hn-tags-input]') as HTMLElement
  return {
    state,
    root,
    input: root.querySelector('input[type="text"]') as HTMLInputElement,
    chips: () => Array.from(root.querySelectorAll('[data-hn-chip]')) as HTMLElement[],
  }
}

describe('tags-input · 输入', () => {
  it('Enter 与分隔符都加成标签；空输入里退格直接移除末尾标签', async () => {
    const { state, input } = await mountTags()
    input.focus()
    await userEvent.keyboard('galgame{Enter}')
    await vi.waitFor(() => expect(state.value.modelValue).toEqual(['galgame']))
    expect(input.value).toBe('')
    await userEvent.keyboard('manga,')
    await vi.waitFor(() => expect(state.value.modelValue).toEqual(['galgame', 'manga']))
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.value.modelValue).toEqual(['galgame']))
  })

  it('粘贴按分隔符拆成多个标签', async () => {
    const { state, input } = await mountTags()
    input.focus()
    const data = new DataTransfer()
    data.setData('text', 'a,b,c')
    input.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }))
    await vi.waitFor(() => expect(state.value.modelValue).toEqual(['a', 'b', 'c']))
  })

  it('标签过多时宿主换行长高，输入区仍在最后一行', async () => {
    const { root, input } = await mountTags({
      modelValue: ['visual novel', 'light novel', 'manga', 'anime', 'music'],
    })
    const single = await mountIn(<Input aria-label="对照" />)
    expect(root.offsetHeight).toBeGreaterThan(
      (single.firstElementChild as HTMLElement).offsetHeight,
    )
    const rows = new Set(
      Array.from(root.querySelectorAll('[data-hn-chip], input[type="text"]')).map(el =>
        Math.round(el.getBoundingClientRect().top),
      ),
    )
    expect(rows.size).toBeGreaterThan(1)
    expect(Math.round(input.getBoundingClientRect().bottom)).toBe(
      Math.max(...Array.from(rows)) +
        Math.round(root.querySelector('[data-hn-chip]')!.getBoundingClientRect().height),
    )
  })
})

describe('tags-input · 与输入面同一副尺寸', () => {
  it('没有标签时三档宿主高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { root } = await mountTags({ size })
      expect(root.offsetHeight).toBe((input.firstElementChild as HTMLElement).offsetHeight)
    }
  })

  it('有一行标签时宿主高度不变', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const { root: empty } = await mountTags({ size })
      const { root: filled } = await mountTags({ size, modelValue: ['a', 'b'] })
      expect(filled.offsetHeight).toBe(empty.offsetHeight)
    }
  })

  it('输入区聚焦时环长在宿主上', async () => {
    const { root, input } = await mountTags()
    const rest = getComputedStyle(root).boxShadow
    await userEvent.keyboard('{Tab}')
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    await vi.waitFor(() =>
      expect(getComputedStyle(root).boxShadow).toBe(
        rest.replace('0px 0px 0px 0px', '0px 0px 0px 2px'),
      ),
    )
  })
})

describe('tags-input · 清除钮', () => {
  it('清除钮与 Input 的清除钮同一副方格：贴着末端、到边距相等；标签换行时仍在宿主的水平中轴线上', async () => {
    const host = await mountIn(
      <TagsInput
        value={['visual novel', 'light novel', 'manga', 'anime', 'music']}
        clearable
        aria-label="标签"
      />,
    )
    const root = host.querySelector('[data-hn-tags-input]') as HTMLElement
    const mid = (el: Element) => {
      const box = el.getBoundingClientRect()
      return box.top + box.height / 2
    }
    const chips = Array.from(root.querySelectorAll('[data-hn-chip]'))
    expect(new Set(chips.map(chip => Math.round(mid(chip)))).size).toBeGreaterThan(1)
    const button = root.querySelector('[data-hn-tags-input-clear] button')!
    await vi.waitFor(() => expect(mid(button)).toBeCloseTo(mid(root), 1))
    expect(
      Math.round(root.querySelector('[data-hn-tags-input-clear]')!.getBoundingClientRect().right),
    ).toBe(Math.round(root.getBoundingClientRect().right) - 1)

    const input = await mountIn(<Input clearable value="x" aria-label="对照" />)
    const inputRoot = input.firstElementChild as HTMLElement
    const inset = (el: HTMLElement, selector: string) =>
      Math.round(
        el.getBoundingClientRect().right -
          el.querySelector(selector)!.getBoundingClientRect().right,
      )
    await vi.waitFor(() =>
      expect(inset(root, '[data-hn-tags-input-clear] button')).toBe(inset(inputRoot, 'button')),
    )
  })
})

describe('tags-input · 清除钮与 Input 同一位置', () => {
  it('三档下清除钮到右缘的距离与 Input 的清除钮逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} clearable value="x" aria-label={size} />)
      const inputRoot = input.firstElementChild as HTMLElement
      const host = await mountIn(
        <TagsInput size={size} clearable value={['a']} aria-label="标签" />,
      )
      const root = host.querySelector('[data-hn-tags-input]') as HTMLElement
      const inset = (box: DOMRect, r: DOMRect) => r.right - (box.left + box.width / 2)
      await vi.waitFor(() => {
        const inputClear = inputRoot.querySelector('button')!.getBoundingClientRect()
        const clear = root
          .querySelector('[data-hn-tags-input-clear] button')!
          .getBoundingClientRect()
        expect(inset(clear, root.getBoundingClientRect())).toBeCloseTo(
          inset(inputClear, inputRoot.getBoundingClientRect()),
          1,
        )
        expect(clear.top + clear.height / 2 - root.getBoundingClientRect().top).toBeCloseTo(
          inputClear.top + inputClear.height / 2 - inputRoot.getBoundingClientRect().top,
          1,
        )
      })
    }
  })
})

describe('tags-input · 标签没有选中态', () => {
  it('点标签或者输入面空白处即聚焦输入区；标签不带选中态；方向键不会选中标签，退格删的永远是末尾那枚', async () => {
    const { state, input, chips } = await mountTags({ modelValue: ['galgame', 'manga', 'anime'] })
    await userEvent.click(chips()[0]!.querySelector('.truncate')!)
    await vi.waitFor(() => expect(document.activeElement).toBe(input))
    expect(chips().map(chip => chip.getAttribute('data-state'))).toEqual([null, null, null])
    expect(chips().map(chip => chip.getAttribute('aria-current'))).toEqual([null, null, null])
    await userEvent.keyboard('{ArrowLeft}')
    await userEvent.keyboard('{Backspace}')
    await vi.waitFor(() => expect(state.value.modelValue).toEqual(['galgame', 'manga']))
    expect(chips().map(chip => chip.getAttribute('data-state'))).toEqual([null, null])
    await userEvent.click(chips()[0]!.querySelector('button')!)
    await vi.waitFor(() => expect(state.value.modelValue).toEqual(['manga']))
  })
})
