import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import type { ComponentType } from 'react'
import { Select } from './Select'
import { MultiSelect } from '../multi-select/MultiSelect'
import { Combobox } from '../combobox/Combobox'
import { MultiCombobox } from '../multi-combobox/MultiCombobox'
import '../../../test/browser.css'

const wrappers: Array<{ unmount: () => Promise<void> | void }> = []

afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
  document.body.style.removeProperty('--hn-overlay-anchor-width')
  document.body.style.removeProperty('--hn-overlay-available-height')
})

type AnyComponent = ComponentType<Record<string, unknown>>

describe('primitive runtime styles', () => {
  it.each([
    ['Select', Select as unknown as AnyComponent, 'select', 'select'],
    ['MultiSelect', MultiSelect as unknown as AnyComponent, 'multi-select', 'select'],
    ['Combobox', Combobox as unknown as AnyComponent, 'combobox', 'combobox'],
    ['MultiCombobox', MultiCombobox as unknown as AnyComponent, 'multi-combobox', 'combobox'],
  ] as const)(
    '%s keeps live content dimensions independent of inherited measurements',
    async (_, Component, anchorName, contentName) => {
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
        await render(<Component options={options} aria-label="Choices" />, { container: host }),
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
