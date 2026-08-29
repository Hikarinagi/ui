import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const sample = `const a = 1\n\n  indented('保留空白')\n`

describe('渲染', () => {
  it('代码原文逐字保留,包括换行与缩进', () => {
    const w = mount(CodeBlock, { props: { code: sample } })
    expect(w.find('pre code').element.textContent).toBe(sample)
  })

  it('label 显示为语言标签,缺省不渲染', () => {
    expect(mount(CodeBlock, { props: { code: 'x', label: 'ts' } }).text()).toContain('ts')
    expect(
      mount(CodeBlock, { props: { code: 'x' } })
        .find('span.text-faint')
        .exists(),
    ).toBe(false)
  })

  it('滚动区域可聚焦,aria-label 依次取 label、lang、兜底文案', () => {
    const region = mount(CodeBlock, { props: { code: 'x', label: '配置' } }).find('[role="region"]')
    expect(region.attributes('tabindex')).toBe('0')
    expect(region.attributes('aria-label')).toBe('配置')
    const byLang = mount(CodeBlock, { props: { code: 'x', lang: 'ts' } }).find('[role="region"]')
    expect(byLang.attributes('aria-label')).toBe('ts')
    const bare = mount(CodeBlock, { props: { code: 'x' } }).find('[role="region"]')
    expect(bare.attributes('aria-label')).toBe('可滚动区域')
  })
})

describe('着色', () => {
  it('lang 命中白名单时异步上色,原文逐字不变', async () => {
    const code = `const a: number = 1\n\n  fn('缩进保留')\n`
    const w = mount(CodeBlock, { props: { code, lang: 'ts' }, attachTo: document.body })
    expect(w.find('code').element.textContent).toBe(code)

    await vi.waitFor(() => expect(w.find('code span[style]').exists()).toBe(true), {
      timeout: 5000,
    })
    expect(w.find('code span[style]').attributes('style')).toContain('--shiki-light')
    expect(w.find('code').element.textContent).toBe(code)
  })

  it('白名单外的 lang 静默保持素文本', async () => {
    const { tokenize } = await import('./highlighter')
    expect(await tokenize('x', 'brainfuck')).toBeNull()
    expect(await tokenize('ls -la', 'sh')).not.toBeNull()
  })
})

describe('复制', () => {
  it('默认有复制钮,copyable=false 时整组隐藏', () => {
    expect(
      mount(CodeBlock, { props: { code: 'x' } })
        .find('button')
        .exists(),
    ).toBe(true)
    expect(
      mount(CodeBlock, { props: { code: 'x', copyable: false } })
        .find('button')
        .exists(),
    ).toBe(false)
  })

  it('点击写入剪贴板原文,钮进入已复制态,两秒后复位', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    const w = mount(CodeBlock, { props: { code: sample } })
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('复制代码')

    await btn.trigger('click')
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(sample))
    await w.vm.$nextTick()
    expect(w.find('button').attributes('aria-label')).toBe('已复制')

    vi.advanceTimersByTime(2000)
    await w.vm.$nextTick()
    expect(w.find('button').attributes('aria-label')).toBe('复制代码')
    vi.useRealTimers()
  })
})

describe('SSR 安全', () => {
  it('服务端渲染素文本,不触发着色管线', async () => {
    const { renderToString } = await import('vue/server-renderer')
    const { createSSRApp, h } = await import('vue')
    const app = createSSRApp({
      render: () => h(CodeBlock, { code: 'const a = 1', lang: 'ts' }),
    })
    const html = await renderToString(app)
    expect(html).toContain('const a = 1')
    expect(html).not.toContain('--shiki')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(CodeBlock, {
      props: { code: sample, label: 'ts' },
      attachTo: document.body,
    })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
