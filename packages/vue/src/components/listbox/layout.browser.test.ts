import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import Listbox from './Listbox.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})

const options = [
  { value: 'first', label: 'First option' },
  { label: 'Group', options: [{ value: 'second', label: 'Second option' }] },
]
function build(props: Record<string, unknown> = {}) {
  const host = document.createElement('div')
  host.style.cssText = 'width: 240px; background: rgb(30, 40, 50)'
  document.body.appendChild(host)
  const w = mount(Listbox, {
    attachTo: host,
    props: { options, ...props },
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
