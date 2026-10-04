import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Heading } from './Heading'

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return { element, classes: () => [...element.classList] }
}

describe('Heading', () => {
  it('level 决定语义标签,默认 h2 · xl · 600', () => {
    const w = mount(<Heading>标题</Heading>)
    expect(w.element.tagName).toBe('H2')
    expect(w.classes()).toContain('text-xl')
    expect(w.classes()).toContain('font-semibold')
  })

  it('六个 level 各映射默认视觉档', () => {
    const expected = { 1: '2xl', 2: 'xl', 3: 'lg', 4: 'md', 5: 'base', 6: 'sm' } as const
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      const w = mount(<Heading level={level} />)
      expect(w.element.tagName).toBe(`H${level}`)
      expect(w.classes()).toContain(`text-${expected[level]}`)
    }
  })

  it('语义与视觉解耦:h2 可以穿 2xl 的衣服,标签不变', () => {
    const w = mount(<Heading level={2} size="2xl" />)
    expect(w.element.tagName).toBe('H2')
    expect(w.classes()).toContain('text-2xl')
    expect(w.classes()).not.toContain('text-xl')
  })

  it('大字号自动收紧字距,小字号不收', () => {
    expect(mount(<Heading level={1} />).classes()).toContain('tracking-tight')
    expect(mount(<Heading level={2} />).classes()).toContain('tracking-tight')
    expect(mount(<Heading level={4} />).classes()).not.toContain('tracking-tight')
  })

  it('weight 可降档,truncate 可截断', () => {
    const w = mount(<Heading weight="medium" truncate={true} />)
    expect(w.classes()).toContain('font-medium')
    expect(w.classes()).toContain('truncate')
  })
})
