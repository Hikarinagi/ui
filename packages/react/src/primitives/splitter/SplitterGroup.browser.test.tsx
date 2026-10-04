import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { SplitterGroup } from './SplitterGroup'
import { SplitterPanel } from './SplitterPanel'
import { SplitterResizeHandle } from './SplitterResizeHandle'
import '../../../test/browser.css'

afterEach(() => {
  localStorage.clear()
})

function Group({
  autoSaveId,
  onLayout,
  onResize,
}: {
  autoSaveId?: string
  onLayout?: (layout: number[]) => void
  onResize?: (size: number) => void
}) {
  return (
    <div style={{ width: '400px', height: '100px' }}>
      <SplitterGroup direction="horizontal" autoSaveId={autoSaveId} onLayout={onLayout}>
        <SplitterPanel id="left" defaultSize={50} minSize={20} onResize={onResize}>
          Left
        </SplitterPanel>
        <SplitterResizeHandle id="handle" style={{ width: '0px' }} aria-label="Resize" />
        <SplitterPanel id="right" defaultSize={50}>
          Right
        </SplitterPanel>
      </SplitterGroup>
    </div>
  )
}

const panel = (id: string) => document.getElementById(id) as HTMLElement
const handle = () => document.getElementById('handle') as HTMLElement

describe('splitter primitive', () => {
  it('lays out panels after mount and writes separator values', async () => {
    const onLayout = vi.fn()
    const onResize = vi.fn()
    await render(<Group onLayout={onLayout} onResize={onResize} />)
    await vi.waitFor(() => expect(handle().getAttribute('aria-valuenow')).toBe('50'))
    expect(handle().getAttribute('aria-valuemin')).toBe('20')
    expect(handle().getAttribute('aria-valuemax')).toBe('100')
    expect(handle().getAttribute('aria-controls')).toBe('left')
    expect(panel('left').getAttribute('data-panel-size')).toBe('50.0')
    expect(onLayout).toHaveBeenCalledWith([50, 50])
    expect(onResize).toHaveBeenCalledWith(50, undefined)
  })

  it('resizes with arrows, Home and End and respects minimum sizes', async () => {
    await render(<Group />)
    await vi.waitFor(() => expect(handle().getAttribute('aria-valuenow')).toBe('50'))
    handle().focus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(panel('left').getAttribute('data-panel-size')).toBe('60.0'))
    expect(handle().getAttribute('aria-valuenow')).toBe('60')
    await userEvent.keyboard('{Home}')
    await vi.waitFor(() => expect(panel('left').getAttribute('data-panel-size')).toBe('20.0'))
    await userEvent.keyboard('{End}')
    await vi.waitFor(() => expect(panel('left').getAttribute('data-panel-size')).toBe('100.0'))
    expect(panel('right').getAttribute('data-panel-size')).toBe('0.0')
  })

  it('drags with the pointer and reports the drag state', async () => {
    await render(<Group />)
    await vi.waitFor(() => expect(handle().getAttribute('aria-valuenow')).toBe('50'))
    const rect = handle().getBoundingClientRect()
    const x = rect.left
    const y = rect.top + rect.height / 2
    handle().dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y, buttons: 1 }),
    )
    await vi.waitFor(() => expect(handle().getAttribute('data-resize-handle-state')).toBe('drag'))
    expect(handle().getAttribute('data-resize-handle-active')).toBe('pointer')
    expect(panel('left').style.pointerEvents).toBe('none')
    document.body.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: x + 40, clientY: y, buttons: 1 }),
    )
    await vi.waitFor(() => expect(panel('left').getAttribute('data-panel-size')).toBe('60.0'))
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x + 40, clientY: y }))
    await vi.waitFor(() => expect(handle().getAttribute('data-resize-handle-state')).toBe('hover'))
    expect(panel('left').style.pointerEvents).toBe('')
  })

  it('persists layouts under the Reka storage key and restores them', async () => {
    const screen = await render(<Group autoSaveId="primitive-test" />)
    await vi.waitFor(() => expect(handle().getAttribute('aria-valuenow')).toBe('50'))
    handle().focus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(localStorage.getItem('reka:primitive-test')).toContain('[60,40]'))
    await screen.unmount()
    await render(<Group autoSaveId="primitive-test" />)
    await vi.waitFor(() => expect(panel('left').getAttribute('data-panel-size')).toBe('60.0'))
  })
})
