import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Container } from './Container'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (element: Element) => [...element.classList]

describe('渲染', () => {
  it('默认 md:居中、整宽、响应式页缘', () => {
    const element = mount(<Container />)
    expect(classes(element)).toContain('mx-auto')
    expect(classes(element)).toContain('w-full')
    expect(classes(element)).toContain('px-4')
    expect(classes(element)).toContain('sm:px-6')
    expect(classes(element)).toContain('max-w-5xl')
  })

  it('四档宽度切换,as 换语义标签', () => {
    expect(classes(mount(<Container size="sm" />))).toContain('max-w-3xl')
    expect(classes(mount(<Container size="xl" />))).toContain('max-w-7xl')
    expect(mount(<Container as="main" />).tagName).toBe('MAIN')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const element = mount(
      <Container>
        <p>内容</p>
      </Container>,
    )
    await expectNoA11yViolations(element)
  })
})
