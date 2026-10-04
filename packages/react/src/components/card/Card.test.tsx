import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Card } from './Card'
import { Ripple } from '../ripple/Ripple'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const { container } = render(ui)
  const element = container.firstElementChild as HTMLElement
  return {
    element,
    classes: () => [...element.classList],
    text: () => element.textContent ?? '',
    attributes: (name: string) => element.getAttribute(name) ?? undefined,
    find: (selector: string) => ({ exists: () => element.querySelector(selector) !== null }),
  }
}

describe('Card', () => {
  it('默认是带内边距的静态 div,发丝线 + 最轻阴影', () => {
    const w = mount(<Card>内容</Card>)
    expect(w.element.tagName).toBe('DIV')
    expect(w.classes()).toContain('border-line')
    expect(w.classes()).toContain('shadow-sm')
    expect(w.classes()).not.toContain('hn-interactive')
  })

  it('padded false 去掉内边距', () => {
    const w = mount(<Card padded={false} />)
    expect(w.classes().join(' ')).not.toContain('p-[')
  })

  it('自身不带任何可点样式,可点视觉由调用方组合公开件', () => {
    const plain = mount(<Card />)
    expect(plain.classes().join(' ')).not.toMatch(/hn-interactive|hn-state-layer|hover:/)

    const composed = mount(
      <Card as="button" className="hn-interactive hn-state-layer hn-press-lg">
        <Ripple />
        内容
      </Card>,
    )
    expect(composed.element.tagName).toBe('BUTTON')
    expect(composed.classes()).toContain('hn-state-layer')
    expect(composed.find('.hn-ripple').exists()).toBe(true)
  })
})

describe('VisuallyHidden', () => {
  it('内容在可访问树里,视觉上被裁剪', () => {
    const w = mount(<VisuallyHidden>仅读屏</VisuallyHidden>)
    expect(w.text()).toBe('仅读屏')
    const style = w.element.style
    expect(style.position).toBe('absolute')
    expect(style.width).toBe('1px')
  })

  it('不对辅助技术隐藏,屏幕阅读器照常读出', () => {
    const w = mount(<VisuallyHidden>仅读屏</VisuallyHidden>)
    expect(w.attributes('aria-hidden')).toBeUndefined()
  })

  it('as-child 把裁剪样式交给唯一子元素', () => {
    const w = mount(
      <VisuallyHidden asChild>
        <label>仅读屏</label>
      </VisuallyHidden>,
    )
    expect(w.element.tagName).toBe('LABEL')
    expect(w.element.style.position).toBe('absolute')
  })
})
