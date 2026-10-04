import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { createRef, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import { Anchor } from './Anchor'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import '../../../test/browser.css'

let roots: Root[] = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  for (const root of roots) root.unmount()
  roots = []
})

function mount(ui: ReactNode) {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  roots.push(root)
  flushSync(() => root.render(ui))
  return { container }
}

function scene(prefix: string, height: number) {
  const area = createRef<ScrollAreaHandle>()
  const w = mount(
    <div style={{ display: 'flex', gap: '16px' }}>
      <ScrollArea ref={area} style={{ height: '200px', width: '300px' }}>
        <section id={`${prefix}-a`} style={{ height: `${height}px` }}>
          甲
        </section>
        <section id={`${prefix}-b`} style={{ height: `${height}px` }}>
          乙
        </section>
      </ScrollArea>
      <Anchor
        items={[
          { id: `${prefix}-a`, label: '甲' },
          { id: `${prefix}-b`, label: '乙' },
        ]}
      />
    </div>,
  )
  return { w, area, links: () => [...w.container.querySelectorAll('a')] as HTMLElement[] }
}

describe('anchor 在固定壳滚动上下文里的 scrollspy 与跳转', () => {
  it('滚动内层视口时活动条目随动;点击条目滚动到位', async () => {
    const { w, area, links } = scene('sec', 400)
    await vi.waitFor(() => {
      expect(area.current?.viewport).toBeTruthy()
    })
    const viewport = area.current!.viewport!

    await vi.waitFor(() => expect(links()[0]!.getAttribute('aria-current')).toBe('location'))

    viewport.scrollTop = 450
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(links()[1]!.getAttribute('aria-current')).toBe('location'))

    viewport.scrollTop = 0
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => expect(links()[0]!.getAttribute('aria-current')).toBe('location'))

    viewport.scrollTop = 350
    viewport.dispatchEvent(new Event('scroll'))
    await vi.waitFor(() => {
      const anchors = links()
      const indicator = w.container.querySelector('.bg-accent') as HTMLElement
      expect(anchors[0]!.className).toContain('font-medium')
      expect(anchors[1]!.className).toContain('font-medium')
      const spanTop = anchors[0]!.offsetTop
      const spanBottom = anchors[1]!.offsetTop + anchors[1]!.offsetHeight
      expect(Math.abs(indicator.offsetTop - spanTop)).toBeLessThan(2)
      expect(Math.abs(indicator.offsetTop + indicator.offsetHeight - spanBottom)).toBeLessThan(2)
    })

    links()[1]!.click()
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(300))
  })

  it('高亮段是 motion 驱动的连续位移:切换后中途位置介于两端,终点贴合活动条目', async () => {
    const { w, area, links } = scene('hl', 600)
    const anchors = links()
    const rect = (el: Element) => el.getBoundingClientRect()
    const indicator = () => w.container.querySelector('.bg-accent') as HTMLElement
    await vi.waitFor(() => {
      expect(area.current?.viewport).toBeTruthy()
    })
    const viewport = area.current!.viewport!
    await vi.waitFor(() => {
      expect(Math.abs(rect(indicator()).top - rect(anchors[0]!).top)).toBeLessThan(0.01)
    })
    const startTop = rect(indicator()).top
    const endTop = rect(anchors[1]!).top

    anchors[1]!.click()
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    await vi.waitFor(() => {
      const midTop = rect(indicator()).top
      expect(midTop).toBeGreaterThan(startTop + 1)
      expect(midTop).toBeLessThan(endTop - 1)
    })

    await vi.waitFor(
      () => {
        expect(Math.abs(rect(indicator()).top - endTop)).toBeLessThan(0.01)
        expect(Math.abs(rect(indicator()).height - rect(anchors[1]!).height)).toBeLessThan(0.01)
      },
      { timeout: 1500 },
    )
  })

  it('高亮条在观测器首次报告后淡入，不是硬切出现', async () => {
    const { w } = scene('fd', 600)
    expect(w.container.querySelector('.bg-accent')).toBeNull()
    await vi.waitFor(() => expect(w.container.querySelector('.bg-accent')).not.toBeNull())
    const bar = w.container.querySelector('.bg-accent') as HTMLElement
    expect(parseFloat(getComputedStyle(bar).opacity)).toBeLessThan(1)
    await vi.waitFor(() => expect(getComputedStyle(bar).opacity).toBe('1'))
  })
})
