import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, toRaw } from 'vue'
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

it('exposes and emits the current id, including reset, without duplicate metadata notifications', async () => {
  history.replaceState(null, '', location.pathname)
  document.body.innerHTML = '<section id="current-target"></section>'
  Element.prototype.scrollIntoView = vi.fn()
  const w = mount(Anchor, {
    props: { items: [{ id: 'current-target', label: 'Target' }], autoScroll: false },
  })
  const api = w.vm as unknown as { readonly current: string | undefined }
  expect(api.current).toBeUndefined()
  expect(w.emitted('change')).toBeUndefined()
  await w.get('a').trigger('click')
  expect(api.current).toBe('current-target')
  expect(w.emitted('change')).toEqual([['current-target']])
  await w.setProps({ items: [{ id: 'current-target', label: 'Renamed' }] })
  expect(w.emitted('change')).toHaveLength(1)
  await w.setProps({ items: [] })
  expect(api.current).toBeUndefined()
  expect(w.emitted('change')).toEqual([['current-target'], [undefined]])
  w.unmount()
  history.replaceState(null, '', location.pathname)
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

describe('trailing slot', () => {
  it('passes the original parent and child items and keeps their link behavior', async () => {
    const child = { id: 'trailing-child', label: 'Child', modified: true }
    const parent = { id: 'trailing-parent', label: 'Parent', modified: false, children: [child] }
    const received = new Map<string, unknown>()
    document.body.innerHTML =
      '<section id="trailing-parent"></section><section id="trailing-child"></section>'
    const scrolled = vi.fn()
    Element.prototype.scrollIntoView = scrolled
    const wrapper = mount(Anchor<typeof parent>, {
      props: { items: [parent] },
      slots: {
        trailing: ({ item, active }: { item: typeof child; active: boolean }) => {
          received.set(item.id, toRaw(item))
          return h(
            'span',
            { 'data-mark': item.id, 'data-active': String(active) },
            item.modified ? 'Modified' : 'Unchanged',
          )
        },
      },
      attachTo: document.body,
      global: { stubs: { transition: false } },
    })
    expect(received.get(parent.id)).toBe(parent)
    expect(received.get(child.id)).toBe(child)
    const mark = wrapper.find('[data-mark="trailing-child"]')
    await mark.trigger('click')
    expect(scrolled).toHaveBeenCalledOnce()
    expect(location.hash).toBe('#trailing-child')
    expect(mark.attributes('data-active')).toBe('true')
    expect(mark.element.closest('a')?.getAttribute('aria-current')).toBe('location')
    expect(wrapper.find('[data-mark="trailing-parent"]').attributes('data-active')).toBe('false')
    await expectNoA11yViolations(wrapper.element as HTMLElement)
    wrapper.unmount()
  })

  it('updates item metadata without resetting the current location but resets for changed target ids', async () => {
    const target = document.createElement('section')
    target.id = 'mark-status'
    document.body.appendChild(target)
    Element.prototype.scrollIntoView = vi.fn()
    const wrapper = mount(Anchor<{ id: string; label: string; modified: boolean }>, {
      props: { items: [{ id: target.id, label: 'Status', modified: false }] },
      slots: {
        trailing: ({ item, active }: { item: { modified: boolean }; active: boolean }) =>
          h('span', { 'data-mark': '', 'data-active': String(active) }, String(item.modified)),
      },
    })
    await wrapper.find('a').trigger('click')
    await wrapper.setProps({ items: [{ id: target.id, label: 'Renamed', modified: true }] })
    expect(wrapper.find('a').attributes('aria-current')).toBe('location')
    expect(wrapper.find('[data-mark]').text()).toBe('true')
    expect(wrapper.find('[data-mark]').attributes('data-active')).toBe('true')
    expect(wrapper.find('a').text()).toContain('Renamed')
    await wrapper.setProps({
      items: [{ id: 'different-target', label: 'Different', modified: false }],
    })
    expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    expect(wrapper.find('[data-mark]').attributes('data-active')).toBe('false')
    wrapper.unmount()
  })
})
