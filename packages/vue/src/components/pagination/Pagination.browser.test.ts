import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { ConfigProvider } from 'reka-ui'
import Pagination from './Pagination.vue'
import Button from '../button/Button.vue'
import '../../../test/browser.css'

let mounted: VueWrapper[] = []
beforeEach(() => {
  document.body.innerHTML = ''
})
afterEach(() => {
  mounted.forEach(wrapper => wrapper.unmount())
  mounted = []
})

function render(props: Record<string, unknown> = {}) {
  const w = mount(Pagination, {
    props: {
      total: 200,
      ...props,
      'onUpdate:modelValue': (modelValue: number) => w.setProps({ modelValue }),
    },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}

function action(w: VueWrapper, name: string) {
  return w.find('[data-hn-pagination-action="' + name + '"]').element as HTMLButtonElement
}
const selected = (w: VueWrapper) => w.find('[aria-current="page"]').text()

describe('Pagination interactions', () => {
  it('changes pages from every control and keeps a single selected page', async () => {
    const w = render({ showFirstLast: true })
    await userEvent.click(action(w, 'next'))
    expect(selected(w)).toBe('2')
    await userEvent.click(w.find('[data-type="page"][aria-label="第 4 页"]').element)
    expect(selected(w)).toBe('4')
    await userEvent.click(action(w, 'prev'))
    expect(selected(w)).toBe('3')
    await userEvent.click(action(w, 'last'))
    expect(selected(w)).toBe('20')
    expect(action(w, 'last').disabled).toBe(true)
    await userEvent.click(action(w, 'first'))
    expect(selected(w)).toBe('1')
    expect(action(w, 'prev').disabled).toBe(true)
    expect(w.findAll('[aria-current="page"]')).toHaveLength(1)
  })

  it('supports Tab, Enter and Space without submitting an enclosing form', async () => {
    const submit = vi.fn()
    const container = document.createElement('form')
    container.addEventListener('submit', event => {
      event.preventDefault()
      submit()
    })
    document.body.append(container)
    const w = render()
    container.append(w.element)
    await userEvent.tab()
    expect(document.activeElement).toBe(w.find('[aria-current="page"]').element)
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(selected(w)).toBe('2')
    const next = action(w, 'next')
    next.focus()
    await userEvent.keyboard(' ')
    expect(selected(w)).toBe('3')
    expect(document.activeElement).toBe(next)
    expect(submit).not.toHaveBeenCalled()
  })

  it('blocks all controls when disabled and resumes from the same page', async () => {
    const w = render({ disabled: true, modelValue: 5, showFirstLast: true })
    expect(
      w.findAll('button').every(button => (button.element as HTMLButtonElement).disabled),
    ).toBe(true)
    for (const button of w.findAll('button')) (button.element as HTMLButtonElement).click()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await w.setProps({ disabled: false })
    await userEvent.click(action(w, 'next'))
    expect(selected(w)).toBe('6')
  })

  it.each(
    (['comfortable', 'compact'] as const).flatMap(density =>
      (['sm', 'md', 'lg'] as const).map(size => ({ density, size })),
    ),
  )('keeps page buttons square in $density density at size $size', async ({ density, size }) => {
    const w = render({ size, modelValue: 2, total: 12000, showFirstLast: true })
    const host = w.element as HTMLElement
    host.dataset.density = density
    const button = mount(Button, {
      props: { size, iconOnly: true, 'aria-label': 'Reference' },
      slots: { default: () => 'A' },
      attachTo: host,
    })
    mounted.push(button)
    const side = (button.element as HTMLElement).offsetHeight
    for (const value of [2, 12, 123, 1000]) {
      await w.setProps({ modelValue: value })
      for (const item of w.findAll('[data-hn-pagination-content] button')) {
        const element = item.element as HTMLElement
        expect(element.offsetWidth).toBe(side)
        expect(element.offsetHeight).toBe(side)
        expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth)
      }
      const current = w.get('[aria-current="page"]')
      expect(current.text()).toBe(String(value))
      expect(current.attributes('aria-label')).toBe(`第 ${value} 页`)
      expect(getComputedStyle(current.element).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    }
    const page = w.get('[aria-current="page"]').element as HTMLElement
    expect(page.querySelector('[title]')).toBeNull()
  })

  it('contains long custom page content without widening or covering adjacent buttons', () => {
    const w = mount(Pagination, {
      props: { total: 50, modelValue: 2 },
      slots: { page: ({ page }: { page: number }) => h('span', `Custom page ${page}`) },
      attachTo: document.body,
    })
    mounted.push(w)
    const buttons = w.findAll('[data-type="page"]')
    for (const button of buttons) {
      const element = button.element as HTMLElement
      expect(element.offsetWidth).toBe(element.offsetHeight)
      expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth)
    }
    const first = buttons[0]!.element.getBoundingClientRect()
    const second = buttons[1]!.element.getBoundingClientRect()
    expect(first.right).toBeLessThan(second.left)
  })

  it('inherits and dynamically changes DOM direction, with explicit direction taking precedence', async () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.append(host)
    const page = mount(Pagination, { props: { total: 40, modelValue: 3 }, attachTo: host })
    mounted.push(page)
    const prev = action(page, 'prev')
    const next = action(page, 'next')
    await vi.waitFor(() =>
      expect(prev.querySelector('svg')?.classList.contains('rotate-180')).toBe(true),
    )
    expect(prev.getBoundingClientRect().left).toBeGreaterThan(next.getBoundingClientRect().left)
    host.dir = 'ltr'
    await vi.waitFor(() =>
      expect(prev.querySelector('svg')?.classList.contains('rotate-180')).toBe(false),
    )
    await page.setProps({ dir: 'rtl' })
    expect(prev.querySelector('svg')?.classList.contains('rotate-180')).toBe(true)
    expect(prev.getBoundingClientRect().left).toBeGreaterThan(next.getBoundingClientRect().left)
  })

  it('wraps within a narrow container without clipping controls', () => {
    const w = render({ modelValue: 10, showFirstLast: true })
    const nav = w.element as HTMLElement
    nav.style.width = '240px'
    const bounds = nav.getBoundingClientRect()
    expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth)
    const buttons = w.findAll('button').map(button => button.element.getBoundingClientRect())
    expect(new Set(buttons.map(button => button.top)).size).toBeGreaterThan(1)
    expect(
      buttons.every(button => button.left >= bounds.left && button.right <= bounds.right),
    ).toBe(true)
  })

  it('inherits ConfigProvider direction and still selects next numerically in RTL', async () => {
    const w = mount(
      defineComponent({
        setup: () => () => h(ConfigProvider, { dir: 'rtl' }, () => h(Pagination, { total: 40 })),
      }),
      { attachTo: document.body },
    )
    mounted.push(w)
    expect(w.find('[data-hn-pagination]').attributes('dir')).toBe('rtl')
    const next = action(w, 'next')
    expect(next.querySelector('svg')?.classList.contains('rotate-180')).toBe(true)
    await userEvent.click(next)
    expect(selected(w)).toBe('2')
  })
})
