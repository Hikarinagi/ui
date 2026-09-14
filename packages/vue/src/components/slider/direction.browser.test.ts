import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from '@vitest/browser/context'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, reactive, type Component } from 'vue'
import { ConfigProvider, type Direction } from 'reka-ui'
import Slider from './Slider.vue'
import RangeSlider from '../range-slider/RangeSlider.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
const hosts: HTMLElement[] = []
const marks = [0, 25, 60, 100].map(value => ({ value, label: String(value) }))

afterEach(() => {
  mounted.splice(0).forEach(w => w.unmount())
  hosts.splice(0).forEach(host => host.remove())
})

function setup(
  component: Component,
  range: boolean,
  props: Record<string, unknown> = {},
  mode: 'prop' | 'provider' | 'dom' = 'prop',
) {
  const host = document.createElement('div')
  host.style.cssText = 'width: 360px; padding: 40px'
  if (mode === 'dom') host.dir = 'rtl'
  document.body.append(host)
  hosts.push(host)
  const state = reactive({
    modelValue: range ? ([25, 60] as [number, number]) : 25,
    dir: mode === 'prop' ? ('rtl' as Direction | undefined) : undefined,
    ...props,
  })
  const config = reactive({ dir: 'rtl' as Direction })
  const render = () =>
    h(component, {
      ...state,
      marks,
      label: 'none',
      step: 5,
      'aria-label': 'Value',
      'onUpdate:modelValue': (value: number | [number, number]) => (state.modelValue = value),
    })
  const wrapper = mount(
    { render: () => (mode === 'provider' ? h(ConfigProvider, config, render) : render()) },
    { attachTo: host },
  )
  mounted.push(wrapper)
  const root = wrapper.find('[data-hn-state-group]').element as HTMLElement
  const track = root.firstElementChild as HTMLElement
  const thumbs = Array.from(root.querySelectorAll<HTMLElement>('[role="slider"]'))
  const fill = track.querySelector<HTMLElement>('.bg-accent')!
  const labels = Array.from(root.querySelectorAll<HTMLElement>(':scope > [aria-hidden] > span'))
  const points = Array.from(track.querySelectorAll<HTMLElement>('[aria-hidden] > span'))
  return { state, config, host, root, track, thumbs, fill, labels, points }
}

const center = (element: Element) => {
  const r = element.getBoundingClientRect()
  return r.left + r.width / 2
}

for (const [name, component, range] of [
  ['Slider', Slider, false],
  ['RangeSlider', RangeSlider, true],
] as const) {
  describe(name, () => {
    for (const mode of ['prop', 'provider', 'dom'] as const) {
      it(`resolves ${mode} RTL for the track, labels, clicks and keyboard`, async () => {
        const { state, root, track, thumbs, labels } = setup(component, range, {}, mode)
        await vi.waitFor(() => expect(track.getAttribute('dir')).toBe('rtl'))
        expect(getComputedStyle(root).direction).toBe('rtl')
        expect(center(labels[0]!)).toBeGreaterThan(center(labels.at(-1)!))
        thumbs[0]!.focus()
        await userEvent.keyboard('{ArrowRight}')
        await vi.waitFor(() => expect(state.modelValue).toEqual(range ? [20, 60] : 20))
        await userEvent.keyboard('{ArrowLeft}')
        await vi.waitFor(() => expect(state.modelValue).toEqual(range ? [25, 60] : 25))
        const r = track.getBoundingClientRect()
        await userEvent.click(track, { position: { x: r.width * 0.2, y: r.height / 2 } })
        await vi.waitFor(() => expect(state.modelValue).toEqual(range ? [25, 80] : 80))
      })
    }

    for (const size of ['sm', 'md', 'lg'] as const) {
      it(`keeps ${size} thumbs, fill, marks and labels aligned in both directions`, async () => {
        const { state, track, thumbs, fill, labels, points } = setup(component, range, { size })
        for (const dir of ['rtl', 'ltr'] as const) {
          state.dir = dir
          for (const [a, b] of [
            [0, 0],
            [25, 60],
            [100, 100],
          ]) {
            state.modelValue = range ? [a!, b!] : a!
            await vi.waitFor(() => {
              expect(track.getAttribute('dir')).toBe(dir)
              const r = track.getBoundingClientRect()
              const t = thumbs.map(thumb => thumb.getBoundingClientRect())
              const width = t[0]!.width
              const x = (value: number) => {
                const offset = 4 + width / 2 + ((r.width - width - 8) * value) / 100
                return dir === 'rtl' ? r.right - offset : r.left + offset
              }
              expect(Math.abs(center(thumbs[0]!) - x(a!))).toBeLessThan(0.5)
              if (range) expect(Math.abs(center(thumbs[1]!) - x(b!))).toBeLessThan(0.5)
              const f = fill.getBoundingClientRect()
              const low = t[0]!
              const high = t.at(-1)!
              expect(
                Math.abs(f.left - (dir === 'rtl' ? high.left - 4 : range ? low.left - 4 : r.left)),
              ).toBeLessThan(0.5)
              expect(
                Math.abs(
                  f.right - (dir === 'rtl' ? (range ? low.right + 4 : r.right) : high.right + 4),
                ),
              ).toBeLessThan(0.5)
              for (let i = 0; i < marks.length; i++) {
                expect(Math.abs(center(points[i]!) - x(marks[i]!.value))).toBeLessThan(0.5)
                expect(Math.abs(center(labels[i]!) - x(marks[i]!.value))).toBeLessThan(0.5)
              }
            })
          }
        }
      })
    }

    for (const mode of ['provider', 'dom'] as const) {
      it(`updates inherited ${mode} direction and respects an explicit override`, async () => {
        const { state, config, host, root, track, thumbs } = setup(component, range, {}, mode)
        await vi.waitFor(() => expect(track.getAttribute('dir')).toBe('rtl'))
        state.dir = 'ltr'
        await vi.waitFor(() => expect(track.getAttribute('dir')).toBe('ltr'))
        expect(getComputedStyle(root).direction).toBe('ltr')
        thumbs[0]!.focus()
        await userEvent.keyboard('{ArrowRight}')
        await vi.waitFor(() => expect(state.modelValue).toEqual(range ? [30, 60] : 30))
        state.dir = undefined
        await vi.waitFor(() => expect(track.getAttribute('dir')).toBe('rtl'))
        if (mode === 'provider') config.dir = 'ltr'
        else host.dir = 'ltr'
        await vi.waitFor(() => expect(track.getAttribute('dir')).toBe('ltr'))
        if (mode === 'provider') config.dir = 'rtl'
        else host.dir = 'rtl'
        await vi.waitFor(() => expect(track.getAttribute('dir')).toBe('rtl'))
        expect(getComputedStyle(root).direction).toBe('rtl')
      })
    }
  })
}
