import type { CSSProperties } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import type { RenderResult } from 'vitest-browser-react'
import { Stack } from '../stack/Stack'
import { Button } from '../button/Button'
import { Ripple } from './Ripple'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

const wrappers: RenderResult[] = []
afterEach(async () => {
  for (const w of wrappers.splice(0)) await w.unmount()
  document.body.innerHTML = ''
})

const states = [
  { name: 'plain', attrs: {}, selected: false, grouped: false },
  { name: 'group press', attrs: {}, selected: false, grouped: true },
  { name: 'checked', attrs: { 'data-state': 'checked' }, selected: true, grouped: false },
  { name: 'selected', attrs: { 'data-state': 'selected' }, selected: true, grouped: false },
  { name: 'aria-selected', attrs: { 'aria-selected': 'true' }, selected: true, grouped: false },
  { name: 'aria-pressed', attrs: { 'aria-pressed': 'true' }, selected: true, grouped: false },
] as const

const layerStyle = {
  width: '300px',
  padding: '24px',
  '--hn-duration-fast': '0s',
} as CSSProperties

it.each(states)(
  'nested button ripples do not mute the $name state layer; an owned ripple still does',
  async state => {
    for (const owned of [false, true]) {
      const renderLayer = () => (
        <Stack
          as="article"
          className="hn-state-layer hn-interactive hn-press-none"
          {...state.attrs}
          style={layerStyle}
          data-layer=""
        >
          {owned ? <Ripple /> : null}
          <span>Feed content</span>
          <Button variant="ghost">Like</Button>
        </Stack>
      )
      const w = await mount(
        state.grouped ? (
          <div data-hn-state-group="" style={{ width: '320px', padding: '10px' }}>
            {renderLayer()}
          </div>
        ) : (
          renderLayer()
        ),
      )
      wrappers.push(w)
      const layer = w.container.querySelector('[data-layer]') as HTMLElement
      expect(layer.querySelector('button > .hn-ripple')).not.toBeNull()
      const style = getComputedStyle(layer)
      const token = (name: string) => Number(style.getPropertyValue(name))
      const opacity = () => Number(getComputedStyle(layer, '::after').opacity)
      const selected = state.selected ? token('--hn-state-selected-opacity') : 0
      const expected =
        selected + token(owned ? '--hn-state-hover-opacity' : '--hn-state-press-opacity')
      const target = state.grouped ? w.element : layer
      const click = userEvent.click(target, { delay: 350, position: { x: 4, y: 4 } }).then(() => {})
      try {
        await vi.waitFor(() => {
          expect(target.matches(':active')).toBe(true)
          if (state.grouped) expect(layer.matches(':active')).toBe(false)
          expect(opacity()).toBeCloseTo(expected, 4)
        })
      } finally {
        await click
        await w.unmount()
        wrappers.pop()
      }
    }
  },
)

it('a disabled ancestor keeps its state layer silent even when it contains a ripple button', async () => {
  const w = await mount(
    <Stack
      as="article"
      className="hn-state-layer hn-interactive"
      data-disabled=""
      style={layerStyle}
    >
      <Button>Like</Button>
    </Stack>,
  )
  wrappers.push(w)
  const host = w.element
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
