import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { lucide } from '../../lib/icon'
import type { SelectOption } from '../select/types'
import { Listbox, type ListboxProps, type ListboxValue } from './Listbox'
import { signal, type Signal } from '../../../test/signal'
import '../../../test/browser.css'

const CheckIcon = lucide(Check)
type SlotProps = { option: SelectOption; selected: boolean }
type Slots = Partial<Record<'renderOption' | 'renderTrailing', (props: SlotProps) => ReactNode>>
const mounted: Array<{ unmount: () => Promise<void> | void }> = []
afterEach(async () => {
  for (const w of mounted.splice(0)) await w.unmount()
  document.body.innerHTML = ''
})

const options = [
  { value: 'first', label: 'First option' },
  { label: 'Group', options: [{ value: 'second', label: 'Second option' }] },
]

interface Built {
  w: { element: HTMLElement; setProps: (props: Partial<ListboxProps>) => Promise<void> }
  host: HTMLElement
  emitted: ListboxValue[]
}

async function build(props: Partial<ListboxProps> = {}, slots: Slots = {}): Promise<Built> {
  const host = document.createElement('div')
  host.style.cssText = 'width: 240px; background: rgb(30, 40, 50)'
  document.body.appendChild(host)
  const state: Signal<Partial<ListboxProps>> = signal(props)
  const emitted: ListboxValue[] = []
  function Harness() {
    const current = state.use()
    return (
      <Listbox
        options={options}
        {...current}
        {...slots}
        onValueChange={value => {
          emitted.push(value)
          state.value = { ...state.value, value }
        }}
        aria-label="Preferences"
      />
    )
  }
  const screen = await render(<Harness />, { container: host })
  mounted.push(screen)
  return {
    w: {
      element: host.firstElementChild as HTMLElement,
      setProps: async next => {
        state.value = { ...state.value, ...next }
        await new Promise(resolve => setTimeout(resolve, 0))
      },
    },
    host,
    emitted,
  }
}
const rect = (el: Element) => el.getBoundingClientRect()
const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(0.5)
const all = (el: Element, selector: string) => [...el.querySelectorAll<HTMLElement>(selector)]
const get = (el: Element, selector: string) => el.querySelector<HTMLElement>(selector)!

describe('Listbox embedded layout', () => {
  it('bare removes only the outer surface and fills its container; switching variants restores their surfaces', async () => {
    const { w, host } = await build()
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
      parseFloat(getComputedStyle(get(w.element, '[role="option"]')).borderRadius),
    ).toBeGreaterThan(0)
    await w.setProps({ variant: 'secondary' })
    expect(getComputedStyle(w.element).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(parseFloat(getComputedStyle(w.element).borderRadius)).toBeGreaterThan(0)
    await w.setProps({ variant: 'primary' })
    expect(getComputedStyle(w.element).borderTopWidth).toBe('1px')
    expect(getComputedStyle(w.element).boxShadow).not.toBe('none')
  })

  it('bare retains selected styling, grouped selection and disabled interaction', async () => {
    const { w, emitted } = await build({ variant: 'bare', value: 'first' })
    const rows = all(w.element, '[role="option"]')
    await vi.waitFor(() =>
      expect(parseFloat(getComputedStyle(rows[0]!, '::after').opacity)).toBeGreaterThan(0),
    )
    await userEvent.click(rows[1]!)
    expect(emitted[0]).toEqual('second')
    await w.setProps({ disabled: true })
    expect(getComputedStyle(w.element).opacity).toBe('0.5')
    rows[0]!.click()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(emitted).toHaveLength(1)
  })
})

describe('Listbox content padding', () => {
  for (const density of ['comfortable', 'compact']) {
    for (const variant of ['primary', 'secondary', 'bare'] as const) {
      it(`${variant} / ${density}: removes internal padding without shifting or narrowing the list`, async () => {
        const { w, host } = await build({ variant })
        host.dataset.density = density
        const list = get(w.element, '[role="listbox"]')
        const row = get(w.element, '[role="option"]')
        const groupLabel = get(w.element, '[role="group"]').firstElementChild!
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
    const { w } = await build({
      variant: 'bare',
      padded: false,
      maxHeight: '8rem',
      options: Array.from({ length: 25 }, (_, i) => ({ value: i, label: `Option ${i}` })),
    })
    const viewport = await vi.waitFor(() => {
      const el = w.element.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')
      expect(el).not.toBeNull()
      return el!
    })
    close(rect(w.element).height, 128)
    get(w.element, '[role="listbox"]').focus()
    for (let i = 0; i < 12; i++) await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  })
})

describe('Listbox trailing geometry', () => {
  for (const density of ['comfortable', 'compact']) {
    it(`${density}: an empty tail returns the indicator width and gap to the label for plain and grouped options`, async () => {
      const normal = await build({ variant: 'bare', padded: false, value: 'first' })
      const empty = await build(
        { variant: 'bare', padded: false, value: 'first' },
        { renderTrailing: () => null },
      )
      normal.host.dataset.density = density
      empty.host.dataset.density = density
      const normalRows = all(normal.w.element, '[role="option"]')
      const emptyRows = all(empty.w.element, '[role="option"]')
      for (let i = 0; i < normalRows.length; i++) {
        const row = normalRows[i]!
        const emptied = emptyRows[i]!
        const gap = parseFloat(getComputedStyle(row).columnGap)
        close(gap, density === 'compact' ? 4 : 6)
        close(rect(row.lastElementChild!).width, 16)
        close(rect(emptied.firstElementChild!).width - rect(row.firstElementChild!).width, 16 + gap)
        expect(emptied.children).toHaveLength(1)
        expect(empty.host.scrollWidth).toBe(empty.host.clientWidth)
      }
    })

    it(`${density}: counts and checks share one tail, with enough width for larger counts`, async () => {
      const { w, host } = await build(
        { variant: 'bare', padded: false, value: 'first' },
        {
          renderTrailing: ({ selected }) => (
            <span className="flex min-w-4 shrink-0 items-center justify-end" data-tail="">
              {selected ? <CheckIcon aria-hidden="true" /> : '12345'}
            </span>
          ),
        },
      )
      host.dataset.density = density
      const rows = all(w.element, '[role="option"]')
      const tail = () => get(rows[1]!, '[data-tail]')
      expect(rect(tail()).width).toBeGreaterThan(16)
      const right = rect(tail()).right
      await userEvent.click(tail())
      await vi.waitFor(() => expect(rows[1]!.getAttribute('aria-selected')).toBe('true'))
      expect(all(rows[1]!, 'svg')).toHaveLength(1)
      expect(rows[1]!.children).toHaveLength(2)
      expect(tail().textContent).toBe('')
      close(rect(tail()).width, 16)
      close(rect(tail()).right, right)
      expect(get(rows[0]!, '[data-tail]').textContent).toBe('12345')
      get(w.element, '[role="listbox"]').focus()
      await userEvent.keyboard('{ArrowUp}')
      await userEvent.keyboard('{Enter}')
      await vi.waitFor(() => expect(rows[0]!.getAttribute('aria-selected')).toBe('true'))
      expect(get(rows[1]!, '[data-tail]').textContent).toBe('12345')
      close(rect(tail()).right, right)
      expect(host.scrollWidth).toBe(host.clientWidth)
    })
  }
})
