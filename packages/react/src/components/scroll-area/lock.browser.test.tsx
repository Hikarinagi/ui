import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import { ScrollArea } from './ScrollArea'
import { Popover } from '../popover/Popover'
import { Button } from '../button/Button'
import { Dialog } from '../dialog/Dialog'
import { ContextMenu } from '../context-menu/ContextMenu'
import { ContextMenuItem } from '../context-menu/ContextMenuItem'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(async () => {
  await page.viewport(1000, 720)
  document.body.innerHTML = ''
})

let mounted: RenderResult[] = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function harness() {
  const host = document.createElement('div')
  host.style.cssText = 'height: 320px; width: 480px'
  document.body.appendChild(host)
  const w = await render(
    <ScrollArea className="h-full" data-outer="">
      <div style={{ height: '200px' }} />
      <Popover
        content={
          <ScrollArea className="h-24" data-inner="">
            <div style={{ height: '400px' }}>浮层内的长内容</div>
          </ScrollArea>
        }
      >
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </Popover>
      <div style={{ height: '1200px' }} />
    </ScrollArea>,
    { container: host },
  )
  mounted.push(w)
  return w
}

async function viewportOf(area: Element) {
  await vi.waitFor(
    () => expect(area.querySelector('[data-overlayscrollbars-viewport]')).toBeTruthy(),
    { timeout: 5000 },
  )
  return area.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
}

function wheel(el: HTMLElement) {
  const event = new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true })
  el.dispatchEvent(event)
  return event.defaultPrevented
}

describe('ScrollArea · 浮层锁滚', () => {
  it('浮层打开时页面里的滚动区域立即拦下滚轮，浮层里的滚动区域照常，关闭后恢复', async () => {
    const w = await harness()
    const outer = await viewportOf(document.querySelector('[data-outer]')!)
    expect(wheel(outer)).toBe(false)
    const trigger = w.container.querySelector('button') as HTMLElement
    const before = { width: outer.clientWidth, left: trigger.getBoundingClientRect().left }

    await userEvent.click(trigger)
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe('none'))
    await vi.waitFor(() => expect(wheel(outer)).toBe(true))
    expect(outer.clientWidth).toBe(before.width)
    expect(trigger.getBoundingClientRect().left).toBe(before.left)

    const inner = await viewportOf(document.querySelector('[data-inner]')!)
    expect(wheel(inner)).toBe(false)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe(''))
    await vi.waitFor(() => expect(wheel(outer)).toBe(false))
  })
})

function touchmove(el: HTMLElement) {
  const event = new Event('touchmove', { bubbles: true, cancelable: true })
  el.dispatchEvent(event)
  return event.defaultPrevented
}

const nestedCases = [
  { overlay: 'context-menu', modal: true },
  { overlay: 'popover', modal: true },
  { overlay: 'popover', modal: false },
].flatMap(overlay =>
  (['vertical', 'horizontal'] as const).map(direction => ({ ...overlay, direction })),
)

it.each(nestedCases)(
  'Dialog 内 $overlay / modal=$modal / $direction 随顶层切换锁滚并保留顶层滚动',
  async ({ overlay, modal, direction }) => {
    const panel = () => (
      <ScrollArea className="h-24 w-60" data-lock-panel="">
        <div style={{ height: '800px' }}>
          {overlay === 'context-menu' ? <ContextMenuItem>菜单操作</ContextMenuItem> : '浮层内容'}
        </div>
      </ScrollArea>
    )
    const nested = () =>
      overlay === 'context-menu' ? (
        <ContextMenu content={panel()}>
          <div data-lock-trigger="" style={{ width: '200px', height: '80px' }}>
            右键打开
          </div>
        </ContextMenu>
      ) : (
        <Popover modal={modal} content={panel()}>
          <Button data-lock-trigger="">打开浮层</Button>
        </Popover>
      )
    const w = await mount(
      <Dialog
        title="滚动列表"
        size="lg"
        renderBody={() => (
          <ScrollArea direction={direction} className="h-64" data-lock-outer="">
            <div style={direction === 'horizontal' ? { width: '1800px' } : { height: '1800px' }}>
              {nested()}
            </div>
          </ScrollArea>
        )}
      >
        <Button>打开对话框</Button>
      </Dialog>,
    )
    mounted.push(w)
    await userEvent.click(w.container.querySelector('button') as HTMLElement)
    await vi.waitFor(() => expect(document.querySelector('[data-lock-outer]')).toBeTruthy())
    const outer = await viewportOf(document.querySelector('[data-lock-outer]')!)
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe('none'))
    expect(touchmove(outer)).toBe(false)
    expect(wheel(outer)).toBe(direction === 'horizontal')
    if (direction === 'horizontal') {
      expect(outer.scrollLeft).toBe(120)
      outer.scrollLeft = 0
    }

    for (let cycle = 0; cycle < 2; cycle++) {
      await userEvent.click(document.querySelector<HTMLElement>('[data-lock-trigger]')!, {
        button: overlay === 'context-menu' ? 'right' : 'left',
        position: { x: 20, y: 20 },
      })
      await vi.waitFor(() => expect(document.querySelector('[data-lock-panel]')).toBeTruthy())
      const inner = await viewportOf(document.querySelector('[data-lock-panel]')!)
      expect(document.body.style.pointerEvents).toBe('none')
      await vi.waitFor(() =>
        expect(getComputedStyle(outer).pointerEvents).toBe(modal ? 'none' : 'auto'),
      )
      const left = outer.scrollLeft
      expect(wheel(outer)).toBe(modal || direction === 'horizontal')
      expect(outer.scrollLeft).toBe(left + (!modal && direction === 'horizontal' ? 120 : 0))
      expect(touchmove(outer)).toBe(modal)
      expect(wheel(inner)).toBe(false)
      expect(touchmove(inner)).toBe(false)

      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(document.querySelector('[data-lock-panel]')).toBeNull())
      expect(document.querySelector('[data-lock-outer]')).toBeTruthy()
      expect(document.body.style.pointerEvents).toBe('none')
      await vi.waitFor(() => expect(getComputedStyle(outer).pointerEvents).toBe('auto'))
      expect(touchmove(outer)).toBe(false)
      const restoredLeft = outer.scrollLeft
      expect(wheel(outer)).toBe(direction === 'horizontal')
      if (direction === 'horizontal') {
        expect(outer.scrollLeft).toBe(restoredLeft + 120)
        outer.scrollLeft = 0
      }
    }

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.body.style.pointerEvents).toBe(''))
  },
)
