import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import NumberFormat from './NumberFormat.vue'
import { provideUiLocale, enUS } from '../../locale'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function inEnglish(props: Record<string, unknown>) {
  const host = defineComponent({
    setup() {
      provideUiLocale(enUS)
      return () => h(NumberFormat, props)
    },
  })
  return mount(host)
}

describe('四档格式', () => {
  it('decimal 默认分组', () => {
    expect(mount(NumberFormat, { props: { value: 1234567.891 } }).text()).toBe('1,234,567.891')
  })

  it('compact 随 locale:zh 出万,en 出 K,title 带全量数字', () => {
    const zh = mount(NumberFormat, { props: { value: 12000, format: 'compact' } })
    expect(zh.text()).toBe('1.2万')
    expect(zh.attributes('title')).toBe('12,000')
    expect(inEnglish({ value: 12000, format: 'compact' }).text()).toBe('12K')
  })

  it('percent 与 currency', () => {
    expect(mount(NumberFormat, { props: { value: 0.42, format: 'percent' } }).text()).toBe('42%')
    const cny = mount(NumberFormat, {
      props: { value: 1234.5, format: 'currency', currency: 'CNY' },
    })
    expect(cny.text()).toContain('¥')
    expect(cny.text()).toContain('1,234.50')
  })

  it('currency 档缺 currency 代码时退回 decimal', () => {
    expect(mount(NumberFormat, { props: { value: 1234.5, format: 'currency' } }).text()).toBe(
      '1,234.5',
    )
  })

  it('precision 收窄小数位', () => {
    expect(mount(NumberFormat, { props: { value: 3.14159, precision: 2 } }).text()).toBe('3.14')
  })
})

describe('非法值', () => {
  it('null / NaN / Infinity 一律出占位横线,无 title', () => {
    for (const value of [null, Number.NaN, Number.POSITIVE_INFINITY]) {
      const w = mount(NumberFormat, { props: { value } })
      expect(w.text()).toBe('—')
      expect(w.attributes('title')).toBeUndefined()
    }
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(NumberFormat, { props: { value: 42 }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
