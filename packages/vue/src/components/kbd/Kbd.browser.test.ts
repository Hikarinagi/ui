import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Kbd from './Kbd.vue'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Kbd', () => {
  it('键帽形态:surface 底 · 底缘 2px 键帽边 · mono', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const w = mount(Kbd, { slots: { default: () => 'Ctrl' }, attachTo: host })
    const el = w.element as HTMLElement
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('KBD')
    expect(style.fontFamily.toLowerCase()).toContain('mono')
    expect(Number.parseFloat(style.borderBlockEndWidth)).toBeGreaterThan(
      Number.parseFloat(style.borderBlockStartWidth),
    )

    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-surface)'
    document.body.appendChild(probe)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).color)
  })
})
