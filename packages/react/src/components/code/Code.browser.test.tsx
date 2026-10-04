import { describe, expect, it } from 'vitest'
import { Code } from './Code'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

describe('Code', () => {
  it('渲染 code 标签:inset 底 · mono 字族 · 相对字号缩到 0.875em', async () => {
    const host = await mount(
      <div style={{ fontSize: '16px' }}>
        <Code>pnpm dev</Code>
      </div>,
    )
    const el = host.element.firstElementChild as HTMLElement
    const style = getComputedStyle(el)

    expect(el.tagName).toBe('CODE')
    expect(style.fontSize).toBe('14px')
    expect(style.fontFamily.toLowerCase()).toContain('mono')
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    const probe = document.createElement('span')
    probe.style.color = 'var(--hn-bg-inset)'
    document.body.appendChild(probe)
    expect(style.backgroundColor).toBe(getComputedStyle(probe).color)
    probe.remove()
  })
})
