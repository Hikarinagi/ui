import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Center } from './Center'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (element: Element) => [...element.classList]

describe('渲染', () => {
  it('默认块级 flex 双轴居中', () => {
    const element = mount(<Center />)
    expect(classes(element)).toContain('flex')
    expect(classes(element)).toContain('items-center')
    expect(classes(element)).toContain('justify-center')
    expect(classes(element)).not.toContain('inline-flex')
  })

  it('inline 切 inline-flex,as 换语义标签', () => {
    expect(classes(mount(<Center inline />))).toContain('inline-flex')
    expect(mount(<Center as="figure" />).tagName).toBe('FIGURE')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const element = mount(
      <Center>
        <p>居中内容</p>
      </Center>,
    )
    await expectNoA11yViolations(element)
  })
})
