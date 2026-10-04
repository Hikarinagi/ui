import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { SearchInput, type SearchInputProps } from './SearchInput'
import { Input } from '../input/Input'
import '../../../test/browser.css'

function attach() {
  const host = document.createElement('div')
  host.style.width = '240px'
  document.body.appendChild(host)
  return host
}

async function mountIn(ui: ReactNode) {
  const host = attach()
  await render(ui, { container: host })
  return host.firstElementChild as HTMLElement
}

async function mountField(props: SearchInputProps = {}) {
  const onSearch = vi.fn()
  const root = await mountIn(<SearchInput aria-label="搜索" onSearch={onSearch} {...props} />)
  return { root, input: root.querySelector('input') as HTMLInputElement, onSearch }
}

describe('search-input · 与 Input 同一副输入面', () => {
  it('三档高度与 Input 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const input = await mountIn(<Input size={size} aria-label={size} />)
      const { root } = await mountField({ size })
      expect(root.offsetHeight).toBe(input.offsetHeight)
    }
  })

  it('前置图标占一格正方形，输入区起始内边距归零，原生取消钮不渲染', async () => {
    const { root, input } = await mountField({ defaultValue: '星见' })
    const box = root.querySelector(':scope > span') as HTMLElement
    expect(box.querySelector('svg')).toBeTruthy()
    expect(box.getBoundingClientRect().width).toBe(root.offsetHeight)
    expect(getComputedStyle(input).paddingInlineStart).toBe('0px')
    expect(getComputedStyle(input, '::-webkit-search-cancel-button').appearance).toBe('none')
  })

  it('聚焦时 accent 环落在容器上，与 Input 同一条规则', async () => {
    const reference = await mountIn(<Input aria-label="input" />)
    await userEvent.click(reference)
    await vi.waitFor(() =>
      expect(getComputedStyle(reference).boxShadow).toContain('0px 0px 0px 2px'),
    )
    const focused = getComputedStyle(reference).boxShadow

    const { root, input } = await mountField()
    await userEvent.click(input)
    await vi.waitFor(() => expect(getComputedStyle(root).boxShadow).toBe(focused))
  })
})

describe('search-input · 清除与提交', () => {
  it('点击清除钮清空、焦点留在输入区；Enter 提交当前值', async () => {
    const { root, input, onSearch } = await mountField({ defaultValue: '' })
    await userEvent.click(input)
    await userEvent.keyboard('狼と香辛料')
    await vi.waitFor(() => expect(root.querySelector('button')).toBeTruthy())
    await userEvent.keyboard('{Enter}')
    expect(onSearch.mock.calls).toEqual([['狼と香辛料']])

    await userEvent.click(root.querySelector('button') as HTMLElement)
    await vi.waitFor(() => expect(input.value).toBe(''))
    expect(document.activeElement).toBe(input)
    await vi.waitFor(() => expect(root.querySelector('button')).toBeNull())
  })
})
