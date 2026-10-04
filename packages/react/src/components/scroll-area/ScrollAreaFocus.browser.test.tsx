import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { ScrollArea, type ScrollAreaProps } from './ScrollArea'
import '../../../test/browser.css'

function mount(ui: ReactNode) {
  const container = document.body.appendChild(document.createElement('div'))
  const root = createRoot(container)
  flushSync(() => root.render(ui))
  return {
    container,
    rerender: async (next: ReactNode) => flushSync(() => root.render(next)),
    unmount: async () => root.unmount(),
  }
}

let wrapper: ReturnType<typeof mount> | undefined
afterEach(async () => {
  await wrapper?.unmount()
  document.body.innerHTML = ''
})

function area(props: Partial<ScrollAreaProps>) {
  return (
    <ScrollArea focusable label="代码" style={{ height: '120px', width: '240px' }} {...props}>
      <div style={{ width: '800px', height: '800px' }}>内容</div>
    </ScrollArea>
  )
}

function mountArea(direction: 'vertical' | 'horizontal' | 'both' = 'vertical') {
  let props: Partial<ScrollAreaProps> = { direction }
  const screen = mount(area(props))
  wrapper = screen
  return {
    ...screen,
    get: (selector: string) => {
      const found = screen.container.querySelector<HTMLElement>(selector)
      if (!found) throw new Error(`Unable to get ${selector}`)
      return found
    },
    setProps: (next: Partial<ScrollAreaProps>) => {
      props = { ...props, ...next }
      return screen.rerender(area(props))
    },
  }
}

function attribute(element: Element, name: string) {
  return element.getAttribute(name) ?? undefined
}

async function enhanced() {
  await vi.waitFor(() =>
    expect(
      attribute(
        wrapper!.container.querySelector('[role="region"]')!,
        'data-overlayscrollbars-viewport',
      ),
    ).toBeDefined(),
  )
  return wrapper!.container.querySelector('[role="region"]') as HTMLElement
}

it.each([
  ['vertical', '{ArrowDown}', 'scrollTop'],
  ['horizontal', '{ArrowRight}', 'scrollLeft'],
  ['both', '{ArrowDown}', 'scrollTop'],
] as const)('%s 聚焦实际视口后方向键可滚动', async (direction, key, offset) => {
  mountArea(direction)
  const viewport = await enhanced()
  viewport.focus()
  await userEvent.keyboard(key)
  await vi.waitFor(() => expect(viewport[offset]).toBeGreaterThan(0))
  expect(viewport.getAttribute('aria-label')).toBe('代码')
})

it('初始化前已经聚焦宿主时，焦点与地标一起迁移至视口', async () => {
  const w = mountArea()
  const initial = w.get('[role="region"]')
  expect(initial.hasAttribute('data-overlayscrollbars-initialize')).toBe(true)
  initial.focus()
  const viewport = await enhanced()
  await vi.waitFor(() => expect(document.activeElement).toBe(viewport))
  expect(w.container.querySelectorAll('[role="region"]')).toHaveLength(1)
  expect(initial.hasAttribute('tabindex')).toBe(false)
})

it('Tab 只有一个滚动区停靠点，之后可以正常离开', async () => {
  const before = document.createElement('button')
  before.textContent = '前'
  document.body.appendChild(before)
  mountArea()
  const after = document.createElement('button')
  after.textContent = '后'
  document.body.appendChild(after)
  const viewport = await enhanced()
  before.focus()
  await userEvent.tab()
  expect(document.activeElement).toBe(viewport)
  await userEvent.tab()
  expect(document.activeElement).toBe(after)
})

it('focusable 与名称更新同步到视口，不留下旧地标', async () => {
  const w = mountArea()
  const viewport = await enhanced()
  await w.setProps({ label: '新名称' })
  expect(viewport.getAttribute('aria-label')).toBe('新名称')
  await w.setProps({ focusable: false })
  expect(w.container.querySelector('[role="region"]') !== null).toBe(false)
  expect(w.container.querySelector('[tabindex="0"]') !== null).toBe(false)
  await w.setProps({ focusable: true })
  expect(w.container.querySelectorAll('[role="region"]')).toHaveLength(1)
  expect(viewport.getAttribute('tabindex')).toBe('0')
})
