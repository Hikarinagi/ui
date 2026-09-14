import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Pagination from './Pagination.vue'
import { enUS, provideUiLocale, zhCN } from '../../locale'
import { expectNoA11yViolations } from '../../../test/axe'

let mounted: VueWrapper[] = []
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
})

function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(Pagination, { props: { total: 200, ...props }, attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

const values = (wrapper: VueWrapper) =>
  wrapper.findAll('[data-type="page"]').map(node => Number(node.text()))
const action = (wrapper: VueWrapper, name: string) =>
  wrapper.find('[data-hn-pagination-action="' + name + '"]')

describe('Pagination', () => {
  it('renders a named navigation landmark, selected page and disabled boundary controls', () => {
    const w = render({ showFirstLast: true })
    expect(w.find('nav').exists()).toBe(true)
    expect(w.find('nav').attributes('aria-label')).toBe(zhCN.pagination.navLabel)
    expect(w.find('[aria-current="page"]').text()).toBe('1')
    expect(action(w, 'first').attributes('disabled')).toBeDefined()
    expect(action(w, 'prev').attributes('disabled')).toBeDefined()
    expect(action(w, 'next').attributes('disabled')).toBeUndefined()
    expect(action(w, 'last').attributes('disabled')).toBeUndefined()
    expect(w.find('[data-type="page"]').attributes('aria-label')).toBe(zhCN.pagination.pageLabel(1))
    expect(w.findAll('button').every(button => button.attributes('type') === 'button')).toBe(true)
    expect(
      w
        .findAll('[data-type="ellipsis"]')
        .every(node => node.attributes('aria-haspopup') === 'dialog'),
    ).toBe(true)
  })

  it('uses sibling and edge options to limit page ranges', async () => {
    const w = render({ modelValue: 10 })
    expect(values(w)).toEqual([1, 9, 10, 11, 20])
    expect(w.findAll('[data-type="ellipsis"]')).toHaveLength(2)
    await w.setProps({ siblingCount: 0 })
    expect(values(w)).toEqual([1, 10, 20])
    await w.setProps({ showEdges: false, siblingCount: 1 })
    expect(values(w)).toEqual([9, 10, 11])
    expect(w.findAll('[data-type="ellipsis"]')).toHaveLength(0)
  })

  it('keeps page selection valid as total, page size and the controlled value change', async () => {
    const w = render({ modelValue: 15 })
    await w.setProps({ total: 72 })
    expect(w.find('[aria-current="page"]').text()).toBe('8')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([8])
    expect(action(w, 'next').attributes('disabled')).toBeDefined()
    await w.setProps({ pageSize: 25 })
    expect(w.find('[aria-current="page"]').text()).toBe('3')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([3])
    await w.setProps({ modelValue: -4 })
    expect(w.find('[aria-current="page"]').text()).toBe('1')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([1])
  })

  it('handles empty totals and invalid numeric inputs without invalid ranges', async () => {
    const w = render({ total: 0, modelValue: 3, showFirstLast: true })
    expect(values(w)).toEqual([1])
    expect(
      w
        .findAll('[data-hn-pagination-action]')
        .every(node => node.attributes('disabled') !== undefined),
    ).toBe(true)
    await w.setProps({ total: Number.NaN, pageSize: 0, modelValue: Number.POSITIVE_INFINITY })
    expect(values(w)).toEqual([1])
    await w.setProps({ total: 21.9, pageSize: 10.9, modelValue: 2.8 })
    expect(values(w)).toEqual([1, 2, 3])
    expect(w.find('[aria-current="page"]').text()).toBe('2')
  })

  it('supports custom page content while preserving selection semantics', () => {
    const w = mount(Pagination, {
      props: { total: 30, modelValue: 2 },
      slots: { page: ({ page, selected }) => h('span', { 'data-active': selected }, 'P' + page) },
      attachTo: document.body,
    })
    mounted.push(w)
    expect(w.find('[aria-current="page"]').text()).toBe('P2')
    expect(w.find('[aria-current="page"] span[data-active]').attributes('data-active')).toBe('true')
    expect(w.find('[aria-current="page"]').attributes('aria-label')).toBe(
      zhCN.pagination.pageLabel(2),
    )
  })

  it('localizes navigation and page labels and passes accessibility checks', async () => {
    const w = mount(
      defineComponent({
        setup() {
          provideUiLocale(enUS)
          return () =>
            h(Pagination, {
              total: 200,
              modelValue: 10,
              showFirstLast: true,
              label: 'Results pages',
            })
        },
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    expect(w.find('nav').attributes('aria-label')).toBe('Results pages')
    expect(action(w, 'last').attributes('aria-label')).toBe(enUS.pagination.last)
    expect(w.find('[aria-current="page"]').attributes('aria-label')).toBe(
      enUS.pagination.pageLabel(10),
    )
    await expectNoA11yViolations(w.element)
  })
})
