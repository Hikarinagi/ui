import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Section from './Section.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('Section', () => {
  it('有 title 时由标题命名,成为具名区域', async () => {
    const w = mount(Section, {
      props: { title: '基本信息' },
      slots: { default: () => '正文' },
      attachTo: document.body,
    })
    const heading = w.get('h2')
    expect(heading.text()).toBe('基本信息')
    expect(heading.attributes('id')).toBeTruthy()
    expect(w.attributes('aria-labelledby')).toBe(heading.attributes('id'))
    await expectNoA11yViolations(w.element)
  })

  it('没有 title 时不加 aria-labelledby', () => {
    const w = mount(Section, { slots: { default: () => '正文' } })
    expect(w.find('h2').exists()).toBe(false)
    expect(w.attributes('aria-labelledby')).toBeUndefined()
  })

  it('调用方自带名称时以调用方为准', () => {
    const labelled = mount(Section, {
      props: { title: '基本信息' },
      attrs: { 'aria-label': '资料' },
    })
    expect(labelled.attributes('aria-label')).toBe('资料')
    expect(labelled.attributes('aria-labelledby')).toBeUndefined()

    const referenced = mount(Section, {
      props: { title: '基本信息' },
      attrs: { 'aria-labelledby': 'outer' },
    })
    expect(referenced.attributes('aria-labelledby')).toBe('outer')
  })

  it('两个 Section 的标题 id 互不相同', () => {
    const w = mount({
      components: { Section },
      template: '<div><Section title="一" /><Section title="二" /></div>',
    })
    const [first, second] = w.findAll('h2').map(heading => heading.attributes('id'))
    expect(first).not.toBe(second)
  })
})
