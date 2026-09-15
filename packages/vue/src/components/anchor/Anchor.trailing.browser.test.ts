import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, reactive, shallowRef } from 'vue'
import Anchor from './Anchor.vue'
import ScrollArea from '../scroll-area/ScrollArea.vue'
import Tag from '../tag/Tag.vue'
import type { AnchorItem } from './types'
import '../../../test/browser.css'

interface Item extends AnchorItem {
  modified: boolean
  children?: Item[]
}

const mounted: VueWrapper[] = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
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
      const state = reactive<{ items: Item[] }>({
        items: [
          {
            id: 'trailing-parent',
            label: 'A-long-directory-label-without-any-spaces-that-must-still-fit',
            modified: true,
            children: [{ id: 'trailing-child', label: 'Child entry', modified: false }],
          },
        ],
      })
      const area = shallowRef<InstanceType<typeof ScrollArea>>()
      mounted.push(
        mount(
          defineComponent({
            setup: () => () =>
              h('div', { class: 'flex gap-4' }, [
                h(ScrollArea, { ref: area, class: 'h-48 w-72' }, () => [
                  h('section', { id: 'trailing-parent', class: 'h-96' }, 'Parent'),
                  h('section', { id: 'trailing-child', class: 'h-96' }, 'Child'),
                ]),
                h(
                  Anchor<Item>,
                  { items: state.items, class: 'w-44' },
                  {
                    trailing: ({ item, active }: { item: Item; active: boolean }) =>
                      item.modified
                        ? h(
                            Tag,
                            {
                              'data-mark': item.id,
                              'data-active': String(active),
                              tone: active ? 'accent' : 'neutral',
                            },
                            () => 'Modified',
                          )
                        : null,
                  },
                ),
              ]),
          }),
          { attachTo: document.body },
        ),
      )
      const nav = document.querySelector('nav')!
      const links = nav.querySelectorAll('a')
      const parent = links[0]!
      const child = links[1]!
      await vi.waitFor(() => expect(area.value?.viewport).toBeTruthy())
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
      state.items = state.items.map(item => ({
        ...item,
        children: item.children!.map(entry => ({ ...entry, modified: true })),
      }))
      await vi.waitFor(() => expect(child.querySelector('[data-mark]')).toBeTruthy())
      expect(parent.getAttribute('aria-current')).toBe('location')
      await userEvent.click(child.querySelector('[data-mark]')!)
      await vi.waitFor(() => {
        expect(area.value!.viewport!.scrollTop).toBeGreaterThan(300)
        expect(child.getAttribute('aria-current')).toBe('location')
        expect(child.querySelector('[data-mark]')!.getAttribute('data-active')).toBe('true')
      })
      expect(location.hash).toBe('#trailing-child')
      parent.focus()
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => {
        expect(area.value!.viewport!.scrollTop).toBeLessThan(1)
        expect(parent.getAttribute('aria-current')).toBe('location')
      })
      expect(nav.querySelectorAll('a,button,input,[tabindex="0"]')).toHaveLength(2)
      area.value!.viewport!.scrollTop = 350
      await vi.waitFor(() => {
        expect(parent.className).toContain('font-medium')
        expect(child.className).toContain('font-medium')
        expect(parent.querySelector('[data-mark]')!.getAttribute('data-active')).toBe('true')
        expect(child.querySelector('[data-mark]')!.getAttribute('data-active')).toBe('false')
      })
    },
  )
})
