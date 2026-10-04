import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Grid } from './Grid'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (element: Element) => [...element.classList]

describe('渲染', () => {
  it('默认单列 + md 双轴密度间距', () => {
    const element = mount(<Grid />)
    expect(classes(element)).toContain('grid')
    expect(classes(element)).toContain('grid-cols-1')
    expect(classes(element)).toContain('gap-x-[var(--hn-inline-gap)]')
    expect(classes(element)).toContain('gap-y-[var(--hn-stack-gap)]')
  })

  it('cols 与 gap 码切换', () => {
    expect(classes(mount(<Grid cols={3} />))).toContain('grid-cols-3')
    expect(classes(mount(<Grid cols={12} />))).toContain('grid-cols-12')
    expect(classes(mount(<Grid gap="lg" />))).toContain('gap-6')
  })

  it('as 换语义标签', () => {
    expect(mount(<Grid as="ul" />).tagName).toBe('UL')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const element = mount(
      <Grid cols={2}>
        <p>甲</p>
        <p>乙</p>
      </Grid>,
    )
    await expectNoA11yViolations(element)
  })
})
