import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Anchor from './Anchor.vue'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

const items = [
  { id: 'a', label: '变体' },
  { id: 'b', label: '尺寸', children: [{ id: 'b1', label: '密度' }] },
]

describe('渲染', () => {
  it('nav 地标带 locale 兜底名，条目按层级缩进，轨道线在列表上，每一项占一行网格', () => {
    const w = mount(Anchor, { props: { items } })
    expect(w.find('nav').attributes('aria-label')).toBe('本页目录')
    expect(w.find('ul.border-s').classes()).toContain('grid')

    const links = w.findAll('a')
    expect(links.map(a => a.attributes('href'))).toEqual(['#a', '#b', '#b1'])
    expect(links[0]!.classes()).toContain('ps-3')
    expect(links[2]!.classes()).toContain('ps-6')
    expect(links[0]!.classes()).toContain('hn-link')
    expect(w.findAll('li').map(li => li.attributes('style'))).toEqual([
      'grid-row: 1;',
      'grid-row: 2;',
      'grid-row: 3;',
    ])
  })

  it('观测器报告之前没有活动项，也没有高亮条', () => {
    const w = mount(Anchor, { props: { items } })
    expect(w.findAll('a').some(a => a.attributes('aria-current'))).toBe(false)
    expect(w.find('.bg-accent').exists()).toBe(false)
  })

  it('点击拦截默认跳转，scrollIntoView + 写 hash + 立即置活动态，高亮条跨它那一行', async () => {
    for (const id of ['a', 'b']) {
      const target = document.createElement('div')
      target.id = id
      document.body.appendChild(target)
    }
    const scrolled = vi.fn()
    Element.prototype.scrollIntoView = scrolled

    const w = mount(Anchor, { props: { items } })
    await w.findAll('a')[1]!.trigger('click')

    expect(scrolled).toHaveBeenCalledWith(expect.objectContaining({ block: 'start' }))
    expect(location.hash).toBe('#b')
    expect(w.findAll('a')[1]!.attributes('aria-current')).toBe('location')
    expect(w.findAll('a')[1]!.classes()).toContain('font-medium')
    expect(w.find('.bg-accent').attributes('style')).toBe('grid-row: 2 / 3;')
    expect(w.find('.bg-accent').attributes('aria-hidden')).toBe('true')
  })
})

describe('服务端渲染', () => {
  it('首屏不猜活动项：没有高亮条，也没有 aria-current', async () => {
    const html = await renderToString(
      createSSRApp(defineComponent({ render: () => h(Anchor, { items }) })),
    )
    expect(html).not.toContain('bg-accent')
    expect(html).not.toContain('aria-current')
    expect(html.match(/grid-row:/g)).toHaveLength(3)
  })
})

describe('a11y', () => {
  it('无 a11y 违规，含高亮条那一行', async () => {
    for (const id of ['a', 'b']) {
      const target = document.createElement('div')
      target.id = id
      document.body.appendChild(target)
    }
    Element.prototype.scrollIntoView = vi.fn()
    const w = mount(Anchor, {
      props: { items },
      attachTo: document.body,
      global: { stubs: { transition: false } },
    })
    await w.findAll('a')[1]!.trigger('click')
    expect(w.find('.bg-accent').exists()).toBe(true)
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
