import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { CommandPalette, type CommandPaletteProps } from './CommandPalette'
import { Button } from '../button/Button'
import type { CommandItems } from './types'
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
})
