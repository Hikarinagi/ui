import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { renderToString } from 'react-dom/server'
import { Anchor, type AnchorHandle } from './Anchor'
import { expectNoA11yViolations } from '../../../test/axe'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(cleanup)

const items = [
  { id: 'a', label: '变体' },
  { id: 'b', label: '尺寸', children: [{ id: 'b1', label: '密度' }] },
]

const classes = (el: Element) => [...el.classList]

describe('渲染', () => {
  it('nav 地标带 locale 兜底名，条目按层级缩进，轨道线在列表上，每一项占一行网格', () => {
    const { container: w } = render(<Anchor items={items} />)
    expect(w.querySelector('nav')!.getAttribute('aria-label')).toBe('本页目录')
    expect(classes(w.querySelector('ul.border-s')!)).toContain('grid')

    const links = [...w.querySelectorAll('a')]
    expect(links.map(a => a.getAttribute('href'))).toEqual(['#a', '#b', '#b1'])
    expect(classes(links[0]!)).toContain('ps-3')
    expect(classes(links[2]!)).toContain('ps-6')
    expect(classes(links[0]!)).toContain('hn-link')
    expect([...w.querySelectorAll('li')].map(li => li.getAttribute('style'))).toEqual([
      'grid-row: 1;',
      'grid-row: 2;',
      'grid-row: 3;',
    ])
  })

  it('观测器报告之前没有活动项，也没有高亮条', () => {
    const { container: w } = render(<Anchor items={items} />)
    expect([...w.querySelectorAll('a')].some(a => a.getAttribute('aria-current'))).toBe(false)
    expect(w.querySelector('.bg-accent')).toBeNull()
  })

  it('点击拦截默认跳转，scrollIntoView + 写 hash + 立即置活动态，高亮条跨它那一行', async () => {
    for (const id of ['a', 'b']) {
      const target = document.createElement('div')
      target.id = id
      document.body.appendChild(target)
    }
    const scrolled = vi.fn()
    Element.prototype.scrollIntoView = scrolled

    const { container: w } = render(<Anchor items={items} />)
    fireEvent.click(w.querySelectorAll('a')[1]!)

    expect(scrolled).toHaveBeenCalledWith(expect.objectContaining({ block: 'start' }))
    expect(location.hash).toBe('#b')
    expect(w.querySelectorAll('a')[1]!.getAttribute('aria-current')).toBe('location')
    expect(classes(w.querySelectorAll('a')[1]!)).toContain('font-medium')
    expect(w.querySelector('.bg-accent')!.getAttribute('style')).toBe('grid-row: 2 / 3;')
    expect(w.querySelector('.bg-accent')!.getAttribute('aria-hidden')).toBe('true')
  })
})

describe('服务端渲染', () => {
  it('首屏不猜活动项：没有高亮条，也没有 aria-current', async () => {
    const html = renderToString(<Anchor items={items} />)
    expect(html).not.toContain('bg-accent')
    expect(html).not.toContain('aria-current')
    expect(html.match(/grid-row:/g)).toHaveLength(3)
  })
})

it('exposes and emits the current id, including reset, without duplicate metadata notifications', async () => {
  history.replaceState(null, '', location.pathname)
  document.body.innerHTML = '<section id="current-target"></section>'
  Element.prototype.scrollIntoView = vi.fn()
  const api = createRef<AnchorHandle>()
  const change = vi.fn()
  const w = render(
    <Anchor
      ref={api}
      items={[{ id: 'current-target', label: 'Target' }]}
      autoScroll={false}
      onChange={change}
    />,
  )
  expect(api.current!.current).toBeUndefined()
  expect(change).not.toHaveBeenCalled()
  fireEvent.click(w.container.querySelector('a')!)
  expect(api.current!.current).toBe('current-target')
  expect(change.mock.calls).toEqual([['current-target']])
  w.rerender(
    <Anchor
      ref={api}
      items={[{ id: 'current-target', label: 'Renamed' }]}
      autoScroll={false}
      onChange={change}
    />,
  )
  expect(change).toHaveBeenCalledTimes(1)
  await act(async () => {
    w.rerender(<Anchor ref={api} items={[]} autoScroll={false} onChange={change} />)
  })
  expect(api.current!.current).toBeUndefined()
  expect(change.mock.calls).toEqual([['current-target'], [undefined]])
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
    const { container: w } = render(<Anchor items={items} />)
    fireEvent.click(w.querySelectorAll('a')[1]!)
    expect(w.querySelector('.bg-accent')).not.toBeNull()
    await expectNoA11yViolations(w.firstElementChild!)
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
    const wrapper = render(
      <Anchor
        items={[parent]}
        renderTrailing={({ item, active }) => {
          received.set(item.id, item)
          return (
            <span data-mark={item.id} data-active={String(active)}>
              {item.modified ? 'Modified' : 'Unchanged'}
            </span>
          )
        }}
      />,
    )
    expect(received.get(parent.id)).toBe(parent)
    expect(received.get(child.id)).toBe(child)
    const mark = () => wrapper.container.querySelector('[data-mark="trailing-child"]')!
    fireEvent.click(mark())
    expect(scrolled).toHaveBeenCalledOnce()
    expect(location.hash).toBe('#trailing-child')
    expect(mark().getAttribute('data-active')).toBe('true')
    expect(mark().closest('a')?.getAttribute('aria-current')).toBe('location')
    expect(
      wrapper.container.querySelector('[data-mark="trailing-parent"]')!.getAttribute('data-active'),
    ).toBe('false')
    await expectNoA11yViolations(wrapper.container.firstElementChild!)
    wrapper.unmount()
  })

  it('updates item metadata without resetting the current location but resets for changed target ids', async () => {
    const target = document.createElement('section')
    target.id = 'mark-status'
    document.body.appendChild(target)
    Element.prototype.scrollIntoView = vi.fn()
    const view = (list: Array<{ id: string; label: string; modified: boolean }>) => (
      <Anchor
        items={list}
        renderTrailing={({ item, active }) => (
          <span data-mark="" data-active={String(active)}>
            {String(item.modified)}
          </span>
        )}
      />
    )
    const wrapper = render(view([{ id: target.id, label: 'Status', modified: false }]))
    const find = (selector: string) => wrapper.container.querySelector(selector)!
    fireEvent.click(find('a'))
    wrapper.rerender(view([{ id: target.id, label: 'Renamed', modified: true }]))
    expect(find('a').getAttribute('aria-current')).toBe('location')
    expect(find('[data-mark]').textContent).toBe('true')
    expect(find('[data-mark]').getAttribute('data-active')).toBe('true')
    expect(find('a').textContent).toContain('Renamed')
    await act(async () => {
      wrapper.rerender(view([{ id: 'different-target', label: 'Different', modified: false }]))
    })
    expect(find('a').getAttribute('aria-current')).toBeNull()
    expect(find('[data-mark]').getAttribute('data-active')).toBe('false')
    wrapper.unmount()
  })
})
