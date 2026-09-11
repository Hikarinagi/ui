import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { Check } from '@lucide/vue'
import { createCommentVNode, h } from 'vue'
import type { SelectOption } from '../select/types'
import Listbox from './Listbox.vue'
import '../../../test/browser.css'

type SlotProps = { option: SelectOption; selected: boolean }
const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})

const options = [
  { value: 'first', label: 'First option' },
  { label: 'Group', options: [{ value: 'second', label: 'Second option' }] },
]
function build(
  props: Record<string, unknown> = {},
  slots: Partial<Record<'option' | 'trailing', (props: SlotProps) => unknown>> = {},
) {
  const host = document.createElement('div')
  host.style.cssText = 'width: 240px; background: rgb(30, 40, 50)'
  document.body.appendChild(host)
  const w = mount(Listbox, {
    attachTo: host,
    props: {
      options,
      ...props,
      'onUpdate:modelValue': (value?: string | number | null | Array<string | number>) =>
        w.setProps({ modelValue: value }),
    },
    slots,
    attrs: { 'aria-label': 'Preferences' },
  })
  mounted.push(w)
  return { w, host }
}
const rect = (el: Element) => el.getBoundingClientRect()
const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(0.5)

describe('Listbox embedded layout', () => {
  it('bare removes only the outer surface and fills its container; switching variants restores their surfaces', async () => {
    const { w, host } = build()
    expect(getComputedStyle(w.element).borderTopWidth).toBe('1px')
    expect(getComputedStyle(w.element).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    await w.setProps({ variant: 'bare' })
    const style = getComputedStyle(w.element)
    expect(style.borderTopWidth).toBe('0px')
    expect(style.borderRadius).toBe('0px')
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(
      style.boxShadow === 'none' ||
        style.boxShadow.match(/rgba?\([^)]+\)/g)?.every(color => color === 'rgba(0, 0, 0, 0)'),
    ).toBe(true)
    close(rect(w.element).width, rect(host).width)
    expect(
      parseFloat(getComputedStyle(w.get('[role="option"]').element).borderRadius),
    ).toBeGreaterThan(0)
    await w.setProps({ variant: 'secondary' })
    expect(getComputedStyle(w.element).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(parseFloat(getComputedStyle(w.element).borderRadius)).toBeGreaterThan(0)
    await w.setProps({ variant: 'primary' })
    expect(getComputedStyle(w.element).borderTopWidth).toBe('1px')
    expect(getComputedStyle(w.element).boxShadow).not.toBe('none')
  })

  it('bare retains selected styling, grouped selection and disabled interaction', async () => {
    const { w } = build({ variant: 'bare', modelValue: 'first' })
    const rows = w.findAll('[role="option"]')
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(rows[0]!.element, '::after').opacity)).toBeGreaterThan(0),
    )
    await userEvent.click(rows[1]!.element)
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['second'])
    await w.setProps({ disabled: true })
    expect(getComputedStyle(w.element).opacity).toBe('0.5')
    await rows[0]!.trigger('click')
    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })
})

describe('Listbox content padding', () => {
  for (const density of ['comfortable', 'compact']) {
    for (const variant of ['primary', 'secondary', 'bare']) {
      it(`${variant} / ${density}: removes internal padding without shifting or narrowing the list`, async () => {
        const { w, host } = build({ variant })
        host.dataset.density = density
        const list = w.get('[role="listbox"]').element
        const row = w.get('[role="option"]').element
        const groupLabel = w.get('[role="group"]').element.firstElementChild!
        const before = rect(row)
        const left = rect(w.element).left
        const width = rect(w.element).width
        expect(getComputedStyle(list).padding).toBe('4px')
        const rowPadding = getComputedStyle(row).padding
        const labelPadding = getComputedStyle(groupLabel).padding
        await w.setProps({ padded: false })
        expect(getComputedStyle(list).padding).toBe('0px')
        close(rect(w.element).left, left)
        close(rect(w.element).width, width)
        close(rect(row).left, before.left - 4)
        close(rect(row).width, before.width + 8)
        expect(getComputedStyle(row).padding).toBe(rowPadding)
        expect(getComputedStyle(groupLabel).padding).toBe(labelPadding)
        expect(host.scrollWidth).toBe(host.clientWidth)
        await w.setProps({ padded: true })
        close(rect(row).left, before.left)
        close(rect(row).width, before.width)
      })
    }
  }

  it('an unpadded bare list still respects maxHeight and scrolls to the keyboard highlight', async () => {
    const { w } = build({
      variant: 'bare',
      padded: false,
      maxHeight: '8rem',
      options: Array.from({ length: 25 }, (_, i) => ({ value: i, label: `Option ${i}` })),
    })
    const viewport = await vi.waitFor(() => {
      const el = w.find('[data-overlayscrollbars-viewport]')
      expect(el.exists()).toBe(true)
      return el.element as HTMLElement
    })
    close(rect(w.element).height, 128)
    ;(w.get('[role="listbox"]').element as HTMLElement).focus()
    for (let i = 0; i < 12; i++) await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  })
})

describe('Listbox trailing geometry', () => {
  for (const density of ['comfortable', 'compact']) {
    it(`${density}: an empty tail returns the indicator width and gap to the label for plain and grouped options`, () => {
      const normal = build({ variant: 'bare', padded: false, modelValue: 'first' })
      const empty = build(
        { variant: 'bare', padded: false, modelValue: 'first' },
        { trailing: () => createCommentVNode('v-if') },
      )
      normal.host.dataset.density = density
      empty.host.dataset.density = density
      const normalRows = normal.w.findAll('[role="option"]')
      const emptyRows = empty.w.findAll('[role="option"]')
      for (let i = 0; i < normalRows.length; i++) {
        const row = normalRows[i]!.element
        const emptied = emptyRows[i]!.element
        const gap = parseFloat(getComputedStyle(row).columnGap)
        close(gap, density === 'compact' ? 4 : 6)
        close(rect(row.lastElementChild!).width, 16)
        close(rect(emptied.firstElementChild!).width - rect(row.firstElementChild!).width, 16 + gap)
        expect(emptied.children).toHaveLength(1)
        expect(empty.host.scrollWidth).toBe(empty.host.clientWidth)
      }
    })

    it(`${density}: counts and checks share one tail, with enough width for larger counts`, async () => {
      const { w, host } = build(
        { variant: 'bare', padded: false, modelValue: 'first' },
        {
          trailing: ({ selected }: { option: SelectOption; selected: boolean }) =>
            h(
              'span',
              { class: 'flex min-w-4 shrink-0 items-center justify-end', 'data-tail': '' },
              selected ? h(Check, { 'aria-hidden': 'true' }) : '12345',
            ),
        },
      )
      host.dataset.density = density
      const rows = w.findAll('[role="option"]')
      const tail = () => rows[1]!.get('[data-tail]').element
      expect(rect(tail()).width).toBeGreaterThan(16)
      const right = rect(tail()).right
      await userEvent.click(tail())
      await vi.waitFor(() => expect(rows[1]!.attributes('aria-selected')).toBe('true'))
      expect(rows[1]!.findAll('svg')).toHaveLength(1)
      expect(rows[1]!.element.children).toHaveLength(2)
      expect(tail().textContent).toBe('')
      close(rect(tail()).width, 16)
      close(rect(tail()).right, right)
      expect(rows[0]!.get('[data-tail]').text()).toBe('12345')
      ;(w.get('[role="listbox"]').element as HTMLElement).focus()
      await userEvent.keyboard('{ArrowUp}')
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(rows[0]!.attributes('aria-selected')).toBe('true'))
      expect(rows[1]!.get('[data-tail]').text()).toBe('12345')
      close(rect(tail()).right, right)
      expect(host.scrollWidth).toBe(host.clientWidth)
    })
  }
})
