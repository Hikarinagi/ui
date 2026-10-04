import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Splitter } from './Splitter'
import { SplitterPanel } from './SplitterPanel'
import { SplitterHandle } from './SplitterHandle'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

function attach() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

describe('splitter · reka 打底的可调分栏', () => {
  it('两栏渲染、键盘可调,手柄有可见焦点环与无障碍名', async () => {
    const host = attach()
    await render(
      <Splitter className="h-32 w-[400px]">
        <SplitterPanel defaultSize={50} minSize={20}>
          <p>左栏</p>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel defaultSize={50}>
          <p>右栏</p>
        </SplitterPanel>
      </Splitter>,
      { container: host },
    )
    const element = host.firstElementChild as HTMLElement
    await vi.waitFor(() => expect(element.querySelectorAll('[data-panel]').length).toBe(2))

    const handle = element.querySelector('[role="separator"]') as HTMLElement
    expect(handle.getAttribute('aria-label')).toBe('调整面板大小')

    expect(handle.getBoundingClientRect().width).toBe(8)
    const line = handle.firstElementChild as HTMLElement
    expect(getComputedStyle(line).borderInlineStartWidth).toBe('1px')
    expect(line.getBoundingClientRect().height).toBeGreaterThan(100)

    const first = element.querySelector('[data-panel]') as HTMLElement
    const before = first.getBoundingClientRect().width

    handle.focus()
    await vi.waitFor(() => {
      const s = getComputedStyle(handle)
      expect(s.outlineStyle).toBe('solid')
      expect(s.outlineColor).not.toBe('rgba(0, 0, 0, 0)')
    })

    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(first.getBoundingClientRect().width).toBeGreaterThan(before))

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    await vi.waitFor(() => expect(first.getBoundingClientRect().width).toBeLessThan(before))
  })
})
