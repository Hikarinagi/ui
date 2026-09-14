import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Pagination from './Pagination.vue'
import { enUS, provideUiLocale } from '../../locale'
import PaginationContent from './PaginationContent.vue'
import PaginationInfo from './PaginationInfo.vue'
import PaginationSize from './PaginationSize.vue'
import PaginationJump from './PaginationJump.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []
beforeEach(async () => {
  document.body.innerHTML = ''
  await page.viewport(1100, 720)
})
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
})
function render(props: Record<string, unknown> = {}) {
  const current = ref(10)
  const pageSize = ref(10)
  const total = ref(250)
  const pending = ref(false)
  const change = vi.fn()
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(Pagination, {
          modelValue: current.value,
          pageSize: pageSize.value,
          total: total.value,
          pending: pending.value,
          showInfo: true,
          showJump: true,
          pageSizeOptions: [10, 20, 50],
          ...props,
          'onUpdate:modelValue': (value: number) => {
            current.value = value
          },
          'onUpdate:pageSize': (value: number) => {
            pageSize.value = value
          },
          onChange: change,
        }),
    }),
    { attachTo: document.body },
  )
  mounted.push(w)
  return { w, current, pageSize, total, pending, change }
}

describe('Pagination state and composition', () => {
  it('submits one coherent change when selecting a new page size', async () => {
    const { w, current, pageSize, change } = render()
    await userEvent.click(w.get('[data-hn-pagination-size]').element)
    await vi.waitFor(() => expect(document.querySelector('[role="option"]')).not.toBeNull())
    const option = [...document.querySelectorAll('[role="option"]')].find(el =>
      el.textContent?.includes('20'),
    )!
    await userEvent.click(option)
    expect(current.value).toBe(1)
    expect(pageSize.value).toBe(20)
    expect(change.mock.calls).toEqual([[{ page: 1, pageSize: 20 }]])
    expect(w.get('[data-hn-pagination-info]').text()).toContain('1–20')
    expect(w.get('input').element.value).toBe('1')
  })

  it('does not take ownership away from controlled values after user changes', async () => {
    const { w, current, pageSize, change } = render()
    await userEvent.click(w.get('[data-hn-pagination-action="next"]').element)
    expect(change.mock.calls).toEqual([[{ page: 11, pageSize: 10 }]])
    current.value = 4
    pageSize.value = 20
    await nextTick()
    expect(w.get('[aria-current="page"]').text()).toBe('4')
    expect(w.get('[data-hn-pagination-info]').text()).toContain('61–80')
    expect(change).toHaveBeenCalledTimes(1)
  })

  it('waits for pending totals to settle before clamping the controlled page', async () => {
    const { w, current, total, pending, change } = render()
    pending.value = true
    total.value = 0
    await nextTick()
    expect(current.value).toBe(10)
    expect(change).not.toHaveBeenCalled()
    total.value = 250
    pending.value = false
    await nextTick()
    expect(w.get('[aria-current="page"]').text()).toBe('10')
    expect(change).not.toHaveBeenCalled()
    total.value = 42
    await nextTick()
    expect(current.value).toBe(5)
    expect(change.mock.calls).toEqual([[{ page: 5, pageSize: 10 }]])
  })

  it('commits jump input once on Enter and blur, normalizes bounds and cancels invalid input', async () => {
    const { w, current, change } = render()
    const input = w.get('input').element
    await userEvent.fill(input, '7')
    await userEvent.keyboard('{Enter}')
    await userEvent.tab()
    expect(current.value).toBe(7)
    expect(change.mock.calls).toEqual([[{ page: 7, pageSize: 10 }]])
    await userEvent.fill(input, 'abc')
    await userEvent.keyboard('{Enter}')
    expect(input.value).toBe('7')
    await userEvent.fill(input, '19')
    await userEvent.keyboard('{Escape}')
    expect(input.value).toBe('7')
    await userEvent.fill(input, '999')
    await userEvent.keyboard('{Enter}')
    expect(current.value).toBe(25)
    await userEvent.fill(input, '-2')
    await userEvent.tab()
    expect(current.value).toBe(1)
    expect(change).toHaveBeenCalledTimes(3)
  })

  it('composes controls and custom information through the default slot', async () => {
    const w = mount(Pagination, {
      props: { total: 140, modelValue: 3, pageSizeOptions: [10, 20], align: 'between' },
      slots: {
        default: () => [
          h(
            PaginationInfo,
            {},
            {
              default: (state: { from: number; to: number }) =>
                h('span', 'Range ' + state.from + '–' + state.to),
            },
          ),
          h(PaginationContent),
          h(PaginationSize),
          h(PaginationJump),
        ],
      },
      attachTo: document.body,
    })
    mounted.push(w)
    expect(w.get('[data-hn-pagination-info]').text()).toBe('Range 21–30')
    expect(w.findAll('nav')).toHaveLength(1)
    expect(w.findAll('[data-type="page"]').length).toBeGreaterThan(0)
    await expectNoA11yViolations(w.element)
  })

  it('keeps the list mounted when single-page navigation is hidden and shields it while pending', async () => {
    const w = mount(Pagination, {
      props: { total: 5, hideSinglePage: true },
      slots: { list: () => h('button', { type: 'button', 'data-list-item': '' }, 'Item') },
      attachTo: document.body,
    })
    mounted.push(w)
    const item = w.get('[data-list-item]').element
    expect(w.find('nav').exists()).toBe(false)
    await w.setProps({ pending: true })
    expect(item.closest('[inert]')).not.toBeNull()
    expect(w.get('[data-hn-pagination]').attributes('aria-busy')).toBe('true')
    await w.setProps({ total: 50, pending: false })
    expect(w.get('[data-list-item]').element).toBe(item)
    expect(w.find('nav').exists()).toBe(true)
    expect(item.closest('[inert]')).toBeNull()
  })

  it('wraps English page size and jump controls within a narrow container', () => {
    const w = mount(
      defineComponent({
        setup() {
          provideUiLocale(enUS)
          return () =>
            h(Pagination, {
              total: 246,
              showInfo: true,
              showJump: true,
              pageSizeOptions: [10, 20, 50],
              style: { width: '264px' },
            })
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    const nav = w.get('nav').element as HTMLElement
    expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth)
    const bounds = nav.getBoundingClientRect()
    expect(
      w.findAll('button,input').every(control => {
        const box = control.element.getBoundingClientRect()
        return box.left >= bounds.left && box.right <= bounds.right
      }),
    ).toBe(true)
  })

  it('uses actual item count for the information range and keeps empty ranges valid', async () => {
    const w = mount(Pagination, {
      props: { total: 250, modelValue: 10, itemCount: 4, showInfo: true },
      attachTo: document.body,
    })
    mounted.push(w)
    expect(w.get('[data-hn-pagination-info]').text()).toContain('91–94')
    await w.setProps({ itemCount: 0 })
    expect(w.get('[data-hn-pagination-info]').text()).toContain('0–0')
  })
})
