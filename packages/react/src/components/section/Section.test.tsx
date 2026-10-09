import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Section } from './Section'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

describe('Section', () => {
  it('有 title 时由标题命名,成为具名区域', async () => {
    const { container } = render(<Section title="基本信息">正文</Section>)
    const section = container.querySelector('section')!
    const heading = container.querySelector('h2')!
    expect(heading.textContent).toBe('基本信息')
    expect(heading.id).toBeTruthy()
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id)
    await expectNoA11yViolations(section)
  })

  it('没有 title 时不加 aria-labelledby', () => {
    const { container } = render(<Section>正文</Section>)
    expect(container.querySelector('h2')).toBeNull()
    expect(container.querySelector('section')!.hasAttribute('aria-labelledby')).toBe(false)
  })

  it('调用方自带名称时以调用方为准', () => {
    const labelled = render(<Section title="基本信息" aria-label="资料" />).container.querySelector(
      'section',
    )!
    expect(labelled.getAttribute('aria-label')).toBe('资料')
    expect(labelled.hasAttribute('aria-labelledby')).toBe(false)

    const referenced = render(
      <Section title="基本信息" aria-labelledby="outer" />,
    ).container.querySelector('section')!
    expect(referenced.getAttribute('aria-labelledby')).toBe('outer')
  })

  it('两个 Section 的标题 id 互不相同', () => {
    const { container } = render(
      <div>
        <Section title="一" />
        <Section title="二" />
      </div>,
    )
    const [first, second] = [...container.querySelectorAll('h2')].map(heading => heading.id)
    expect(first).not.toBe(second)
  })
})
