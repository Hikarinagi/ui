import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Inline } from './Inline'
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
  it('默认横排 + 换行 + 居中对齐,间距吃密度 token', () => {
    const w = mount(<Inline />)
    expect(w.classes()).toContain('flex')
    expect(w.classes()).toContain('flex-wrap')
    expect(w.classes()).toContain('items-center')
    expect(w.classes()).toContain('gap-[var(--hn-inline-gap)]')
    expect(w.classes()).not.toContain('flex-col')
  })

  it('wrap=false 换 nowrap,align 与 gap 码可覆写', () => {
    expect(mount(<Inline wrap={false} />).classes()).toContain('flex-nowrap')
    expect(mount(<Inline align="baseline" />).classes()).toContain('items-baseline')
    expect(mount(<Inline gap="xs" />).classes()).toContain('gap-1')
  })

  it('justify 落对应类,不传时不出现', () => {
    expect(mount(<Inline justify="between" />).classes()).toContain('justify-between')
    expect(mount(<Inline justify="evenly" />).classes()).toContain('justify-evenly')
    expect(
      mount(<Inline />)
        .classes()
        .join(' '),
    ).not.toContain('justify-')
  })

  it('as 换语义标签', () => {
    expect(mount(<Inline as="nav" />).element.tagName).toBe('NAV')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(
      <Inline>
        <span>甲</span>
        <span>乙</span>
      </Inline>,
    )
    await expectNoA11yViolations(w.element)
  })
})
