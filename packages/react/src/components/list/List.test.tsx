import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { List } from './List'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement

describe('渲染', () => {
  it('默认 ul,ordered 时 ol', () => {
    expect(mount(<List />).tagName).toBe('UL')
    expect(mount(<List ordered />).tagName).toBe('OL')
  })

  it('插槽内容原样渲染', () => {
    const el = mount(
      <List>
        <li>甲</li>
        <li>乙</li>
      </List>,
    )
    expect([...el.querySelectorAll('li')].map(li => li.textContent?.trim())).toEqual(['甲', '乙'])
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const el = mount(
      <List>
        <li>甲</li>
        <li>乙</li>
      </List>,
    )
    await expectNoA11yViolations(el)
  })
})
