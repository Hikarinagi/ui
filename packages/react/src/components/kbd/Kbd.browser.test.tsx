import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Kbd } from './Kbd'
import { Code } from '../code/Code'
import { Tooltip } from '../tooltip/Tooltip'
import { TooltipProvider } from '../tooltip/TooltipProvider'
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

function rgba(color: string, over?: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })!
  for (const layer of over ? [over, color] : [color]) {
    context.fillStyle = layer
    context.fillRect(0, 0, 1, 1)
  }
  return [...context.getImageData(0, 0, 1, 1).data]
}

function luminance([r, g, b]: number[]) {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!)
}

function contrast(element: Element, container: Element) {
  const style = getComputedStyle(element)
  const text = luminance(rgba(style.color))
  const fill = luminance(rgba(style.backgroundColor, getComputedStyle(container).backgroundColor))
  return (Math.max(text, fill) + 0.05) / (Math.min(text, fill) + 0.05)
}

describe.each(['light', 'dark'])('实色底上的键帽与行内代码 · %s', theme => {
  beforeEach(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    return () => document.documentElement.classList.remove('dark')
  })

  it.each([
    ['neutral 气泡', 'bg-neutral-solid text-neutral-solid-on'],
    ['accent', 'bg-accent text-accent-on'],
    ['danger', 'bg-danger text-danger-on'],
    ['warning', 'bg-warning text-warning-on'],
  ])('%s 里文字清晰可读,键帽仍有底缘', async (_, classes) => {
    const w = await mount(
      <div data-solid="" className={classes} style={{ padding: 8 }}>
        保存草稿 <Kbd>Ctrl S</Kbd> <Code>pnpm dev</Code>
      </div>,
    )
    const solid = w.container.querySelector('[data-solid]')!
    const kbd = solid.querySelector('kbd')!
    const code = solid.querySelector('code')!
    const surrounding = contrast(solid, solid)
    expect(surrounding).toBeGreaterThan(4.5)
    for (const chip of [kbd, code]) {
      expect(getComputedStyle(chip).color).toBe(getComputedStyle(solid).color)
      expect(rgba(getComputedStyle(chip).backgroundColor)[3]).toBe(0)
      expect(contrast(chip, solid)).toBeCloseTo(surrounding, 5)
    }
    expect(getComputedStyle(kbd).borderBlockEndWidth).toBe('2px')
    expect(rgba(getComputedStyle(kbd).borderTopColor)[3]).toBeGreaterThan(64)
    expect(getComputedStyle(code).boxShadow).toContain('inset')
  })

  it('页面上的键帽与行内代码保持原样', async () => {
    const w = await mount(
      <div className="bg-surface text-fg">
        <Kbd>Ctrl</Kbd> <Code>pnpm dev</Code>
      </div>,
    )
    const probe = document.createElement('span')
    document.body.appendChild(probe)
    const token = (name: string) => {
      probe.style.color = `var(${name})`
      return getComputedStyle(probe).color
    }
    expect(getComputedStyle(w.container.querySelector('kbd')!).backgroundColor).toBe(
      token('--hn-surface'),
    )
    expect(getComputedStyle(w.container.querySelector('kbd')!).borderTopColor).toBe(
      token('--hn-border'),
    )
    expect(getComputedStyle(w.container.querySelector('code')!).backgroundColor).toBe(
      token('--hn-bg-inset'),
    )
    probe.remove()
  })
})

describe.each(['light', 'dark'])('Tooltip 里的键帽 · %s', theme => {
  beforeEach(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    return () => document.documentElement.classList.remove('dark')
  })

  it('气泡里的键帽文字与气泡文字同样清晰', async () => {
    await mount(
      <TooltipProvider>
        <Tooltip
          open
          content={
            <>
              保存草稿 <Kbd>Ctrl S</Kbd>
            </>
          }
        >
          <button type="button">保存</button>
        </Tooltip>
      </TooltipProvider>,
    )
    const kbd = await vi.waitFor(() => {
      const element = document.querySelector('.bg-neutral-solid kbd')
      expect(element).not.toBeNull()
      return element!
    })
    const bubble = kbd.closest('.bg-neutral-solid')!
    expect(contrast(bubble, bubble)).toBeGreaterThan(15)
    expect(contrast(kbd, bubble)).toBeCloseTo(contrast(bubble, bubble), 5)
  })
})
