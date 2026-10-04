import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Dialog } from './dialog/Dialog'
import { Popover } from './popover/Popover'
import { Button } from './button/Button'
import { mount } from '../../test/mount'
import '../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void>; container: HTMLElement }> = []

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function harness() {
  const w = await mount(
    <div style={{ padding: '120px' }}>
      <Dialog
        title="外层对话框"
        renderContent={() => (
          <>
            <Popover content={<p>嵌套面板内容</p>}>
              <Button variant="soft" tone="neutral">
                开P
              </Button>
            </Popover>
            <Dialog title="内层对话框" renderContent={() => <p>内层正文</p>}>
              <Button variant="soft" tone="neutral">
                开B
              </Button>
            </Dialog>
          </>
        )}
      >
        <Button variant="outline" tone="neutral">
          开A
        </Button>
      </Dialog>
    </div>,
  )
  mounted.push(w)
  return { trigger: () => w.container.querySelector('button')! }
}

const dialogs = () => [...document.querySelectorAll('[role="dialog"]')] as HTMLElement[]
const popover = () => document.querySelector('.hn-anim-pop[data-side]') as HTMLElement | null

function topAt(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 40))
  return hit && el.contains(hit)
}

describe('浮层嵌套 · z 不取号,栈序自动', () => {
  it('对话框里开驻留面板:同 z 100,后开者靠 DOM 序压上;Esc 逐层收', async () => {
    await page.viewport(1024, 720)
    const w = await harness()
    await userEvent.click(w.trigger())
    await vi.waitFor(() => expect(dialogs().length).toBe(1))
    const panelA = dialogs()[0]!

    await userEvent.click(
      [...panelA.querySelectorAll('button')].find(b => b.textContent === '开P')!,
    )
    await vi.waitFor(() => expect(popover()).toBeTruthy())
    const panelP = popover()!

    expect(getComputedStyle(panelA.parentElement!).zIndex).toBe('100')
    expect(getComputedStyle(panelP).zIndex).toBe('100')
    await vi.waitFor(() => expect(topAt(panelP)).toBe(true))

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(popover()).toBeNull())
    expect(dialogs().length).toBe(1)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialogs().length).toBe(0))
  })

  it('对话框套对话框:内层后挂载恒在上,先开的不压新开的', async () => {
    await page.viewport(1024, 720)
    const w = await harness()
    await userEvent.click(w.trigger())
    await vi.waitFor(() => expect(dialogs().length).toBe(1))

    await userEvent.click(
      [...dialogs()[0]!.querySelectorAll('button')].find(b => b.textContent === '开B')!,
    )
    await vi.waitFor(() => expect(dialogs().length).toBe(2))

    const [panelA, panelB] = dialogs() as [HTMLElement, HTMLElement]
    expect(panelB.textContent).toContain('内层对话框')
    expect(panelA.compareDocumentPosition(panelB) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await vi.waitFor(() => expect(topAt(panelB)).toBe(true))

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(dialogs().length).toBe(1))
    expect(dialogs()[0]!.textContent).toContain('外层对话框')
  })
})
