import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import PrevNext from './PrevNext.vue'
import PrevNextLink from './PrevNextLink.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness(both = true) {
  return mount(
    defineComponent({
      setup: () => () =>
        h(PrevNext, {}, () => [
          ...(both ? [h(PrevNextLink, { direction: 'prev', href: '/a' }, () => '排版与字阶')] : []),
          h(PrevNextLink, { direction: 'next', href: '/b' }, () => 'Button 按钮'),
        ]),
    }),
    { attachTo: document.body },
  )
}

describe('结构与语义', () => {
  it('nav 地标取 locale 兜底名;两侧链接带 rel 与方向词', () => {
    const w = harness()
    expect(w.find('nav').attributes('aria-label')).toBe('翻页')
    const links = w.findAll('a')
    expect(links.length).toBe(2)
    expect(links[0]!.attributes('rel')).toBe('prev')
    expect(links[0]!.text()).toContain('上一页')
    expect(links[0]!.text()).toContain('排版与字阶')
    expect(links[1]!.attributes('rel')).toBe('next')
    expect(links[1]!.text()).toContain('下一页')
  })

  it('只有下一页时仍落在右列;方向词可覆写', () => {
    const w = harness(false)
    const link = w.find('a')
    expect(link.classes()).toContain('sm:col-start-2')

    const custom = mount(PrevNextLink, {
      props: { direction: 'next', label: '下一章' },
      attrs: { href: '/c' },
      slots: { default: () => '第二章' },
    })
    expect(custom.text()).toContain('下一章')
  })

  it('无障碍零违例', async () => {
    const w = harness()
    await expectNoA11yViolations(w.element)
  })
})
