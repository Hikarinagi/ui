import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Anchor from './Anchor.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
  history.replaceState(null, '', location.pathname)
})

function render() {
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h('div', { style: 'display:flex;gap:16px' }, [
          h('div', { 'data-viewport': '', style: 'height:200px;width:300px;overflow:auto' }, [
            h('section', { id: 'visible-a', style: 'height:100px' }, 'A'),
            h('div', { style: 'height:600px' }, 'Content between targets'),
            h('section', { id: 'visible-b', style: 'height:100px' }, 'B'),
            h('section', { id: 'visible-c', style: 'height:100px' }, 'C'),
          ]),
          h(Anchor, { items: ['a', 'b', 'c'].map(key => ({ id: `visible-${key}`, label: key })) }),
        ]),
    }),
    { attachTo: document.body, global: { stubs: { transition: false } } },
  )
  mounted.push(wrapper)
  return {
    wrapper,
    viewport: wrapper.find('[data-viewport]').element as HTMLElement,
    current: () => wrapper.find('a[aria-current]').attributes('href'),
    visible: () => wrapper.findAll('a.font-medium').map(link => link.attributes('href')),
    span: () => (wrapper.find('[data-hn-highlight]').element as HTMLElement).style.gridRow,
  }
}

async function settle() {
  for (let i = 0; i < 4; i++) await new Promise(resolve => requestAnimationFrame(resolve))
}

describe('Anchor visibility across gaps', () => {
  it('does not merge the fallback location into the next observed range', async () => {
    const { viewport, current, visible, span } = render()
    await vi.waitFor(() => expect(current()).toBe('#visible-a'))
    viewport.scrollTop = 350
    await settle()
    expect(visible()).toEqual(['#visible-a'])
    viewport.scrollTop = 700
    await vi.waitFor(() => {
      expect(current()).toBe('#visible-b')
      expect(visible()).toEqual(['#visible-b', '#visible-c'])
      expect(span()).toBe('2 / 4')
    })
    viewport.scrollTop = 350
    await settle()
    expect(visible()).toEqual(['#visible-b'])
    expect(span()).toBe('2 / 3')
    viewport.scrollTop = 0
    await vi.waitFor(() => {
      expect(visible()).toEqual(['#visible-a'])
      expect(span()).toBe('1 / 2')
    })
  })

  it('replaces an offscreen hash fallback when the observer reports the actual viewport', async () => {
    history.replaceState(null, '', '#visible-c')
    const { visible, span } = render()
    await vi.waitFor(() => {
      expect(visible()).toEqual(['#visible-a'])
      expect(span()).toBe('1 / 2')
    })
  })
})
