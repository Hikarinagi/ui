import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { Drawer, type DrawerProps } from './Drawer'
import { Button } from '../button/Button'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: Array<{ unmount: () => Promise<void> }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function harness(drawerProps: Partial<DrawerProps> = {}) {
  const w = await mount(
    <div style={{ padding: '120px' }}>
      <Drawer
        title="筛选条件"
        description="按标签与年份过滤。"
        {...drawerProps}
        renderContent={() => <p>抽屉正文</p>}
        renderFooter={() => <Button>应用</Button>}
      >
        <Button variant="outline" tone="neutral">
          打开抽屉
        </Button>
      </Drawer>
    </div>,
  )
  mounted.push(w)
  return { trigger: () => w.container.querySelector('button')! }
}

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement | null

describe('drawer · 边缘工具面', () => {
  it('默认 end:贴右缘全高、直角、drawer 动画;scrim + 锁滚 + aria 关联', async () => {
    await page.viewport(1024, 720)
    const w = await harness()
    expect(panel()).toBeNull()

    await userEvent.click(w.trigger())
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    const content = panel()!
    await vi.waitFor(() =>
      expect(Math.round(content.getBoundingClientRect().right)).toBe(window.innerWidth),
    )
    const rect = content.getBoundingClientRect()
    expect(Math.round(rect.top)).toBe(0)
    expect(Math.round(rect.height)).toBe(window.innerHeight)
    expect(Math.round(rect.width)).toBe(360)

    const style = getComputedStyle(content)
    expect(style.borderRadius).toBe('0px')
    expect(style.boxShadow).not.toBe('none')
    expect(style.animationName).toBe('hn-drawer-in-end')
    expect(style.animationDuration).toBe('0.45s')

    const labelId = content.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelId)!.textContent).toBe('筛选条件')
    expect(document.querySelector('.hn-scrim')).toBeTruthy()
    expect(document.body.style.overflow).toBe('hidden')
    expect(content.contains(document.activeElement)).toBe(true)

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.body.style.overflow).toBe('')
  })

  it('side=start 贴左缘,动画从左滑入;size=sm 288 宽', async () => {
    await page.viewport(1024, 720)
    const w = await harness({ side: 'start', size: 'sm' })
    await userEvent.click(w.trigger())
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    await vi.waitFor(() => expect(Math.round(panel()!.getBoundingClientRect().left)).toBe(0))
    expect(Math.round(panel()!.getBoundingClientRect().width)).toBe(288)
    expect(getComputedStyle(panel()!).animationName).toBe('hn-drawer-in-start')
  })

  it('locked:Esc 失效、X 禁用;插槽 close 仍可关', async () => {
    await page.viewport(1024, 720)
    const w = await harness({ locked: true })
    await userEvent.click(w.trigger())
    await vi.waitFor(() => expect(panel()).toBeTruthy())

    await userEvent.keyboard('{Escape}')
    await new Promise(r => setTimeout(r, 350))
    expect(panel()).toBeTruthy()
    const close = panel()!.querySelector('[aria-label="关闭"]') as HTMLButtonElement
    expect(close.disabled).toBe(true)
  })
})
