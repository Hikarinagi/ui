import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Divider } from './Divider'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (element: Element) => [...element.classList]

describe('渲染', () => {
  it('默认横向语义分隔线,发丝线用 line token', () => {
    const element = mount(<Divider />)
    expect(element.getAttribute('role')).toBe('separator')
    expect(classes(element)).toContain('bg-line')
    expect(classes(element)).toContain('h-px')
  })

  it('vertical 竖线 + aria-orientation;decorative 退出 a11y 树', () => {
    const v = mount(<Divider orientation="vertical" />)
    expect(v.getAttribute('aria-orientation')).toBe('vertical')
    expect(classes(v)).toContain('w-px')

    const d = mount(<Divider decorative />)
    expect(d.getAttribute('role')).toBe('none')
  })

  it('带插槽文字时两侧发丝线夹居中标签', () => {
    const element = mount(<Divider>第三卷</Divider>)
    expect(element.textContent?.trim()).toBe('第三卷')
    expect(element.querySelectorAll('[role="none"]').length).toBe(2)
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    await expectNoA11yViolations(mount(<Divider />))
  })
})
