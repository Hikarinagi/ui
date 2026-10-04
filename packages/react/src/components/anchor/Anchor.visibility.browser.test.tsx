import { afterEach, describe, expect, it, vi } from 'vitest'
import { Anchor } from './Anchor'
import { mount } from '../../../test/mount'
import '../../../test/browser.css'

afterEach(() => {
  document.body.innerHTML = ''
  history.replaceState(null, '', location.pathname)
})

async function render() {
  const wrapper = await mount(
    <div style={{ display: 'flex', gap: '16px' }}>
      <div data-viewport="" style={{ height: '200px', width: '300px', overflow: 'auto' }}>
        <section id="visible-a" style={{ height: '100px' }}>
          A
        </section>
        <div style={{ height: '600px' }}>Content between targets</div>
        <section id="visible-b" style={{ height: '100px' }}>
          B
        </section>
        <section id="visible-c" style={{ height: '100px' }}>
          C
        </section>
      </div>
      <Anchor items={['a', 'b', 'c'].map(key => ({ id: `visible-${key}`, label: key }))} />
    </div>,
  )
  const find = (selector: string) => wrapper.container.querySelector(selector)
  return {
    wrapper,
    viewport: find('[data-viewport]') as HTMLElement,
    current: () => find('a[aria-current]')?.getAttribute('href'),
    visible: () =>
      [...wrapper.container.querySelectorAll('a.font-medium')].map(link =>
        link.getAttribute('href'),
      ),
    span: () => (find('[data-hn-highlight]') as HTMLElement).style.gridRow,
  }
}

async function settle() {
  for (let i = 0; i < 4; i++) await new Promise(resolve => requestAnimationFrame(resolve))
}

describe('Anchor visibility across gaps', () => {
  it('does not merge the fallback location into the next observed range', async () => {
    const { viewport, current, visible, span } = await render()
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
    const { visible, span } = await render()
    await vi.waitFor(() => {
      expect(visible()).toEqual(['#visible-a'])
      expect(span()).toBe('1 / 2')
    })
  })
})
