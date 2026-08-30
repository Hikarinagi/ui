import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import CopyButton from './CopyButton.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
})

afterEach(() => {
  mounted.forEach(w => w.unmount())
  mounted = []
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
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
    const w = mount(CopyButton, {
      props: { text: 'hello hina', onCopied },
      attachTo: attach(),
    })
    mounted.push(w)

    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('复制')
    expect(btn.classes()).toContain('aspect-square')
    expect(btn.classes()).not.toContain('rounded-full')

    await userEvent.click(btn.element as HTMLElement)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('hello hina'))
    expect(onCopied).toHaveBeenCalledWith('hello hina')
    await vi.waitFor(() => expect(btn.attributes('aria-label')).toBe('已复制'))

    await vi.waitFor(() => expect(btn.attributes('aria-label')).toBe('复制'), { timeout: 3000 })
  })

  it('图标交接:已复制态换成 Check 且带过渡类,不是硬切', async () => {
    stubClipboard()
    const w = mount(CopyButton, {
      props: { text: 'x' },
      global: { stubs: { transition: false } },
      attachTo: attach(),
    })
    mounted.push(w)

    const btn = w.find('button')
    const idle = btn.find('svg').element.innerHTML

    await btn.trigger('click')
    await vi.waitFor(() => expect(btn.findAll('svg').length).toBe(2), { timeout: 500 })
    await vi.waitFor(() => {
      const svgs = btn.findAll('svg')
      expect(svgs.length).toBe(1)
      expect(svgs[0]!.element.innerHTML).not.toBe(idle)
      expect(svgs[0]!.element.getAttribute('class') ?? '').toContain('text-success-text')
    })
  })

  it('label 可覆写;剪贴板失败不进入已复制态', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const w = mount(CopyButton, {
      props: { text: 'x', label: '复制安装命令' },
      attachTo: attach(),
    })
    mounted.push(w)

    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('复制安装命令')
    await userEvent.click(btn.element as HTMLElement)
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    await new Promise(r => setTimeout(r, 100))
    expect(btn.attributes('aria-label')).toBe('复制安装命令')
  })
})
