import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { SimpleGrid } from './SimpleGrid'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (element: Element) => [...element.classList]

describe('渲染', () => {
  it('默认 auto-fill + min 经 CSS 变量注入', () => {
    const element = mount(<SimpleGrid />)
    expect(classes(element)).toContain(
      'grid-cols-[repeat(auto-fill,minmax(var(--hn-simple-grid-min),1fr))]',
    )
    expect(element.style.getPropertyValue('--hn-simple-grid-min')).toBe('14rem')
  })

  it('fit 切 auto-fit,min 可覆写', () => {
    const element = mount(<SimpleGrid fit min="10rem" />)
    expect(classes(element)).toContain(
      'grid-cols-[repeat(auto-fit,minmax(var(--hn-simple-grid-min),1fr))]',
    )
    expect(element.style.getPropertyValue('--hn-simple-grid-min')).toBe('10rem')
  })

  it('md 档双轴密度间距,as 换标签', () => {
    expect(classes(mount(<SimpleGrid />))).toContain('gap-y-[var(--hn-stack-gap)]')
    expect(mount(<SimpleGrid as="ul" />).tagName).toBe('UL')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const element = mount(
      <SimpleGrid>
        <p>甲</p>
        <p>乙</p>
      </SimpleGrid>,
    )
    await expectNoA11yViolations(element)
  })
})
