import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createRef } from 'react'
import { Anchor } from './Anchor'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { Tag } from '../tag/Tag'
import type { AnchorItem } from './types'
import { mount } from '../../../test/mount'
import { signal } from '../../../test/signal'
import '../../../test/browser.css'

interface Item extends AnchorItem {
  modified: boolean
  children?: Item[]
}

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
  history.replaceState(null, '', location.pathname)
})

describe('Anchor trailing layout and navigation', () => {
  it.each(['ltr', 'rtl'])(
    'keeps long labels and status marks in the link row and preserves click and keyboard navigation (%s)',
    async dir => {
      await page.viewport(900, 700)
      document.documentElement.dir = dir
      const state = signal<{ items: Item[] }>({
        items: [
          {
            id: 'trailing-parent',
            label: 'A-long-directory-label-without-any-spaces-that-must-still-fit',
            modified: true,
            children: [{ id: 'trailing-child', label: 'Child entry', modified: false }],
          },
        ],
      })
      const area = createRef<ScrollAreaHandle>()
      function Harness() {
        const { items } = state.use()
        return (
          <div className="flex gap-4">
            <ScrollArea ref={area} className="h-48 w-72">
              <section id="trailing-parent" className="h-96">
                Parent
              </section>
              <section id="trailing-child" className="h-96">
                Child
              </section>
            </ScrollArea>
            <Anchor<Item>
              items={items}
              className="w-44"
              renderTrailing={({ item, active }) =>
                item.modified ? (
                  <Tag
                    data-mark={item.id}
                    data-active={String(active)}
                    tone={active ? 'accent' : 'neutral'}
                  >
                    Modified
                  </Tag>
                ) : null
              }
            />
          </div>
        )
      }
      await mount(<Harness />)
      const nav = document.querySelector('nav')!
      const links = nav.querySelectorAll('a')
      const parent = links[0]!
      const child = links[1]!
      await vi.waitFor(() => expect(area.current?.viewport).toBeTruthy())
      await vi.waitFor(() => expect(parent.getAttribute('aria-current')).toBe('location'))
      const mark = parent.querySelector('[data-mark]')!
      expect(mark.getAttribute('data-active')).toBe('true')
      const label = parent.firstElementChild!
      const labelRect = label.getBoundingClientRect()
      const markRect = mark.getBoundingClientRect()
      const row = parent.getBoundingClientRect()
      expect(labelRect.height).toBeGreaterThan(markRect.height)
      expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth)
      expect(markRect.left).toBeGreaterThanOrEqual(row.left)
      expect(markRect.right).toBeLessThanOrEqual(row.right)
      expect(Math.abs(markRect.y + markRect.height / 2 - row.y - row.height / 2)).toBeLessThan(1)
      if (dir === 'rtl') expect(markRect.right).toBeLessThan(labelRect.left)
      else expect(markRect.left).toBeGreaterThan(labelRect.right)
      expect(getComputedStyle(child.lastElementChild!).display).toBe('none')
      const childStyle = getComputedStyle(child)
      expect(child.firstElementChild!.getBoundingClientRect().width).toBe(
        child.clientWidth -
          parseFloat(childStyle.paddingLeft) -
          parseFloat(childStyle.paddingRight),
      )
      state.value = {
        items: state.value.items.map(item => ({
          ...item,
          children: item.children!.map(entry => ({ ...entry, modified: true })),
        })),
      }
      await vi.waitFor(() => expect(child.querySelector('[data-mark]')).toBeTruthy())
      expect(parent.getAttribute('aria-current')).toBe('location')
      await userEvent.click(child.querySelector('[data-mark]')!)
      await vi.waitFor(() => {
        expect(area.current!.viewport!.scrollTop).toBeGreaterThan(300)
        expect(child.getAttribute('aria-current')).toBe('location')
        expect(child.querySelector('[data-mark]')!.getAttribute('data-active')).toBe('true')
      })
      expect(location.hash).toBe('#trailing-child')
      parent.focus()
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => {
        expect(area.current!.viewport!.scrollTop).toBeLessThan(1)
        expect(parent.getAttribute('aria-current')).toBe('location')
      })
      expect(nav.querySelectorAll('a,button,input,[tabindex="0"]')).toHaveLength(2)
      area.current!.viewport!.scrollTop = 350
      await vi.waitFor(() => {
        expect(parent.className).toContain('font-medium')
        expect(child.className).toContain('font-medium')
        expect(parent.querySelector('[data-mark]')!.getAttribute('data-active')).toBe('true')
        expect(child.querySelector('[data-mark]')!.getAttribute('data-active')).toBe('false')
      })
    },
  )
})
