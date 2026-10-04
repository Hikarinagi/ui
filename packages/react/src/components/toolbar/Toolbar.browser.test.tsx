import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-react'
import { useState, type FormEvent } from 'react'
import { ConfigProvider } from '../../lib/config'
import { Toolbar } from './Toolbar'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarLink } from './ToolbarLink'
import { ToolbarToggleGroup } from './ToolbarToggleGroup'
import { ToolbarToggleItem } from './ToolbarToggleItem'
import { ToolbarSeparator } from './ToolbarSeparator'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { IconButton } from '../icon-button/IconButton'
import '../../../test/browser.css'

beforeEach(async () => {
  const park = document.createElement('div')
  park.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(park)
  await userEvent.hover(park)
})
afterEach(async () => {
  await cleanup()
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})

function buttons() {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hn-toolbar] button'))
}

describe('Toolbar browser behavior', () => {
  it.each(['ltr', 'rtl'] as const)(
    'moves through all groups in %s without changing selection',
    async dir => {
      document.documentElement.dir = dir
      const model = { value: [] as string[] }
      function Harness() {
        const [value, setValue] = useState<string[]>([])
        return (
          <Toolbar label="Tools">
            <ToolbarButton>First</ToolbarButton>
            <ToolbarButton disabled>Disabled</ToolbarButton>
            <ToolbarToggleGroup
              type="multiple"
              value={value}
              onValueChange={next => {
                model.value = next as string[]
                setValue(next as string[])
              }}
            >
              <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
              <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
            </ToolbarToggleGroup>
            <ToolbarLink href="#help">Help</ToolbarLink>
          </Toolbar>
        )
      }
      await render(<Harness />)
      await userEvent.tab()
      expect(document.activeElement).toBe(buttons()[0])
      const next = dir === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}'
      await userEvent.keyboard(next)
      expect(document.activeElement).toBe(buttons()[2])
      expect(model.value).toEqual([])
      await userEvent.keyboard('{Space}')
      expect(model.value).toEqual(['bold'])
      await userEvent.keyboard(next)
      expect(document.activeElement).toBe(buttons()[3])
      await userEvent.keyboard(next)
      expect(document.activeElement?.tagName).toBe('A')
      await userEvent.keyboard(next)
      expect(document.activeElement).toBe(buttons()[0])
      await userEvent.keyboard('{End}')
      expect(document.activeElement?.tagName).toBe('A')
      await userEvent.keyboard('{Home}')
      expect(document.activeElement).toBe(buttons()[0])
    },
  )

  it('supports vertical navigation, loop control, and inherited group disabling', async () => {
    let setGroupDisabled: (value: boolean) => void = () => {}
    function Harness() {
      const [groupDisabled, setDisabled] = useState(true)
      setGroupDisabled = setDisabled
      return (
        <Toolbar label="Vertical tools" orientation="vertical" loop={false}>
          <ToolbarButton>First</ToolbarButton>
          <ToolbarToggleGroup disabled={groupDisabled}>
            <ToolbarToggleItem value="middle">Middle</ToolbarToggleItem>
          </ToolbarToggleGroup>
          <ToolbarButton>Last</ToolbarButton>
        </Toolbar>
      )
    }
    await render(<Harness />)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons()[2])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons()[2])
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(buttons()[0])
    setGroupDisabled(false)
    await vi.waitFor(() => expect(buttons()[1]!.disabled).toBe(false))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(buttons()[1])
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons()[1])
  })

  it('inherits and reacts to ConfigProvider direction', async () => {
    let setDir: (value: 'ltr' | 'rtl') => void = () => {}
    function Harness() {
      const [dir, update] = useState<'ltr' | 'rtl'>('ltr')
      setDir = update
      return (
        <ConfigProvider dir={dir}>
          <Toolbar label="Direction">
            <ToolbarButton>One</ToolbarButton>
            <ToolbarButton>Two</ToolbarButton>
            <ToolbarButton>Three</ToolbarButton>
          </Toolbar>
        </ConfigProvider>
      )
    }
    await render(<Harness />)
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons()[1])
    setDir('rtl')
    await vi.waitFor(() =>
      expect(document.querySelector('[data-hn-toolbar]')!.getAttribute('dir')).toBe('rtl'),
    )
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(buttons()[0])
  })

  it('is one tab stop, remembers focus, and never submits its surrounding form', async () => {
    const submit = vi.fn((event: FormEvent) => event.preventDefault())
    await render(
      <form onSubmit={submit}>
        <input aria-label="Before" />
        <Toolbar label="Actions">
          <ToolbarButton>One</ToolbarButton>
          <ToolbarButton>Two</ToolbarButton>
          <ToolbarButton>Three</ToolbarButton>
        </Toolbar>
        <input aria-label="After" />
      </form>,
    )
    await userEvent.tab()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Before')
    await userEvent.tab()
    expect(document.activeElement).toBe(buttons()[0])
    await userEvent.keyboard('{ArrowRight}{Enter}')
    expect(submit).not.toHaveBeenCalled()
    await userEvent.tab()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('After')
    await userEvent.tab({ shift: true })
    expect(document.activeElement).toBe(buttons()[1])
    await userEvent.tab({ shift: true })
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Before')
  })

  it('composes tooltips and custom controls with no nested buttons', async () => {
    const clicked = vi.fn()
    const screen = await render(
      <TooltipProvider delayDuration={0}>
        <Toolbar label="Icons" size="sm">
          <ToolbarButton label="Undo" onClick={clicked}>
            ↶
          </ToolbarButton>
          <ToolbarButton asChild>
            <IconButton label="Save">S</IconButton>
          </ToolbarButton>
          <ToolbarButton label="Redo" disabled>
            ↷
          </ToolbarButton>
        </Toolbar>
      </TooltipProvider>,
    )
    expect(screen.container.querySelector('button button')).toBeNull()
    await page.getByRole('button', { name: 'Undo', exact: true }).hover()
    await vi.waitFor(() =>
      expect(document.querySelector('[role=tooltip]')?.textContent).toBe('Undo'),
    )
    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    expect(clicked).toHaveBeenCalledTimes(1)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Save')
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Undo')
    expect(getComputedStyle(buttons()[0]!).height).toBe(getComputedStyle(buttons()[1]!).height)
  })

  it.skip('opens a menu from the keyboard and restores focus to its toolbar trigger', () => {})

  it('activates links with Space without scrolling and blocks disabled links', async () => {
    const click = vi.fn((event: { preventDefault: () => void }) => event.preventDefault())
    await render(
      <Toolbar label="Links">
        <ToolbarLink href="#one" onClick={click}>
          One
        </ToolbarLink>
        <ToolbarLink href="#two" disabled onClick={click}>
          Two
        </ToolbarLink>
        <ToolbarButton>Last</ToolbarButton>
      </Toolbar>,
    )
    await userEvent.tab()
    const before = window.scrollY
    await userEvent.keyboard('{Space}')
    expect(click).toHaveBeenCalledTimes(1)
    expect(window.scrollY).toBe(before)
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement?.textContent).toBe('Last')
  })

  it.each(['horizontal', 'vertical'] as const)(
    'sizes separators and controls in %s layout at narrow widths',
    async orientation => {
      const screen = await render(
        <Toolbar label="Geometry" orientation={orientation} style={{ maxWidth: '240px' }}>
          <ToolbarButton>One</ToolbarButton>
          <ToolbarButton>Two</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>Three</ToolbarButton>
          <ToolbarButton>Four</ToolbarButton>
        </Toolbar>,
      )
      const element = screen.container.firstElementChild as HTMLElement
      expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth)
      const separator = element.querySelector('[role=none]')!.getBoundingClientRect()
      if (orientation === 'horizontal') {
        expect(separator.width).toBe(1)
        expect(separator.height).toBeGreaterThan(10)
      } else {
        expect(separator.height).toBe(1)
        expect(separator.width).toBeGreaterThan(10)
      }
    },
  )
})
