import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { NumberFormat, type NumberFormatProps } from './NumberFormat'
import { UiLocaleProvider, enUS } from '../../locale'
import { expectNoA11yViolations } from '../../../test/axe'

afterEach(cleanup)

const mount = (ui: ReactNode) => render(ui).container.firstElementChild as HTMLElement
const text = (el: Element) => el.textContent?.trim()

function inEnglish(props: NumberFormatProps) {
  return mount(
    <UiLocaleProvider messages={enUS}>
      <NumberFormat {...props} />
    </UiLocaleProvider>,
  )
}

describe('四档格式', () => {
  it('decimal 默认分组', () => {
    expect(text(mount(<NumberFormat value={1234567.891} />))).toBe('1,234,567.891')
  })

  it('compact 随 locale:zh 出万,en 出 K,title 带全量数字', () => {
    const zh = mount(<NumberFormat value={12000} format="compact" />)
    expect(text(zh)).toBe('1.2万')
    expect(zh.getAttribute('title')).toBe('12,000')
    expect(text(inEnglish({ value: 12000, format: 'compact' }))).toBe('12K')
  })

  it('percent 与 currency', () => {
    expect(text(mount(<NumberFormat value={0.42} format="percent" />))).toBe('42%')
    const cny = mount(<NumberFormat value={1234.5} format="currency" currency="CNY" />)
    expect(text(cny)).toContain('¥')
    expect(text(cny)).toContain('1,234.50')
  })

  it('currency 档缺 currency 代码时退回 decimal', () => {
    expect(text(mount(<NumberFormat value={1234.5} format="currency" />))).toBe('1,234.5')
  })

  it('precision 收窄小数位', () => {
    expect(text(mount(<NumberFormat value={3.14159} precision={2} />))).toBe('3.14')
  })
})

describe('非法值', () => {
  it('null / NaN / Infinity 一律出占位横线,无 title', () => {
    for (const value of [null, Number.NaN, Number.POSITIVE_INFINITY]) {
      const el = mount(<NumberFormat value={value} />)
      expect(text(el)).toBe('—')
      expect(el.getAttribute('title')).toBeNull()
    }
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const el = mount(<NumberFormat value={42} />)
    await expectNoA11yViolations(el)
  })
})
