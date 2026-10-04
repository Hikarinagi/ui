import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Flex } from './Flex'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const element = render(ui).container.firstElementChild as HTMLElement
  return { element, classes: () => [...element.classList] }
}

describe('渲染', () => {
  it('默认 row,不带 gap / align / justify / wrap —— 裸金属保持 CSS 默认', () => {
    const w = mount(<Flex />)
    expect(w.classes()).toContain('flex')
    expect(w.classes()).toContain('flex-row')
    const joined = w.classes().join(' ')
    expect(joined).not.toContain('gap-')
    expect(joined).not.toContain('items-')
    expect(joined).not.toContain('justify-')
    expect(joined).not.toContain('flex-wrap')
  })

  it('全旋钮落对应类', () => {
    const w = mount(
      <Flex direction="col-reverse" align="end" justify="between" wrap={true} gap="lg" />,
    )
    expect(w.classes()).toContain('flex-col-reverse')
    expect(w.classes()).toContain('items-end')
    expect(w.classes()).toContain('justify-between')
    expect(w.classes()).toContain('flex-wrap')
    expect(w.classes()).toContain('gap-6')
  })

  it('gap md 随方向取密度 token:横向 inline-gap,纵向 stack-gap', () => {
    expect(mount(<Flex gap="md" />).classes()).toContain('gap-[var(--hn-inline-gap)]')
    expect(mount(<Flex gap="md" direction="col" />).classes()).toContain(
      'gap-[var(--hn-stack-gap)]',
    )
    expect(mount(<Flex gap="md" direction="row-reverse" />).classes()).toContain(
      'gap-[var(--hn-inline-gap)]',
    )
  })

  it('as 换语义标签', () => {
    expect(mount(<Flex as="header" />).element.tagName).toBe('HEADER')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(
      <Flex>
        <span>甲</span>
        <span>乙</span>
      </Flex>,
    )
    await expectNoA11yViolations(w.element)
  })
})
