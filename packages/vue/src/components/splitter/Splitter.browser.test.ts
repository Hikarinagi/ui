import { describe, expect, it, beforeEach, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Splitter from './Splitter.vue'
import SplitterPanel from './SplitterPanel.vue'
import SplitterHandle from './SplitterHandle.vue'
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
    const w = mount(
      defineComponent({
        render: () =>
          h(Splitter, { class: 'h-32 w-[400px]' }, () => [
            h(SplitterPanel, { defaultSize: 50, minSize: 20 }, () => h('p', '左栏')),
            h(SplitterHandle),
            h(SplitterPanel, { defaultSize: 50 }, () => h('p', '右栏')),
          ]),
      }),
      { attachTo: attach() },
    )
    await vi.waitFor(() => expect(w.element.querySelectorAll('[data-panel]').length).toBe(2))

    const handle = w.element.querySelector('[role="separator"]') as HTMLElement
    expect(handle.getAttribute('aria-label')).toBe('调整面板大小')

    expect(handle.getBoundingClientRect().width).toBe(8)
    const line = handle.firstElementChild as HTMLElement
    expect(getComputedStyle(line).borderInlineStartWidth).toBe('1px')
    expect(line.getBoundingClientRect().height).toBeGreaterThan(100)

    const first = w.element.querySelector('[data-panel]') as HTMLElement
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
