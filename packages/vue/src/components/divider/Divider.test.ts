import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from './Divider.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('渲染', () => {
  it('默认横向语义分隔线,发丝线用 line token', () => {
    const w = mount(Divider)
    expect(w.attributes('role')).toBe('separator')
    expect(w.classes()).toContain('bg-line')
    expect(w.classes()).toContain('h-px')
  })

  it('vertical 竖线 + aria-orientation;decorative 退出 a11y 树', () => {
    const v = mount(Divider, { props: { orientation: 'vertical' } })
    expect(v.attributes('aria-orientation')).toBe('vertical')
    expect(v.classes()).toContain('w-px')

    const d = mount(Divider, { props: { decorative: true } })
    expect(d.attributes('role')).toBe('none')
  })

  it('带插槽文字时两侧发丝线夹居中标签', () => {
    const w = mount(Divider, { slots: { default: () => '第三卷' } })
    expect(w.text()).toBe('第三卷')
    expect(w.findAll('[role="none"]').length).toBe(2)
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Divider, { attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
