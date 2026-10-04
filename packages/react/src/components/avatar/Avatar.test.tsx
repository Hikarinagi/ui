import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Avatar } from './Avatar'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

function mount(ui: ReactNode) {
  const screen = render(ui)
  return { ...screen, element: screen.container.firstElementChild as HTMLElement }
}

describe('回退内容', () => {
  it('无 src 时按 name 取首字母,西文取前两个字母', () => {
    expect(mount(<Avatar name="Shion Hoshimi" />).element.textContent).toBe('SH')
    expect(mount(<Avatar name="ringyuki" />).element.textContent).toBe('RI')
  })

  it('中日韩文名只取第一个字', () => {
    expect(mount(<Avatar name="星见书音" />).element.textContent).toBe('星')
    expect(mount(<Avatar name="ほしみ" />).element.textContent).toBe('ほ')
  })

  it('没有 name 时回退到图标', () => {
    const w = mount(<Avatar />)
    expect(w.element.textContent).toBe('')
    expect(w.element.querySelector('svg')).not.toBeNull()
  })

  it('默认插槽覆盖内置回退', () => {
    const w = mount(<Avatar name="星见书音">★</Avatar>)
    expect(w.element.textContent).toBe('★')
  })
})

describe('渲染', () => {
  it('默认 md 档、圆形、不可选中', () => {
    const w = mount(<Avatar />)
    expect(w.element.classList).toContain('size-8')
    expect(w.element.classList).toContain('rounded-full')
    expect(w.element.classList).toContain('select-none')
  })

  it('size 换档', () => {
    expect(mount(<Avatar size="sm" />).element.classList).toContain('size-6')
    expect(mount(<Avatar size="lg" />).element.classList).toContain('size-10')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(<Avatar name="星见书音" />)
    await expectNoA11yViolations(w.element)
  })
})
