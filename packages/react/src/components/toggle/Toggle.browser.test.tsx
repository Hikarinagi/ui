import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import type { ReactNode } from 'react'
import { Toggle, type ToggleProps } from './Toggle'
import { Button } from '../button/Button'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(async () => {
  await cleanup()
})

function attach() {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 40px'
  document.body.appendChild(host)
  return host
}

interface State {
  value?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline'
}

interface Slots {
  children?: ReactNode
  renderIcon?: ToggleProps['renderIcon']
  pressedIcon?: ReactNode
}

async function mountToggle(props: Partial<State> = {}, slots: Slots = {}) {
  const state = signal<State>({ value: false, ...props })
  const content: Slots = { children: '加粗', ...slots }
  function Harness() {
    const current = state.use()
    return (
      <TooltipProvider>
        <Toggle
          {...current}
          {...content}
          onValueChange={value => (state.value = { ...state.value, value })}
        />
      </TooltipProvider>
    )
  }
  const host = attach()
  await render(<Harness />, { container: host })
  const button = host.querySelector('[data-hn-toggle]') as HTMLButtonElement
  return { state, button }
}

const ink = (el: Element) => getComputedStyle(el, '::after')
const reference = (className: string) => {
  const el = document.createElement('span')
  el.className = className
  document.body.appendChild(el)
  return getComputedStyle(el)
}

describe('toggle · 按下态', () => {
  it('松开时无墨、字色 fg；按下后墨是品牌色的选中墨、字色转 accent-text', async () => {
    const { button } = await mountToggle()
    expect(parseFloat(ink(button).opacity)).toBe(0)
    expect(getComputedStyle(button).color).toBe(reference('text-fg').color)

    await userEvent.click(button)
    await vi.waitFor(() => expect(button.getAttribute('aria-pressed')).toBe('true'))
    await userEvent.unhover(button)
    const selected = parseFloat(
      getComputedStyle(button).getPropertyValue('--hn-state-selected-opacity'),
    )
    await vi.waitFor(() => expect(parseFloat(ink(button).opacity)).toBeCloseTo(selected, 2))
    expect(ink(button).backgroundColor).toBe(reference('bg-accent').backgroundColor)
    await vi.waitFor(() =>
      expect(getComputedStyle(button).color).toBe(reference('text-accent-text').color),
    )
  })

  it('悬停按下态的按钮，hover 墨叠在选中墨之上', async () => {
    const { button } = await mountToggle({ value: true })
    const selected = parseFloat(
      getComputedStyle(button).getPropertyValue('--hn-state-selected-opacity'),
    )
    const hover = parseFloat(getComputedStyle(button).getPropertyValue('--hn-state-hover-opacity'))
    await userEvent.hover(button)
    await vi.waitFor(() => expect(parseFloat(ink(button).opacity)).toBeCloseTo(selected + hover, 2))
  })
})

describe('toggle · 图标型', () => {
  it('无文字插槽时按钮为正方形，悬停出现 label 文字提示', async () => {
    const { button } = await mountToggle(
      { label: '加粗' },
      { children: undefined, renderIcon: () => <svg /> },
    )
    expect(button.offsetWidth).toBe(button.offsetHeight)
    expect(button.getAttribute('aria-label')).toBe('加粗')
    await userEvent.hover(button)
    await vi.waitFor(() =>
      expect(document.querySelector('[role="tooltip"]')?.textContent?.trim()).toBe('加粗'),
    )
  })

  it('有 #pressed-icon 时按下是交叉淡变：离场图标短暂叠在原位，随后只剩新图标', async () => {
    const { button } = await mountToggle(
      { label: '收藏' },
      {
        children: undefined,
        renderIcon: () => <svg data-icon="off" />,
        pressedIcon: <svg data-icon="on" />,
      },
    )
    await userEvent.click(button)
    await vi.waitFor(() => expect(button.querySelector('[data-icon="on"]')).not.toBeNull())
    expect(button.innerHTML).toContain('data-icon="off"')
    await vi.waitFor(() => expect(button.querySelector('[data-icon="off"]')).toBeNull(), {
      timeout: 1500,
    })
  })
})

describe('toggle · 与 Button 同一副尺寸', () => {
  it.each(['comfortable', 'compact'])(
    '文字型带 label 时保留与 Button 相同的内边距（%s）',
    async density => {
      for (const size of ['sm', 'md', 'lg'] as const) {
        const referenceHost = attach()
        await render(
          <Button size={size} data-density={density} icon={<svg />}>
            加粗
          </Button>,
          { container: referenceHost },
        )
        const { button } = await mountToggle(
          { size, label: '加粗文字' },
          { renderIcon: () => <svg /> },
        )
        button.setAttribute('data-density', density)
        const referenceButton = referenceHost.querySelector('button') as HTMLElement
        const style = getComputedStyle(button)
        const referenceStyle = getComputedStyle(referenceButton)
        expect(parseFloat(style.paddingInlineStart)).toBeGreaterThan(0)
        expect(style.paddingInlineStart).toBe(referenceStyle.paddingInlineStart)
        expect(style.paddingInlineEnd).toBe(referenceStyle.paddingInlineEnd)
        expect(style.aspectRatio).toBe('auto')
        expect(button.offsetHeight).toBe(referenceButton.offsetHeight)
        expect(button.getAttribute('aria-label')).toBe('加粗文字')
        await userEvent.click(button)
        expect(button.getAttribute('aria-pressed')).toBe('true')
        expect(style.paddingInlineStart).toBe(referenceStyle.paddingInlineStart)
      }
    },
  )

  it('三档高度与 Button 逐档相等', async () => {
    for (const size of ['sm', 'md', 'lg'] as const) {
      const referenceHost = attach()
      await render(<Button size={size}>按钮</Button>, { container: referenceHost })
      const { button: toggleEl } = await mountToggle({ size })
      expect(toggleEl.offsetHeight).toBe(
        (referenceHost.querySelector('button') as HTMLElement).offsetHeight,
      )
    }
  })
})
