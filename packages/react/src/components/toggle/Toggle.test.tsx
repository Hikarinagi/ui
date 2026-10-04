import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState, type ReactNode } from 'react'
import { Toggle } from './Toggle'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  const container = screen.container
  return {
    ...screen,
    element: container.firstElementChild as HTMLElement,
    find: (selector: string) => container.querySelector(selector) as HTMLElement | null,
  }
}

describe('结构', () => {
  it('根是带 aria-pressed 的按钮，attrs 与 class 落在它上面；默认 ghost 中性 md', () => {
    const w = mount(
      <Toggle className="w-32" data-x="1">
        仅看已完结
      </Toggle>,
    )
    const button = w.find('button')!
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.getAttribute('data-state')).toBe('off')
    expect(button.getAttribute('data-hn-toggle')).toBe('')
    expect(button.getAttribute('data-x')).toBe('1')
    expect([...button.classList]).toContain('w-32')
    expect([...button.classList]).toContain('hn-state-layer')
    expect([...button.classList]).toContain('text-fg')
    expect([...button.classList]).toContain('aria-pressed:text-accent-text')
    expect([...button.classList]).toContain('h-[var(--hn-control-h-md)]')
    expect(button.textContent?.trim()).toBe('仅看已完结')
  })

  it('无文字插槽时使用图标型：正方、aria-label 取 label；outline、pill 与 disabled 落在按钮上', () => {
    const icon = mount(
      <Toggle label="加粗" variant="outline" pill disabled renderIcon={() => <svg />} />,
    )
    const button = icon.find('button')!
    expect(button.getAttribute('aria-label')).toBe('加粗')
    expect([...button.classList]).toContain('aspect-square')
    expect([...button.classList]).toContain('border-line')
    expect([...button.classList]).toContain('rounded-full')
    expect(button.getAttribute('disabled')).not.toBeNull()
    expect(button.querySelector('svg')).not.toBeNull()
  })
})

describe('交互', () => {
  it('点击在按下与松开之间切换并写回 v-model', async () => {
    const update = vi.fn()
    function Harness() {
      const [value, setValue] = useState(false)
      return (
        <Toggle
          value={value}
          onValueChange={next => {
            update(next)
            setValue(next)
          }}
        >
          加粗
        </Toggle>
      )
    }
    const w = mount(<Harness />)
    fireEvent.click(w.find('button')!)
    expect(update.mock.calls[0]).toEqual([true])
    expect(w.find('button')!.getAttribute('aria-pressed')).toBe('true')
    expect(w.find('button')!.getAttribute('data-state')).toBe('on')
    fireEvent.click(w.find('button')!)
    expect(update.mock.calls[1]).toEqual([false])
  })

  it('#icon 拿到 pressed；有 #pressed-icon 时按下后换成它', async () => {
    const ui = (value: boolean) => (
      <Toggle
        label="收藏"
        value={value}
        renderIcon={({ pressed }) => <i data-pressed={String(pressed)} />}
        pressedIcon={<b>已收藏</b>}
      />
    )
    const w = mount(ui(false))
    expect(w.find('i')!.getAttribute('data-pressed')).toBe('false')
    expect(w.find('b')).toBeNull()
    w.rerender(ui(true))
    expect(w.find('b')!.textContent).toBe('已收藏')
  })
})

describe('无障碍', () => {
  it('文字型与图标型都无违规', async () => {
    const text = mount(<Toggle>加粗</Toggle>)
    await expectNoA11yViolations(text.element)
    const icon = mount(<Toggle label="加粗" value renderIcon={() => <svg aria-hidden="true" />} />)
    await expectNoA11yViolations(icon.element)
  })
})
