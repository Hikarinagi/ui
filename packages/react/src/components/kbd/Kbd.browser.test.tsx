import { describe, expect, it } from 'vitest'
import { Kbd } from './Kbd'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('Kbd', () => {
  it('键帽形态:surface 底 · 底缘 2px 键帽边 · mono', async () => {
    const w = await mount(<Kbd>Ctrl</Kbd>)
    const el = w.element
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
    probe.remove()
  })
})
