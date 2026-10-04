import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { NavigationMenu } from './NavigationMenu'
import { NavigationMenuItem } from './NavigationMenuItem'
import { NavigationMenuTrigger } from './NavigationMenuTrigger'
import { NavigationMenuContent } from './NavigationMenuContent'
import { NavigationMenuLink } from './NavigationMenuLink'
import type { NavigationMenuProps } from './types'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

function setup(props: Partial<NavigationMenuProps> = {}) {
  const valueChange = vi.fn()
  const ui = (next: Partial<NavigationMenuProps>) => (
    <NavigationMenu label="Navigation" trigger="click" onValueChange={valueChange} {...next}>
      <NavigationMenuItem value="learn">
        <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#start" description="Start here">
            Introduction
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#about" active>
          About
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger disabled>Disabled</NavigationMenuTrigger>
      </NavigationMenuItem>
    </NavigationMenu>
  )
  const screen = render(ui(props))
  return {
    ...screen,
    element: screen.container.firstElementChild as HTMLElement,
    valueChange,
    setProps: (next: Partial<NavigationMenuProps>) => screen.rerender(ui({ ...props, ...next })),
  }
}

describe('NavigationMenu', () => {
  it('renders a named navigation landmark with list items, links and safe trigger buttons', () => {
    const wrapper = setup()
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.element.getAttribute('aria-label')).toBe('Navigation')
    expect(wrapper.element.querySelectorAll('ul > li')).toHaveLength(3)
    expect(wrapper.element.querySelector('button')!.getAttribute('type')).toBe('button')
    expect(wrapper.element.querySelector('a')!.getAttribute('href')).toBe('#about')
    expect(wrapper.element.querySelector('a')!.getAttribute('aria-current')).toBe('page')
    expect(wrapper.element.querySelector('[role=menu]')).toBeNull()
  })

  it('opens the content, associates it with the trigger and toggles the model', async () => {
    const wrapper = setup()
    fireEvent.click(wrapper.element.querySelector('button')!)
    await vi.waitFor(() =>
      expect(document.querySelector('[data-hn-navigation-content]')).not.toBeNull(),
    )
    const trigger = wrapper.element.querySelector('button')!
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    const content = document.querySelector('[data-hn-navigation-content]')!
    expect(content.id).toBe(trigger.getAttribute('aria-controls'))
    expect(content.getAttribute('aria-labelledby')).toBe(trigger.getAttribute('id'))
    expect(content.textContent).toContain('Start here')
    expect(wrapper.valueChange.mock.calls[0]).toEqual(['learn'])
    fireEvent.click(trigger)
    expect(wrapper.valueChange.mock.calls[1]).toEqual([''])
  })

  it('responds to controlled state and closes after selecting a content link', async () => {
    const wrapper = setup({ value: 'learn' })
    await vi.waitFor(() => expect(document.querySelector('a[href="#start"]')).not.toBeNull())
    act(() => (document.querySelector('a[href="#start"]') as HTMLElement).click())
    expect(wrapper.valueChange.mock.calls[0]).toEqual([''])
    wrapper.setProps({ value: '' })
    expect(wrapper.element.querySelector('button')!.getAttribute('aria-expanded')).toBe('false')
  })

  it('forwards select cancellation and disabled links cannot activate', () => {
    const select = vi.fn((event: Event) => event.preventDefault())
    const click = vi.fn()
    const { container } = render(
      <NavigationMenu label="Links">
        <NavigationMenuItem>
          <NavigationMenuLink href="#enabled" onSelect={select}>
            Enabled
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#disabled" disabled onClick={click} onSelect={select}>
            Disabled
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>,
    )
    const links = container.querySelectorAll('a')
    fireEvent.click(links[0]!)
    expect(select).toHaveBeenCalledOnce()
    expect(select.mock.calls[0]![0].defaultPrevented).toBe(true)
    fireEvent.click(links[1]!)
    expect(select).toHaveBeenCalledOnce()
    expect(click).not.toHaveBeenCalled()
    expect(links[1]!.getAttribute('aria-disabled')).toBe('true')
    expect(links[1]!.getAttribute('tabindex')).toBe('-1')
  })

  it('inherits size changes and forwards control slots without nested links', () => {
    const ui = (size: 'sm' | 'lg') => (
      <NavigationMenu label="Links" size={size}>
        <NavigationMenuItem>
          <NavigationMenuLink asChild active>
            <a href="#custom">Custom</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    )
    const { container, rerender } = render(ui('sm'))
    expect(container.querySelectorAll('a')).toHaveLength(1)
    expect(container.querySelector('a')!.getAttribute('aria-current')).toBe('page')
    expect([...container.querySelector('a')!.classList].join(' ')).toContain('--hn-control-h-sm')
    rerender(ui('lg'))
    expect([...container.querySelector('a')!.classList].join(' ')).toContain('--hn-control-h-lg')
  })

  it('has no accessibility violations', async () => {
    const wrapper = setup()
    await expectNoA11yViolations(wrapper.element)
  })
})
