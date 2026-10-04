import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const sample = `const a = 1\n\n  indented('保留空白')\n`

describe('渲染', () => {
  it('代码原文逐字保留,包括换行与缩进', () => {
    const { container } = render(<CodeBlock code={sample} />)
    expect(container.querySelector('pre code')!.textContent).toBe(sample)
  })

  it('label 显示为语言标签,缺省不渲染', () => {
    expect(render(<CodeBlock code="x" label="ts" />).container.textContent).toContain('ts')
    expect(render(<CodeBlock code="x" />).container.querySelector('span.text-faint')).toBeNull()
  })

  it('滚动区域可聚焦,aria-label 依次取 label、lang、兜底文案', () => {
    const region = render(<CodeBlock code="x" label="配置" />).container.querySelector(
      '[role="region"]',
    )!
    expect(region.getAttribute('tabindex')).toBe('0')
    expect(region.getAttribute('aria-label')).toBe('配置')
    const byLang = render(<CodeBlock code="x" lang="ts" />).container.querySelector(
      '[role="region"]',
    )!
    expect(byLang.getAttribute('aria-label')).toBe('ts')
    const bare = render(<CodeBlock code="x" />).container.querySelector('[role="region"]')!
    expect(bare.getAttribute('aria-label')).toBe('可滚动区域')
  })
})

describe('着色', () => {
  it('lang 命中白名单时异步上色,原文逐字不变', async () => {
    const code = `const a: number = 1\n\n  fn('缩进保留')\n`
    const { container } = render(<CodeBlock code={code} lang="ts" />)
    expect(container.querySelector('code')!.textContent).toBe(code)

    await waitFor(() => expect(container.querySelector('code span[style]')).not.toBeNull(), {
      timeout: 5000,
    })
    expect(container.querySelector('code span[style]')!.getAttribute('style')).toContain(
      '--shiki-light',
    )
    expect(container.querySelector('code')!.textContent).toBe(code)
  })

  it('白名单外的 lang 静默保持素文本', async () => {
    const { tokenize } = await import('./highlighter')
    expect(await tokenize('x', 'brainfuck')).toBeNull()
    expect(await tokenize('ls -la', 'sh')).not.toBeNull()
  })
})

describe('复制', () => {
  it('默认有复制钮,copyable=false 时整组隐藏', () => {
    expect(render(<CodeBlock code="x" />).container.querySelector('button')).not.toBeNull()
    expect(
      render(<CodeBlock code="x" copyable={false} />).container.querySelector('button'),
    ).toBeNull()
  })

  it('点击写入剪贴板原文,钮进入已复制态,两秒后复位', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    const { container } = render(<CodeBlock code={sample} />)
    const btn = container.querySelector('button')!
    expect(btn.getAttribute('aria-label')).toBe('复制代码')

    await act(async () => {
      fireEvent.click(btn)
    })
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(sample))
    await act(async () => {})
    expect(container.querySelector('button')!.getAttribute('aria-label')).toBe('已复制')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    await act(async () => {})
    expect(container.querySelector('button')!.getAttribute('aria-label')).toBe('复制代码')
    vi.useRealTimers()
  })
})

describe('SSR 安全', () => {
  it('服务端渲染素文本,不触发着色管线', async () => {
    const { renderToString } = await import('react-dom/server')
    const html = renderToString(<CodeBlock code="const a = 1" lang="ts" />)
    expect(html).toContain('const a = 1')
    expect(html).not.toContain('--shiki')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const { container } = render(<CodeBlock code={sample} label="ts" />)
    await expectNoA11yViolations(container.firstElementChild as HTMLElement)
  })
})
