import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { NavLink } from './NavLink'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const classes = (element: Element) => [...element.classList]

describe('渲染与状态', () => {
  it('默认渲染 a,静止 muted 字色、行项不弹(hn-press-none)', () => {
    const { container } = render(<NavLink href="/docs">组件</NavLink>)
    const a = container.querySelector('a')
    expect(a).not.toBeNull()
    expect(a!.getAttribute('href')).toBe('/docs')
    expect(classes(a!)).toContain('text-muted')
    expect(classes(a!)).toContain('hn-press-none')
    expect(a!.getAttribute('aria-current') ?? undefined).toBeUndefined()
  })

  it('active = aria-current="page" + 选中墨(data-state=selected)+ 字色回正加重', () => {
    const { container } = render(
      <NavLink active href="/docs">
        组件
      </NavLink>,
    )
    const a = container.querySelector('a')!
    expect(a.getAttribute('aria-current')).toBe('page')
    expect(a.getAttribute('data-state')).toBe('selected')
    expect(classes(a)).toContain('text-fg')
    expect(classes(a)).toContain('font-medium')
    expect(classes(a)).not.toContain('text-muted')
  })

  it('disabled 退出 tab 序列并打 aria-disabled', () => {
    const { container } = render(<NavLink disabled href="/x" />)
    const a = container.querySelector('a')!
    expect(a.getAttribute('aria-disabled')).toBe('true')
    expect(a.getAttribute('tabindex')).toBe('-1')
  })

  it('disabled 同时挡住鼠标并降透明度,与其余组件的禁用态一致', () => {
    const { container } = render(<NavLink disabled href="/x" />)
    const a = container.querySelector('a')!
    expect(a.getAttribute('data-disabled')).toBe('')
    expect(classes(a)).toContain('data-disabled:pointer-events-none')
    expect(classes(a)).toContain('data-disabled:opacity-50')
  })

  it('as 可换路由组件,icon 插槽在前', () => {
    function RouterStub({ to, children, ...rest }: { to: string; children?: ReactNode }) {
      return (
        <a {...rest} href={to} data-router="">
          {children}
        </a>
      )
    }
    const { container } = render(
      <NavLink as={RouterStub} {...{ to: '/guide' }} icon={<svg className="nav-icon" />}>
        指南
      </NavLink>,
    )
    const a = container.querySelector('[data-router]')
    expect(a).not.toBeNull()
    expect(a!.getAttribute('href')).toBe('/guide')
    expect((a!.firstElementChild as HTMLElement).classList.contains('nav-icon')).toBe(true)
  })

  it('asChild 由子元素承担链接,图标与文字留在它内部', () => {
    const { container } = render(
      <NavLink asChild active className="w-40" data-x="1" icon={<svg className="nav-icon" />}>
        <a href="/child" className="own">
          子元素
        </a>
      </NavLink>,
    )
    const a = container.querySelector('a')!
    expect(container.firstElementChild).toBe(a)
    expect(a.getAttribute('href')).toBe('/child')
    expect(a.getAttribute('aria-current')).toBe('page')
    expect(a.getAttribute('data-state')).toBe('selected')
    expect(a.getAttribute('data-x')).toBe('1')
    expect([...a.classList]).toEqual(expect.arrayContaining(['hn-interactive', 'w-40', 'own']))
    const [icon, label] = Array.from(a.children)
    expect(icon!.classList.contains('nav-icon')).toBe(true)
    expect(icon!.hasAttribute('aria-current')).toBe(false)
    expect(label!.hasAttribute('data-hn-label')).toBe(true)
    expect(label!.hasAttribute('aria-current')).toBe(false)
    expect(label!.textContent).toBe('子元素')
    expect(label!.querySelector('a')).toBeNull()
  })

  it('asChild 的子元素是组件时同样成为链接根', () => {
    function RouterStub({ to, children, ...rest }: { to: string; children?: ReactNode }) {
      return (
        <a {...rest} href={to} data-router="">
          {children}
        </a>
      )
    }
    const { container } = render(
      <NavLink asChild icon={<svg className="nav-icon" />}>
        <RouterStub to="/guide">指南</RouterStub>
      </NavLink>,
    )
    const a = container.querySelector('[data-router]')!
    expect(container.firstElementChild).toBe(a)
    expect(a.getAttribute('href')).toBe('/guide')
    expect(a.classList.contains('hn-interactive')).toBe(true)
    expect((a.firstElementChild as HTMLElement).classList.contains('nav-icon')).toBe(true)
    expect(a.querySelector('[data-hn-label]')!.textContent).toBe('指南')
  })
})

describe('a11y', () => {
  it('无 a11y 违规(静止与 active)', async () => {
    const rest = render(
      <nav>
        <NavLink href="/a">甲</NavLink>
        <NavLink href="/b">乙</NavLink>
      </nav>,
    )
    await expectNoA11yViolations(rest.container.firstElementChild as HTMLElement)

    const active = render(
      <nav>
        <NavLink href="/a" active>
          甲
        </NavLink>
      </nav>,
    )
    await expectNoA11yViolations(active.container.firstElementChild as HTMLElement)
  })
})
