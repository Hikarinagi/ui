import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Mark from './Mark.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Mark', () => {
  it('warning 淡洗底 · 文字色继承不被 UA 黄底黑字接管', () => {
    const host = document.createElement('div')
    host.style.color = 'rgb(23, 23, 23)'
    document.body.appendChild(host)
    const w = mount(Mark, { slots: { default: () => '命中词' }, attachTo: host })
    const el = w.element as HTMLElement
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('MARK')
    expect(style.color).toBe('rgb(23, 23, 23)')
    expect(style.backgroundColor).not.toBe('rgb(255, 255, 0)')
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })
})
