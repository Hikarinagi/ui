import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { ContextMenu, type ContextMenuProps } from './ContextMenu'
import { ContextMenuItem } from './ContextMenuItem'
import { ContextMenuSeparator } from './ContextMenuSeparator'
import { ContextMenuCheckboxItem } from './ContextMenuCheckboxItem'
import { ContextMenuSub } from './ContextMenuSub'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: Array<{ unmount: () => Promise<void> }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

async function harness(props: Partial<ContextMenuProps> = {}, onSelect = vi.fn()) {
  const checked = signal(false)
  function Harness() {
    const value = checked.use()
    return (
      <div style={{ padding: '160px' }}>
        <ContextMenu
          label="文件操作"
          {...props}
          content={
            <>
              <ContextMenuItem onSelect={onSelect}>复制</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem
                checked={value}
                onCheckedChange={(next: boolean) => (checked.value = next)}
              >
                置顶
              </ContextMenuCheckboxItem>
              <ContextMenuSub label="移动到">
                <ContextMenuItem>收藏夹</ContextMenuItem>
                <ContextMenuItem>归档</ContextMenuItem>
              </ContextMenuSub>
              <ContextMenuItem tone="danger">删除</ContextMenuItem>
            </>
          }
        >
          <div data-area="" style={{ width: '240px', height: '120px' }}>
            右键区域
          </div>
        </ContextMenu>
      </div>
    )
  }
  const w = await mount(<Harness />)
  mounted.push(w)
  return { w, onSelect, checked }
}

const area = () => document.querySelector('[data-area]') as HTMLElement
const menu = () => document.querySelector('[role="menu"]') as HTMLElement | null
const items = () => [...document.querySelectorAll('[role="menuitem"]')] as HTMLElement[]

describe('ContextMenu', () => {
  it('右键打开菜单，出现在指针处，条目是 menuitem，锁滚', async () => {
    await harness()
    expect(menu()).toBeNull()
    await userEvent.click(area(), { button: 'right', position: { x: 40, y: 30 } })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    const box = menu()!.getBoundingClientRect()
    const anchor = area().getBoundingClientRect()
    expect(box.left).toBeGreaterThanOrEqual(anchor.left + 30)
    expect(box.top).toBeGreaterThanOrEqual(anchor.top + 20)
    expect(menu()!.getAttribute('aria-label')).toBe('文件操作')
    expect(menu()!.className).toContain('hn-anim-pop')
    expect(items().map(el => el.textContent?.trim())).toEqual(['复制', '移动到', '删除'])
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('点条目发 select 并关闭；Esc 关闭', async () => {
    const { onSelect } = await harness()
    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.click(items()[0]!)
    expect(onSelect).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(menu()).toBeNull())

    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(menu()).toBeNull())
  })

  it('多选项切换后菜单保持打开', async () => {
    const { checked } = await harness()
    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    const box = document.querySelector('[role="menuitemcheckbox"]') as HTMLElement
    await userEvent.click(box)
    await vi.waitFor(() => expect(checked.value).toBe(true))
    expect(menu()).toBeTruthy()
    expect(box.getAttribute('aria-checked')).toBe('true')
  })

  it('子菜单经悬停展开', async () => {
    await harness()
    await userEvent.click(area(), { button: 'right' })
    await vi.waitFor(() => expect(menu()).toBeTruthy())
    await userEvent.hover(items()[1]!)
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]').length).toBe(2))
    const names = [...document.querySelectorAll('[role="menuitem"]')].map(el =>
      el.textContent?.trim(),
    )
    expect(names).toContain('收藏夹')
  })

  it('disabled 时右键不打开', async () => {
    await harness({ disabled: true })
    await userEvent.click(area(), { button: 'right' })
    await new Promise(resolve => setTimeout(resolve, 200))
    expect(menu()).toBeNull()
  })
})
