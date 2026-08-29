import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
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
  it('nav 地标带 locale 兜底名,条目按层级缩进,轨道线在容器上', () => {
    const w = mount(Anchor, { props: { items } })
    expect(w.find('nav').attributes('aria-label')).toBe('本页目录')
    expect(w.find('div.border-s').classes()).toContain('relative')

    const links = w.findAll('a')
    expect(links.map(a => a.attributes('href'))).toEqual(['#a', '#b', '#b1'])
    expect(links[0]!.classes()).toContain('ps-3')
    expect(links[2]!.classes()).toContain('ps-6')
    expect(links[0]!.classes()).toContain('hn-link')
  })

  it('点击拦截默认跳转,scrollIntoView + 写 hash + 立即置活动态', async () => {
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
    expect(w.find('.bg-accent').exists()).toBe(true)
  })
})

describe('a11y', () => {
  it('无 a11y 违规', async () => {
    const w = mount(Anchor, { props: { items }, attachTo: document.body })
    await expectNoA11yViolations(w.element as HTMLElement)
  })
})
