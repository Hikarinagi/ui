import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import axe from 'axe-core'
import { Toolbar } from './Toolbar'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarLink } from './ToolbarLink'
import { ToolbarToggleGroup } from './ToolbarToggleGroup'
import { ToolbarToggleItem } from './ToolbarToggleItem'
import { ToolbarSeparator } from './ToolbarSeparator'
import { Button } from '../button/Button'
import { Toggle } from '../toggle/Toggle'
import type { ToolbarProps } from './types'

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

function ui(props: Partial<ToolbarProps> = {}) {
  return (
    <Toolbar label="Actions" {...props}>
      <ToolbarButton>First</ToolbarButton>
      <ToolbarButton disabled>Disabled</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#help">Help</ToolbarLink>
    </Toolbar>
  )
}

function setup(props: Partial<ToolbarProps> = {}) {
  const screen = render(ui(props))
  return {
    ...screen,
    element: screen.container.firstElementChild as HTMLElement,
    setProps: (next: Partial<ToolbarProps>) => screen.rerender(ui({ ...props, ...next })),
  }
}

const buttonsOf = (root: Element) => Array.from(root.querySelectorAll('button'))

describe('Toolbar', () => {
  it('provides a named toolbar, safe button types, links and perpendicular separators', async () => {
    const wrapper = setup()
    expect(wrapper.element.getAttribute('role')).toBe('toolbar')
    expect(wrapper.element.getAttribute('aria-label')).toBe('Actions')
    expect(wrapper.element.getAttribute('aria-orientation')).toBe('horizontal')
    expect(wrapper.element.querySelector('button')!.getAttribute('type')).toBe('button')
    expect(wrapper.element.querySelector('a')!.getAttribute('href')).toBe('#help')
    expect(wrapper.element.querySelector('a')!.getAttribute('type')).toBeNull()
    expect(wrapper.element.querySelector('[role=none]')!.getAttribute('data-orientation')).toBe(
      'vertical',
    )
    wrapper.setProps({ orientation: 'vertical' })
    expect(wrapper.element.getAttribute('aria-orientation')).toBe('vertical')
    expect(wrapper.element.querySelector('[role=none]')!.getAttribute('data-orientation')).toBe(
      'horizontal',
    )
  })

  it('inherits sizing and root disabled state reactively', async () => {
    const wrapper = setup({ size: 'sm' })
    expect(wrapper.element.querySelector('button')!.className).toContain('--hn-control-h-sm')
    wrapper.setProps({ size: 'lg', disabled: true })
    expect(wrapper.element.querySelector('button')!.className).toContain('--hn-control-h-lg')
    expect(buttonsOf(wrapper.element).every(button => button.disabled)).toBe(true)
    expect(wrapper.element.querySelector('a')!.getAttribute('aria-disabled')).toBe('true')
    wrapper.setProps({ disabled: false })
    expect(buttonsOf(wrapper.element).map(button => button.disabled)).toEqual([false, true])
    expect(wrapper.element.querySelector('a')!.getAttribute('aria-disabled')).toBeNull()
  })

  it('allows per-control sizes and custom button composition without nested buttons', async () => {
    const pressed = { value: false }
    const click = vi.fn()
    function Harness() {
      const [on, setOn] = useState(false)
      return (
        <Toolbar label="Custom" size="lg">
          <ToolbarButton size="sm" onClick={click}>
            Small
          </ToolbarButton>
          <ToolbarButton asChild>
            <Button variant="soft">Custom</Button>
          </ToolbarButton>
          <ToolbarButton asChild>
            <Toggle
              value={on}
              onValueChange={value => {
                pressed.value = value
                setOn(value)
              }}
            >
              Toggle
            </Toggle>
          </ToolbarButton>
        </Toolbar>
      )
    }
    const { container } = render(<Harness />)
    expect(container.querySelector('button')!.className).toContain('--hn-control-h-sm')
    expect(container.querySelectorAll('button')).toHaveLength(3)
    expect(container.querySelector('button button')).toBeNull()
    fireEvent.click(container.querySelectorAll('button')[0]!)
    expect(click).toHaveBeenCalledTimes(1)
    fireEvent.click(container.querySelectorAll('button')[2]!)
    expect(pressed.value).toBe(true)
  })

  it('supports controlled single selection and clearing the current item', async () => {
    const value: { value: string | undefined } = { value: undefined }
    function Harness() {
      const [model, setModel] = useState<string>()
      return (
        <Toolbar label="Alignment">
          <ToolbarToggleGroup
            value={model}
            onValueChange={next => {
              value.value = next as string
              setModel(next as string)
            }}
            type="single"
          >
            <ToolbarToggleItem value="start">Start</ToolbarToggleItem>
            <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
          </ToolbarToggleGroup>
        </Toolbar>
      )
    }
    const { container } = render(<Harness />)
    const buttons = buttonsOf(container)
    fireEvent.click(buttons[0]!)
    expect(value.value).toBe('start')
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(buttons[1]!)
    expect(value.value).toBe('center')
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(buttons[1]!)
    expect(value.value).toBeUndefined()
  })

  it('supports independent multiple selections and uncontrolled defaults', async () => {
    const { container } = render(
      <Toolbar label="Formats">
        <ToolbarToggleGroup type="multiple" defaultValue={['bold']}>
          <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
          <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>,
    )
    const buttons = buttonsOf(container)
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(buttons[1]!)
    expect(buttons.every(button => button.getAttribute('aria-pressed') === 'true')).toBe(true)
    fireEvent.click(buttons[0]!)
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('false')
    expect(buttons[1]!.getAttribute('aria-pressed')).toBe('true')
  })

  it('combines group, root, item disabled and loading states', async () => {
    const view = (disabled: boolean, loading: boolean, rootDisabled?: boolean) => (
      <Toolbar label="Disabled" disabled={rootDisabled}>
        <ToolbarToggleGroup disabled={disabled}>
          <ToolbarToggleItem value="one">One</ToolbarToggleItem>
          <ToolbarToggleItem value="two" disabled>
            Two
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarButton loading={loading}>Save</ToolbarButton>
      </Toolbar>
    )
    const { container, rerender } = render(view(true, true))
    expect(buttonsOf(container).every(button => button.disabled)).toBe(true)
    rerender(view(false, false))
    expect(buttonsOf(container).map(button => button.disabled)).toEqual([false, true, false])
    rerender(view(false, false, true))
    expect(buttonsOf(container).every(button => button.disabled)).toBe(true)
  })

  it('does not activate disabled links or submit a surrounding form', async () => {
    const clicked = vi.fn()
    const { container } = render(
      <Toolbar label="Links">
        <ToolbarLink href="#help" disabled onClick={clicked}>
          Help
        </ToolbarLink>
      </Toolbar>,
    )
    fireEvent.click(container.querySelector('a')!)
    fireEvent.keyDown(container.querySelector('a')!, { key: ' ' })
    expect(clicked).not.toHaveBeenCalled()
  })

  it('keeps native attributes and accessible names on the interactive element', async () => {
    const { container } = render(
      <Toolbar label="Accessible toolbar">
        <ToolbarButton label="Undo" tooltip={false}>
          ↶
        </ToolbarButton>
        <ToolbarToggleGroup label="Formatting" type="multiple">
          <ToolbarToggleItem value="bold" label="Bold">
            B
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator decorative={false} />
        <ToolbarLink href="#help" target="_blank" rel="noopener">
          Help
        </ToolbarLink>
      </Toolbar>,
    )
    const element = container.firstElementChild!
    expect(element.querySelector('button')!.getAttribute('aria-label')).toBe('Undo')
    expect(element.querySelector('[role=group]')!.getAttribute('aria-label')).toBe('Formatting')
    expect(element.querySelector('[role=separator]')!.getAttribute('aria-orientation')).toBe(
      'vertical',
    )
    expect(element.querySelector('a')!.getAttribute('target')).toBe('_blank')
    const result = await axe.run(element, {
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(result.violations).toEqual([])
  })
})
