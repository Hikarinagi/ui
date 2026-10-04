import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { DisclosureIcon } from './DisclosureIcon'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const classes = (el: Element) => [...el.classList]

describe('渲染', () => {
  it('默认渲染向下的图标,direction=end 渲染向行末的图标', () => {
    expect(mount(<DisclosureIcon />).querySelector('svg')).not.toBeNull()
    const down = mount(<DisclosureIcon />).outerHTML
    const end = mount(<DisclosureIcon direction="end" />).outerHTML
    expect(down).not.toBe(end)
  })

  it('恒为 aria-hidden —— 状态由触发器的 aria-expanded 播报,不重复', () => {
    expect(mount(<DisclosureIcon />).getAttribute('aria-hidden')).toBe('true')
    expect(mount(<DisclosureIcon open />).getAttribute('aria-hidden')).toBe('true')
  })

  it('插槽替换图标,旋转仍挂在外层不丢', () => {
    const el = mount(
      <DisclosureIcon open>
        <i className="custom-mark" />
      </DisclosureIcon>,
    )
    expect(el.querySelector('.custom-mark')).not.toBeNull()
    expect(el.querySelector('svg')).toBeNull()
    expect(classes(el)).toContain('rotate-180')
  })

  it('class 追加至根元素', () => {
    expect(classes(mount(<DisclosureIcon className="text-muted" />))).toContain('text-muted')
  })
})

describe('状态来源', () => {
  it('不传 open 时走 CSS,挂具名 group 变体类,不带静态旋转', () => {
    const down = classes(mount(<DisclosureIcon />))
    expect(down).toContain('group-data-open/hn-disclosure:rotate-180')
    expect(down).not.toContain('rotate-180')

    const end = classes(mount(<DisclosureIcon direction="end" />))
    expect(end).toContain('group-data-open/hn-disclosure:rotate-90')
    expect(end).not.toContain('rotate-90')
  })

  it('缺省的 open 必须留在 undefined —— Vue 会把可选 boolean 强制转 false,那样三态塌成两态', () => {
    const el = mount(<DisclosureIcon />)
    expect(classes(el).join(' ')).toContain('group-data-open')
  })

  it('传 open 时改用静态旋转,不再依赖祖先', () => {
    const opened = classes(mount(<DisclosureIcon open />))
    expect(opened).toContain('rotate-180')
    expect(opened.join(' ')).not.toContain('group-data-open')

    const closed = classes(mount(<DisclosureIcon open={false} />))
    expect(closed).not.toContain('rotate-180')
    expect(closed.join(' ')).not.toContain('group-data-open')
  })

  it('open 与 direction=end 组合为四分之一圈', () => {
    expect(classes(mount(<DisclosureIcon open direction="end" />))).toContain('rotate-90')
  })

  it('状态变更走 hn-transition,不写字面量时长', () => {
    expect(classes(mount(<DisclosureIcon />))).toContain('hn-transition')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const el = mount(<DisclosureIcon />)
    await expectNoA11yViolations(el)
  })
})
