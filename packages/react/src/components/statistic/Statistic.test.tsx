import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Statistic } from './Statistic'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement

describe('Statistic', () => {
  it('标签在上、数字按区域格式化、前后缀在两侧，变化为正时是成功色并带上升图标', async () => {
    const { container, unmount } = render(
      <Statistic
        label="本月阅读"
        value={12345}
        suffix="页"
        delta={0.124}
        deltaLabel="较上月"
        icon={<svg />}
      />,
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.textContent).toContain('本月阅读')
    expect(wrapper.textContent).toContain('12,345')
    expect(wrapper.textContent).toContain('页')
    expect(wrapper.textContent).toContain('+12.4%')
    expect(wrapper.textContent).toContain('较上月')
    const delta = wrapper.querySelector('.text-success-text')
    expect(delta).not.toBeNull()
    expect(delta!.querySelector('svg')).not.toBeNull()
    expect(wrapper.querySelector('[aria-hidden="true"].bg-subtle svg')).not.toBeNull()
    await expectNoA11yViolations(wrapper)
    unmount()
  })

  it('变化为负时是危险色；invert 反转好坏；为零时中性且没有箭头', () => {
    const down = mount(<Statistic label="退货" value={3} delta={-0.2} />)
    expect(down.querySelector('.text-danger-text')).not.toBeNull()
    expect(down.textContent).toContain('-20%')

    const inverted = mount(<Statistic label="退货" value={3} delta={-0.2} invert />)
    expect(inverted.querySelector('.text-success-text')).not.toBeNull()

    const flat = mount(<Statistic label="退货" value={3} delta={0} />)
    const delta = flat.querySelector('.text-muted.flex')
    expect(delta).not.toBeNull()
    expect(delta!.querySelector('svg')).toBeNull()
    expect(flat.textContent).toContain('0%')
  })

  it('字符串值原样显示，空值显示破折号，loading 时以骨架占位且不显示变化', () => {
    expect(mount(<Statistic label="状态" value="正常" />).textContent).toContain('正常')
    expect(mount(<Statistic label="状态" value={null} />).textContent).toContain('—')
    const loading = mount(<Statistic label="状态" value={12} delta={0.1} loading />)
    expect(loading.querySelector('.hn-skeleton')).not.toBeNull()
    expect(loading.textContent).not.toContain('12')
    expect(loading.textContent).not.toContain('%')
  })
})
