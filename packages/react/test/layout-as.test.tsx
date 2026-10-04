import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { memo, type ElementType, type MouseEvent, type ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { Inline } from '../src/components/inline/Inline'
import { Flex } from '../src/components/flex/Flex'
import { Stack } from '../src/components/stack/Stack'

interface LinkProps {
  to: string
  className?: string
  children?: ReactNode
  onActivate?: (destination: string) => void
}

const ObjectLink = memo(function ObjectLink({
  to,
  className,
  children,
  onActivate,
  ...rest
}: LinkProps) {
  return (
    <a
      {...rest}
      href={to}
      className={['custom-root', className].filter(Boolean).join(' ')}
      onClick={(event: MouseEvent) => {
        event.preventDefault()
        onActivate?.(to)
      }}
    >
      {children}
    </a>
  )
})
function FunctionalLink({ to, className, children, onActivate, ...rest }: LinkProps) {
  return (
    <a
      {...rest}
      href={to}
      className={['custom-root', className].filter(Boolean).join(' ')}
      onClick={(event: MouseEvent) => {
        event.preventDefault()
        onActivate?.(to)
      }}
    >
      {children}
    </a>
  )
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe.each([
  ['Inline', Inline],
  ['Flex', Flex],
  ['Stack', Stack],
] as [string, ElementType][])('%s component roots', (_, Layout) => {
  it.each([ObjectLink, FunctionalLink] as ElementType[])(
    'forwards layout, props, attributes, content and events',
    async as => {
      const warn = vi.spyOn(console, 'warn')
      const activate = vi.fn()
      const w = render(
        <Layout
          as={as}
          gap="sm"
          className="caller-class"
          to="/destination"
          aria-label="Destination"
          onActivate={activate}
        >
          <span>Open destination</span>
        </Layout>,
      )
      try {
        const element = w.container.firstElementChild as HTMLElement
        expect(element.tagName).toBe('A')
        expect([...element.classList]).toEqual(
          expect.arrayContaining(['flex', 'gap-2', 'custom-root', 'caller-class']),
        )
        expect(element.getAttribute('href') ?? undefined).toBe('/destination')
        expect(element.getAttribute('aria-label') ?? undefined).toBe('Destination')
        expect(element.querySelector('span')!.textContent).toBe('Open destination')
        fireEvent.click(element)
        expect(activate).toHaveBeenCalledExactlyOnceWith('/destination')
        expect(warn).not.toHaveBeenCalled()
      } finally {
        w.unmount()
      }
    },
  )

  it.each([ObjectLink, FunctionalLink] as ElementType[])(
    'renders the component root and layout during SSR',
    async as => {
      const warn = vi.spyOn(console, 'warn')
      const html = renderToString(
        <Layout as={as} gap="sm" to="/destination">
          Destination
        </Layout>,
      )
      const host = document.createElement('div')
      host.innerHTML = html
      expect(host.childElementCount).toBe(1)
      const root = host.firstElementChild!
      expect(root.tagName).toBe('A')
      expect(root.getAttribute('href')).toBe('/destination')
      expect([...root.classList]).toEqual(expect.arrayContaining(['flex', 'gap-2', 'custom-root']))
      expect(root.textContent).toBe('Destination')
      expect(warn).not.toHaveBeenCalled()
    },
  )
})
