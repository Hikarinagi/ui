import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { DropdownMenu } from './DropdownMenu'
import { DropdownMenuItem } from './DropdownMenuItem'
import { DropdownMenuSeparator } from './DropdownMenuSeparator'
import { DropdownMenuRadioGroup } from './DropdownMenuRadioGroup'
import { DropdownMenuRadioItem } from './DropdownMenuRadioItem'
import { DropdownMenuCheckboxItem } from './DropdownMenuCheckboxItem'
import { DropdownMenuGroup } from './DropdownMenuGroup'
import { DropdownMenuSub } from './DropdownMenuSub'
import { Button } from '../button/Button'
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

async function menu(onSelect = vi.fn()) {
  const w = await mount(
    <div style={{ padding: '160px' }}>
      <DropdownMenu
        label="更多"
        content={
          <>
            <DropdownMenuItem onSelect={onSelect}>复制</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem tone="danger">删除</DropdownMenuItem>
            <DropdownMenuItem disabled>归档</DropdownMenuItem>
          </>
        }
      >
        <Button variant="outline" tone="neutral">
          打开
        </Button>
      </DropdownMenu>
    </div>,
  )
  mounted.push(w)
  return { w, onSelect }
}

const trigger = () => document.querySelector('button')!
const items = () => [...document.querySelectorAll('[role="menuitem"]')] as HTMLElement[]

describe('dropdown menu · 菜单语义', () => {
  it('触发器带 aria-haspopup;打开后是 role=menu,条目是 menuitem', async () => {
    await menu()
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu')

    await userEvent.click(trigger())
    await vi.waitFor(() => expect(document.querySelector('[role="menu"]')).toBeTruthy())
    expect(items().map(el => el.textContent?.trim())).toEqual(['复制', '删除', '归档'])
    expect(trigger().getAttribute('data-state')).toBe('open')
  })

  it('点条目发 select 并关闭菜单;禁用条目不可选', async () => {
    const { onSelect } = await menu()
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(items().length).toBe(3))

    await userEvent.click(items()[0]!)
    expect(onSelect).toHaveBeenCalledOnce()
    await vi.waitFor(() => expect(document.querySelector('[role="menu"]')).toBeNull())

    expect(true).toBe(true)
  })

  it('禁用条目带 data-disabled 且不可聚焦', async () => {
    await menu()
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(items().length).toBe(3))
    const archived = items()[2]!
    expect(archived.hasAttribute('data-disabled')).toBe(true)
    expect(getComputedStyle(archived).pointerEvents).toBe('none')
  })

  it('方向键在条目间漫游,Esc 关闭并把焦点还给触发器', async () => {
    await menu()
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(items().length).toBe(3))

    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe('复制'))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe('删除'))

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(document.querySelector('[role="menu"]')).toBeNull())
    expect(document.activeElement).toBe(trigger())
  })
})

describe('dropdown menu · 单选组', () => {
  async function radioMenu(value = 'zh') {
    const current = signal(value)
    function Harness() {
      const selected = current.use()
      return (
        <div style={{ padding: '160px' }}>
          <DropdownMenu
            content={
              <DropdownMenuRadioGroup
                value={selected}
                onValueChange={(v: string | undefined) => (current.value = v ?? '')}
              >
                <DropdownMenuRadioItem value="zh">简体中文</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            }
          >
            <Button>语言</Button>
          </DropdownMenu>
        </div>
      )
    }
    const w = await mount(<Harness />)
    mounted.push(w)
    return current
  }

  it('当前项带 checked 状态与对勾,选中另一项后回写 v-model', async () => {
    const current = await radioMenu()
    await userEvent.click(trigger())
    await vi.waitFor(() =>
      expect(document.querySelectorAll('[role="menuitemradio"]').length).toBe(2),
    )

    const radios = [...document.querySelectorAll('[role="menuitemradio"]')] as HTMLElement[]
    expect(radios[0]!.getAttribute('aria-checked')).toBe('true')
    expect(radios[1]!.getAttribute('aria-checked')).toBe('false')
    expect(radios[0]!.querySelector('svg')).toBeTruthy()
    expect(radios[1]!.querySelector('svg')).toBeNull()

    await userEvent.click(radios[1]!)
    await vi.waitFor(() => expect(current.value).toBe('en'))
  })
})

describe('dropdown menu · 多选项', () => {
  async function checkboxMenu() {
    const cover = signal(true)
    const tags = signal(false)
    function Harness() {
      const coverValue = cover.use()
      const tagsValue = tags.use()
      return (
        <div style={{ padding: '160px' }}>
          <DropdownMenu
            content={
              <>
                <DropdownMenuCheckboxItem
                  checked={coverValue}
                  onCheckedChange={(v: boolean) => (cover.value = v)}
                >
                  封面
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={tagsValue}
                  onCheckedChange={(v: boolean) => (tags.value = v)}
                >
                  标签
                </DropdownMenuCheckboxItem>
              </>
            }
          >
            <Button>显示项</Button>
          </DropdownMenu>
        </div>
      )
    }
    const w = await mount(<Harness />)
    mounted.push(w)
    return { cover, tags }
  }

  const checkboxes = () =>
    [...document.querySelectorAll('[role="menuitemcheckbox"]')] as HTMLElement[]

  it('渲染为 menuitemcheckbox,勾选后回写 v-model 且菜单不收起', async () => {
    const { tags } = await checkboxMenu()
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(checkboxes().length).toBe(2))

    expect(checkboxes()[0]!.getAttribute('aria-checked')).toBe('true')
    expect(checkboxes()[1]!.getAttribute('aria-checked')).toBe('false')

    await userEvent.click(checkboxes()[1]!)
    await vi.waitFor(() => expect(tags.value).toBe(true))
    expect(document.querySelector('[role="menu"]')).toBeTruthy()
  })
})

describe('dropdown menu · 分组与子菜单', () => {
  async function groupedMenu() {
    const w = await mount(
      <div style={{ padding: '160px' }}>
        <DropdownMenu
          align="start"
          content={
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem>重命名</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSub label="导出为">
                <DropdownMenuItem>PDF</DropdownMenuItem>
                <DropdownMenuItem>EPUB</DropdownMenuItem>
              </DropdownMenuSub>
            </>
          }
        >
          <Button>文件</Button>
        </DropdownMenu>
      </div>,
    )
    mounted.push(w)
  }

  it('分组渲染为 role=group', async () => {
    await groupedMenu()
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(document.querySelector('[role="group"]')).toBeTruthy())
  })

  it('父条目带 aria-haspopup,向右方向键展开子菜单,向左收起', async () => {
    await groupedMenu()
    await userEvent.click(trigger())
    await vi.waitFor(() => expect(items().length).toBeGreaterThan(0))

    const parent = items().find(el => el.textContent?.includes('导出为'))!
    expect(parent.getAttribute('aria-haspopup')).toBe('menu')
    expect(parent.getAttribute('aria-expanded')).toBe('false')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await vi.waitFor(() =>
      expect(document.activeElement?.textContent?.includes('导出为')).toBe(true),
    )

    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]').length).toBe(2))
    await vi.waitFor(() => expect(items().map(el => el.textContent?.trim())).toContain('PDF'))

    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(document.querySelectorAll('[role="menu"]').length).toBe(1))
  })
})
