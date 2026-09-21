import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import Stack from '../stack/Stack.vue'
import Button from '../button/Button.vue'
import Ripple from './Ripple.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})

const states = [
  { name: 'plain', attrs: {}, selected: false, grouped: false },
  { name: 'group press', attrs: {}, selected: false, grouped: true },
  { name: 'checked', attrs: { 'data-state': 'checked' }, selected: true, grouped: false },
  { name: 'selected', attrs: { 'data-state': 'selected' }, selected: true, grouped: false },
  { name: 'aria-selected', attrs: { 'aria-selected': 'true' }, selected: true, grouped: false },
  { name: 'aria-pressed', attrs: { 'aria-pressed': 'true' }, selected: true, grouped: false },
]

it.each(states)(
  'nested button ripples do not mute the $name state layer; an owned ripple still does',
  async state => {
    for (const owned of [false, true]) {
      const renderLayer = () =>
        h(
          Stack,
          {
            as: 'article',
            class: 'hn-state-layer hn-interactive hn-press-none',
            ...state.attrs,
            style: 'width:300px;padding:24px;--hn-duration-fast:0s',
            'data-layer': '',
          },
          () => [
            owned ? h(Ripple) : null,
            h('span', 'Feed content'),
            h(Button, { variant: 'ghost' }, () => 'Like'),
          ],
        )
      const w = mount(
        {
          render: () =>
            state.grouped
              ? h('div', { 'data-hn-state-group': '', style: 'width:320px;padding:10px' }, [
                  renderLayer(),
                ])
              : renderLayer(),
        },
        { attachTo: document.body },
      )
      wrappers.push(w)
      const layer = w.get('[data-layer]').element as HTMLElement
      expect(layer.querySelector('button > .hn-ripple')).not.toBeNull()
      const style = getComputedStyle(layer)
      const token = (name: string) => Number(style.getPropertyValue(name))
      const opacity = () => Number(getComputedStyle(layer, '::after').opacity)
      const selected = state.selected ? token('--hn-state-selected-opacity') : 0
      const expected =
        selected + token(owned ? '--hn-state-hover-opacity' : '--hn-state-press-opacity')
      // Click group padding to exercise its descendant press selector without
      // making the state layer itself :active.
      const target = state.grouped ? (w.element as HTMLElement) : layer
      const click = userEvent.click(target, { delay: 350, position: { x: 4, y: 4 } }).then(() => {})
      try {
        await vi.waitFor(() => {
          expect(target.matches(':active')).toBe(true)
          if (state.grouped) expect(layer.matches(':active')).toBe(false)
          expect(opacity()).toBeCloseTo(expected, 4)
        })
      } finally {
        await click
        w.unmount()
        wrappers.pop()
      }
    }
  },
)

it('a disabled ancestor keeps its state layer silent even when it contains a ripple button', async () => {
  const w = mount(Stack, {
    props: { as: 'article', class: 'hn-state-layer hn-interactive' },
    attrs: { 'data-disabled': '', style: 'width:300px;padding:24px;--hn-duration-fast:0s' },
    slots: { default: () => h(Button, {}, () => 'Like') },
    attachTo: document.body,
  })
  wrappers.push(w)
  const host = w.element as HTMLElement
  const click = userEvent.click(host, { delay: 250, position: { x: 4, y: 4 } }).then(() => {})
  try {
    await vi.waitFor(() => {
      expect(host.matches(':active')).toBe(true)
      expect(getComputedStyle(host, '::after').opacity).toBe('0')
    })
  } finally {
    await click
  }
})
