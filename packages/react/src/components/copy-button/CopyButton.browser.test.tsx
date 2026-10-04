import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { CopyButton } from './CopyButton'
import '../../../test/browser.css'

let mounted: RenderResult[] = []

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

async function mount(ui: ReactNode) {
  const w = await render(ui, { container: attach() })
  mounted.push(w)
  return w
}

function stubClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  return writeText
}

describe('copy button · 复制钮惯例', () => {
  it('默认 ghost/neutral/sm 工具位;点击写入剪贴板,词切已复制并发 copied,两秒后复位', async () => {
    const writeText = stubClipboard()
    const onCopied = vi.fn()
    const w = await mount(<CopyButton text="hello hina" onCopied={onCopied} />)

    const btn = w.container.querySelector('button')!
    expect(btn.getAttribute('aria-label')).toBe('复制')
    expect([...btn.classList]).toContain('aspect-square')
    expect([...btn.classList]).not.toContain('rounded-full')

    await userEvent.click(btn)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('hello hina'))
    expect(onCopied).toHaveBeenCalledWith('hello hina')
    await vi.waitFor(() => expect(btn.getAttribute('aria-label')).toBe('已复制'))

    await vi.waitFor(() => expect(btn.getAttribute('aria-label')).toBe('复制'), { timeout: 3000 })
  })

  it('图标交接:已复制态换成 Check 且带过渡类,不是硬切', async () => {
    stubClipboard()
    const w = await mount(<CopyButton text="x" />)

    const btn = w.container.querySelector('button')!
    const idle = btn.querySelector('svg')!.innerHTML

    btn.click()
    await vi.waitFor(() => expect(btn.querySelectorAll('svg').length).toBe(2), { timeout: 500 })
    await vi.waitFor(() => {
      const svgs = btn.querySelectorAll('svg')
      expect(svgs.length).toBe(1)
      expect(svgs[0]!.innerHTML).not.toBe(idle)
      expect(svgs[0]!.getAttribute('class') ?? '').toContain('text-success-text')
    })
  })

  it('label 可覆写;剪贴板失败不进入已复制态', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const w = await mount(<CopyButton text="x" label="复制安装命令" />)

    const btn = w.container.querySelector('button')!
    expect(btn.getAttribute('aria-label')).toBe('复制安装命令')
    await userEvent.click(btn)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    await new Promise(r => setTimeout(r, 100))
    expect(btn.getAttribute('aria-label')).toBe('复制安装命令')
  })
})

describe('copy button · 复位时长可配', () => {
  it('timeout 覆写默认的两秒,到点回到复制态', async () => {
    stubClipboard()
    const w = await mount(<CopyButton text="x" timeout={200} />)

    const btn = w.container.querySelector('button')!
    await userEvent.click(btn)
    await vi.waitFor(() => expect(btn.getAttribute('aria-label')).toBe('已复制'))

    const start = performance.now()
    await vi.waitFor(() => expect(btn.getAttribute('aria-label')).toBe('复制'), { timeout: 1500 })
    expect(performance.now() - start).toBeLessThan(1000)
  })
})
