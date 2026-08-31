import { describe, expect, it, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Page from './Page.vue'
import PageHeader from './PageHeader.vue'
import PageBody from './PageBody.vue'
import PageAside from './PageAside.vue'
import Section from '../section/Section.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

function harness() {
  return mount(
    defineComponent({
      setup: () => () =>
        h(
          Page,
          {},
          {
            default: () => [
              h(
                PageHeader,
                { title: 'Button', description: '按钮组件的用法与变体。' },
                { actions: () => h('button', '源码') },
              ),
              h(PageBody, {}, () => [
                h(Section, { title: '变体', id: 'variants' }, () => h('p', '四种变体')),
                h(Section, { title: '尺寸', id: 'sizes' }, () => h('p', '三档尺寸')),
              ]),
            ],
            aside: () => h(PageAside, { label: '本页目录' }, () => h('p', '目录')),
          },
        ),
    }),
    { attachTo: document.body },
  )
}

describe('页面解剖', () => {
  it('Page = Container 定宽 + 纵向节奏 + 右侧栏行', () => {
    const w = harness()
    expect(w.classes()).toContain('mx-auto')
    expect(w.classes()).toContain('max-w-5xl')
    expect(w.classes()).toContain('py-8')
    expect(w.find('aside').exists()).toBe(true)
  })

  it('PageHeader:h1 唯一、描述 muted、actions 靠右;Section 出 h2 且带锚点 id', () => {
    const w = harness()
    const h1s = w.findAll('h1')
    expect(h1s.length).toBe(1)
    expect(h1s[0]!.text()).toBe('Button')
    expect(w.find('header').text()).toContain('按钮组件的用法与变体。')
    expect(w.find('header button').text()).toBe('源码')

    const sections = w.findAll('section')
    expect(sections.length).toBe(2)
    expect(sections[0]!.attributes('id')).toBe('variants')
    expect(sections[0]!.find('h2').text()).toBe('变体')
    expect(sections[0]!.classes().join(' ')).toContain('scroll-mt')
  })

  it('PageAside:xl 以下隐藏、内容 sticky、可带地标名;无 aside 槽则不渲染', () => {
    const w = harness()
    const aside = w.find('aside')
    const titleId = aside.attributes('aria-labelledby')
    expect(titleId).toBeTruthy()
    expect(aside.find(`#${titleId}`).text()).toBe('本页目录')
    expect(aside.classes()).toContain('hidden')
    expect(aside.classes()).toContain('xl:block')
    expect((aside.element.firstElementChild as HTMLElement).className).toContain('sticky')

    const bare = mount(Page, { slots: { default: () => h('p', '正文') } })
    expect(bare.find('aside').exists()).toBe(false)
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = harness()
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
