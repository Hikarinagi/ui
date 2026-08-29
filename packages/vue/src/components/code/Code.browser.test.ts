import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Code from './Code.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Code', () => {
  it('渲染 code 标签:inset 底 · mono 字族 · 相对字号缩到 0.875em', () => {
    const host = document.createElement('div')
    host.style.fontSize = '16px'
    document.body.appendChild(host)
    const w = mount(Code, { slots: { default: () => 'pnpm dev' }, attachTo: host })
    const el = w.element as HTMLElement
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('CODE')
    expect(style.fontSize).toBe('14px')
    expect(style.fontFamily.toLowerCase()).toContain('mono')
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-bg-inset)'
    document.body.appendChild(probe)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).color)
  })
})
