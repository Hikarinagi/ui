import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('回退内容', () => {
  it('无 src 时按 name 取首字母,西文取前两个字母', () => {
    expect(mount(Avatar, { props: { name: 'Shion Hoshimi' } }).text()).toBe('SH')
    expect(mount(Avatar, { props: { name: 'ringyuki' } }).text()).toBe('RI')
  })

  it('中日韩文名只取第一个字', () => {
    expect(mount(Avatar, { props: { name: '星见书音' } }).text()).toBe('星')
    expect(mount(Avatar, { props: { name: 'ほしみ' } }).text()).toBe('ほ')
  })

  it('没有 name 时回退到图标', () => {
    const w = mount(Avatar)
    expect(w.text()).toBe('')
    expect(w.find('svg').exists()).toBe(true)
  })

  it('默认插槽覆盖内置回退', () => {
    const w = mount(Avatar, { props: { name: '星见书音' }, slots: { default: () => '★' } })
    expect(w.text()).toBe('★')
  })
})

describe('渲染', () => {
  it('默认 md 档、圆形、不可选中', () => {
    const w = mount(Avatar)
    expect(w.classes()).toContain('size-8')
    expect(w.classes()).toContain('rounded-full')
    expect(w.classes()).toContain('select-none')
  })

  it('size 换档', () => {
    expect(mount(Avatar, { props: { size: 'sm' } }).classes()).toContain('size-6')
    expect(mount(Avatar, { props: { size: 'lg' } }).classes()).toContain('size-10')
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Avatar, { props: { name: '星见书音' }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
