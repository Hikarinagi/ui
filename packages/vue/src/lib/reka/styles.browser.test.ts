import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, type Component } from 'vue'
import { userEvent } from 'vitest/browser'
import Select from '../../components/select/Select.vue'
import MultiSelect from '../../components/multi-select/MultiSelect.vue'
import Combobox from '../../components/combobox/Combobox.vue'
import MultiCombobox from '../../components/multi-combobox/MultiCombobox.vue'
import TreeSelect from '../../components/tree-select/TreeSelect.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  document.body.style.removeProperty('--hn-overlay-anchor-width')
  document.body.style.removeProperty('--hn-overlay-available-height')
})

describe('primitive runtime styles', () => {
  it.each([
    ['Select', Select, 'select', 'select'],
    ['MultiSelect', MultiSelect, 'multi-select', 'select'],
    ['Combobox', Combobox, 'combobox', 'combobox'],
    ['MultiCombobox', MultiCombobox, 'multi-combobox', 'combobox'],
    ['TreeSelect', TreeSelect, 'tree-select', 'tree-select'],
  ] as const)(
    '%s keeps live content dimensions independent of inherited measurements',
    async (_, component, anchorName, contentName) => {
      const host = document.createElement('div')
      host.style.cssText = 'padding: 24px; width: 320px'
      document.body.style.setProperty('--hn-overlay-anchor-width', '900px')
      document.body.style.setProperty('--hn-overlay-available-height', '1px')
      document.body.appendChild(host)
      const options = Array.from({ length: 50 }, (_, index) => ({
        value: index,
        label: `Item ${index}`,
      }))
      wrappers.push(
        mount(
          defineComponent({
            render: () =>
              h(component as Component, {
                ...(component === TreeSelect ? { items: options } : { options }),
                'aria-label': 'Choices',
              }),
          }),
          { attachTo: host },
        ),
      )
      const anchor = host.querySelector<HTMLElement>(`[data-hn-${anchorName}]`)!
      const trigger = anchor.querySelector<HTMLElement>('[role=combobox]') ?? anchor
      await userEvent.click(trigger)
      const content = await vi.waitFor(() => {
        const element = document.querySelector<HTMLElement>(`[data-hn-${contentName}-content]`)
        expect(element).toBeTruthy()
        expect(getComputedStyle(element!).transform).toBe('none')
        return element!
      })
      for (const width of [320, 420]) {
        host.style.width = `${width}px`
        await vi.waitFor(() => {
          const style = getComputedStyle(content)
          const box = content.getBoundingClientRect()
          expect(box.width).toBeCloseTo(anchor.getBoundingClientRect().width, 0)
          expect(parseFloat(style.getPropertyValue('--hn-overlay-anchor-width'))).toBeCloseTo(
            box.width,
            0,
          )
          expect(
            parseFloat(style.getPropertyValue('--hn-overlay-available-height')),
          ).toBeGreaterThan(100)
          expect(box.height).toBeGreaterThan(100)
          expect(box.bottom).toBeLessThanOrEqual(window.innerHeight + 1)
        })
      }
    },
  )
})
