import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { CommandPalette, type CommandPaletteProps } from './CommandPalette'
import { CommandPaletteInput } from './CommandPaletteInput'
import { Button } from '../button/Button'
import type { CommandItemRenderProps, CommandItems } from './types'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

let mounted: Array<{ unmount: () => Promise<void> | void }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
})

const items: CommandItems = [
  {
    label: '页面',
    items: [
      { id: 'home', label: '首页', keywords: ['home'] },
      { id: 'settings', label: '设置', description: '账号与偏好', kbd: ['⌘', ','] },
    ],
  },
  { id: 'theme', label: '切换主题' },
]

async function harness(props: Partial<CommandPaletteProps> = {}) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const onSelect = vi.fn()
  const screen = await render(
    <CommandPalette items={items} onSelect={onSelect} {...props}>
      <Button variant="outline" tone="neutral">
        搜索
      </Button>
    </CommandPalette>,
    { container: host },
  )
  mounted.push(screen)
  return { onSelect, trigger: host.querySelector('button') as HTMLElement }
}

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const options = () => Array.from(document.querySelectorAll('[role="option"]')) as HTMLElement[]
const input = () => document.querySelector('[role="dialog"] input') as HTMLInputElement

describe('command palette', () => {
  it('打开后输入框获得焦点、首项高亮；输入后过滤并标出匹配片段；回车选中并关闭', async () => {
    const { onSelect, trigger } = await harness()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await vi.waitFor(() => expect(document.activeElement).toBe(input()))
    await vi.waitFor(() => expect(options()[0]!.dataset.highlighted).toBe(''))
    expect(options()).toHaveLength(3)
    expect(panel()!.querySelector('[role="group"]')!.getAttribute('aria-labelledby')).toBeTruthy()
    await expectNoA11yViolations(panel()!)

    await userEvent.keyboard('设')
    await vi.waitFor(() => expect(options()).toHaveLength(1))
    expect(options()[0]!.textContent).toContain('设置')
    expect(options()[0]!.querySelector('.font-medium')!.textContent).toBe('设')
    await vi.waitFor(() => expect(options()[0]!.dataset.highlighted).toBe(''))
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0]![0]).toMatchObject({ id: 'settings' })
    await vi.waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(trigger)
  })

  it('方向键移动高亮；无匹配时显示空态；Esc 关闭并清空搜索；鼠标点击选中', async () => {
    const { onSelect, trigger } = await harness()
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(options()[0]!.dataset.highlighted).toBe(''))
    await userEvent.keyboard('{ArrowDown}')
    expect(options()[1]!.dataset.highlighted).toBe('')
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[1]!.id)

    await userEvent.keyboard('不存在')
    await vi.waitFor(() => expect(options()).toHaveLength(0))
    expect(panel()!.textContent).toContain('无匹配项')

    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(panel()).toBeNull())
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    expect(input().value).toBe('')

    await userEvent.click(options()[2]!)
    expect(onSelect.mock.calls[0]![0]).toMatchObject({ id: 'theme' })
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('hotkey 在页面任何位置开合面板', async () => {
    await harness({ hotkey: 'mod+k' })
    await userEvent.keyboard('{Control>}k{/Control}')
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    await userEvent.keyboard('{Control>}k{/Control}')
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  interface Book {
    author: string
    volumes: number
  }
  const books: CommandItems<Book> = [
    {
      id: 'spice',
      label: '狼与香辛料',
      keywords: ['wolf'],
      data: { author: '支仓冻砂', volumes: 17 },
    },
    {
      id: 'kino',
      label: '奇诺之旅',
      description: '不会出现',
      data: { author: '时雨泽惠一', volumes: 23 },
    },
  ]

  async function custom(props: Partial<CommandPaletteProps<Book>> = {}) {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const onSelect = vi.fn()
    const seen: Array<CommandItemRenderProps<Book>> = []
    const screen = await render(
      <CommandPalette<Book>
        items={books}
        inline
        onSelect={onSelect}
        renderItem={slot => {
          seen.push(slot)
          return (
            <span data-book={slot.item.id}>
              {slot.match ? (
                <>
                  {slot.item.label.slice(0, slot.match.start)}
                  <mark>{slot.item.label.slice(slot.match.start, slot.match.end)}</mark>
                  {slot.item.label.slice(slot.match.end)}
                </>
              ) : (
                slot.item.label
              )}
              <small>{`${slot.item.data!.author} · ${slot.item.data!.volumes} 卷`}</small>
            </span>
          )
        }}
        {...props}
      />,
      { container: host },
    )
    mounted.push(screen)
    return { onSelect, seen, field: () => host.querySelector('input') as HTMLInputElement, host }
  }

  it('renderItem 自定义条目内容:拿到条目数据与匹配位置,键盘导航与选中照常', async () => {
    const s = await custom()
    expect(options()).toHaveLength(2)
    expect(options()[0]!.querySelector('[data-book="spice"] small')!.textContent).toBe(
      '支仓冻砂 · 17 卷',
    )
    expect(options()[1]!.textContent).not.toContain('不会出现')
    expect(s.seen.every(slot => slot.match === null)).toBe(true)

    await userEvent.click(s.field())
    await userEvent.keyboard('香辛')
    await vi.waitFor(() => expect(options()).toHaveLength(1))
    expect(options()[0]!.querySelector('mark')!.textContent).toBe('香辛')
    expect(s.seen.at(-1)!.match).toEqual({ start: 2, end: 4 })

    await userEvent.clear(s.field())
    await userEvent.keyboard('wolf')
    await vi.waitFor(() => expect(options()).toHaveLength(1))
    expect(options()[0]!.querySelector('mark')).toBeNull()
    expect(s.seen.at(-1)!.match).toBeNull()

    await userEvent.clear(s.field())
    await vi.waitFor(() => expect(options()).toHaveLength(2))
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(options()[1]!.dataset.highlighted).toBe(''))
    await userEvent.keyboard('{Enter}')
    expect(s.onSelect.mock.calls[0]![0]).toMatchObject({ id: 'kino', data: { volumes: 23 } })
    await expectNoA11yViolations(s.host)
  })

  it('renderItem 在虚拟滚动下同样生效', async () => {
    const many: CommandItems<Book> = Array.from({ length: 200 }, (_, index) => ({
      id: `book-${index}`,
      label: `第 ${index} 本`,
      data: { author: '佚名', volumes: index },
    }))
    await custom({ items: many, virtualize: true })
    await vi.waitFor(() => expect(options().length).toBeGreaterThan(0))
    expect(options().length).toBeLessThan(200)
    expect(options()[0]!.querySelector('small')!.textContent).toBe('佚名 · 0 卷')
  })

  it('input 替换输入行,CommandPaletteInput 保留筛选、导航与自动聚焦', async () => {
    const { onSelect, trigger } = await harness({
      label: '跳转',
      input: (
        <div data-row="">
          <span data-scope="">书库</span>
          <CommandPaletteInput placeholder="在书库中搜索" className="custom-input" />
        </div>
      ),
    })
    await userEvent.click(trigger)
    await vi.waitFor(() => expect(panel()).toBeTruthy())
    const row = panel()!.querySelector('[data-row]')!
    expect(row.querySelector('[data-scope]')!.textContent).toBe('书库')
    expect(panel()!.querySelectorAll('input')).toHaveLength(1)
    expect(panel()!.querySelector('svg.lucide-search')).toBeNull()
    expect(input().placeholder).toBe('在书库中搜索')
    expect(input().getAttribute('aria-label')).toBe('跳转')
    expect(input().classList.contains('custom-input')).toBe(true)
    await vi.waitFor(() => expect(document.activeElement).toBe(input()))

    await userEvent.keyboard('主题')
    await vi.waitFor(() => expect(options()).toHaveLength(1))
    await vi.waitFor(() => expect(options()[0]!.dataset.highlighted).toBe(''))
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[0]!.id)
    await userEvent.keyboard('{Enter}')
    expect(onSelect.mock.calls[0]![0]).toMatchObject({ id: 'theme' })
    await vi.waitFor(() => expect(panel()).toBeNull())
  })

  it('CommandPaletteInput 脱离 CommandPalette 使用时报错', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(render(<CommandPaletteInput />)).rejects.toThrow(
      'CommandPaletteInput must be used inside CommandPalette',
    )
    error.mockRestore()
  })
})
