import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'
import { Prose } from '../prose/Prose'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

async function mount(ui: ReactNode) {
  const screen = await render(ui, { container: attach() })
  return screen.container.firstElementChild as HTMLElement
}

describe('codeblock 与 prose pre 同源', () => {
  it('组件的盒(ScrollArea host)与 prose pre 的盒计算样式一致 —— hn-pre 是唯一来源', async () => {
    const block = await mount(<CodeBlock code="const x = 1" copyable={false} />)
    const prose = await mount(
      <Prose>
        <pre>
          <code>const x = 1</code>
        </pre>
      </Prose>,
    )

    const blockBox = getComputedStyle(block.querySelector('.hn-pre')!)
    const proseBox = getComputedStyle(prose.querySelector('pre')!)
    for (const p of ['backgroundColor', 'borderRadius', 'fontFamily'] as const) {
      expect(blockBox[p], p).toBe(proseBox[p])
    }

    const blockContent = getComputedStyle(block.querySelector('pre')!)
    expect(blockContent.paddingTop).toBe(proseBox.paddingTop)
    expect(blockContent.paddingInlineStart).toBe(proseBox.paddingInlineStart)
    expect(blockBox.paddingTop).toBe('0px')

    const blockCode = getComputedStyle(block.querySelector('code')!)
    const proseCode = getComputedStyle(prose.querySelector('code')!)
    expect(blockCode.fontSize).toBe(proseCode.fontSize)
    expect(proseCode.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(blockCode.fontFamily).toBe(proseCode.fontFamily)
  })

  it('滚动区域聚焦有可见焦点环(焦点在内层宿主,环画在 hn-pre 盒上)', async () => {
    const w = await mount(<CodeBlock code="x" />)
    const host = w.querySelector<HTMLElement>('[data-overlayscrollbars-initialize]')!
    const box = w.querySelector<HTMLElement>('.hn-pre')!
    host.focus()
    await vi.waitFor(() => {
      const s = getComputedStyle(box)
      expect(s.outlineStyle).toBe('solid')
      expect(s.outlineColor).not.toBe('rgba(0, 0, 0, 0)')
    })
  })
})

describe('着色随主题翻转', () => {
  it('token 颜色浅色取 --shiki-light、.dark 下取 --shiki-dark', async () => {
    document.documentElement.classList.remove('dark')
    const w = await mount(<CodeBlock code="const a = 1" lang="ts" />)
    await vi.waitFor(() => expect(w.querySelector('code span[style]')).not.toBeNull(), {
      timeout: 5000,
    })

    const span = w.querySelector<HTMLElement>('code span[style]')!
    const light = getComputedStyle(span).color
    const baseText = getComputedStyle(span.closest('code')!).color
    expect(light).not.toBe(baseText)

    document.documentElement.classList.add('dark')
    await vi.waitFor(() => {
      const dark = getComputedStyle(span).color
      expect(dark).not.toBe(light)
      expect(dark).not.toBe(getComputedStyle(span.closest('code')!).color)
    })
    document.documentElement.classList.remove('dark')
  })
})

describe('复制交互', () => {
  it('padding 对称;角落透明不遮滚动阴影', async () => {
    const w = await mount(<CodeBlock code="const x = 1" lang="ts" />)
    const pre = w.querySelector('pre')!
    const cs = getComputedStyle(pre)
    expect(cs.paddingRight).toBe(cs.paddingLeft)
    const corner = w.querySelector('div.absolute.top-2')!
    expect(getComputedStyle(corner).backgroundColor).toBe('rgba(0, 0, 0, 0)')
  })

  it('点击复制:剪贴板收到原文,aria-label 切到已复制', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    const w = await mount(<CodeBlock code="const x = 1" />)
    const btn = w.querySelector<HTMLElement>('button')!
    await userEvent.click(btn)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('const x = 1'))
    await vi.waitFor(() => expect(btn.getAttribute('aria-label')).toBe('已复制'))
  })
})
